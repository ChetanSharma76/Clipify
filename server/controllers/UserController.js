import { Webhook } from "svix"
import userModel from "../models/userModel.js"
import transactionModel from "../models/transactionModel.js"
import razorpay from 'razorpay';

// Gateway Initialize
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

const clerkWebhooks = async (req, res) => {
  try {
    console.log("Webhook received. Verifying signature...");

    const payload = req.body;
    const headers = {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    };

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const evt = whook.verify(payload, headers);

    console.log("Webhook verified successfully. Event type:", evt.type);
    const { data, type } = evt;

    switch (type) {
      case 'user.created': {
        console.log("Attempting to create user with Clerk ID:", data.id);
        await userModel.create({
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
        });
        console.log("User successfully created in DB:", data.id);
        break;
      }

      case 'user.updated': {
        console.log("Attempting to update user with Clerk ID:", data.id);
        const updatedUser = await userModel.findOneAndUpdate(
          { clerkId: data.id }, 
          {
            // Update the fields that can be changed in Clerk
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email_addresses[0].email_address, 
            photo: data.image_url,
          },
          { new: true } 
        );

        if (updatedUser) {
          console.log("User successfully updated in DB:", updatedUser.clerkId);
        } else {
          console.warn("Update webhook received, but user not found in DB with Clerk ID:", data.id);
        }
        break;
      }

      case 'user.deleted': {
        // For delete events, the payload might be smaller, but it will have the ID.
        console.log("Attempting to delete user with Clerk ID:", data.id);
        const deletedUser = await userModel.findOneAndDelete({ clerkId: data.id });

        if (deletedUser) {
          console.log("User successfully deleted from DB:", deletedUser.clerkId);
        } else {
          console.warn("Delete webhook received, but user not found in DB with Clerk ID:", data.id);
        }
        break;
      }
      
      default:
        console.log("Unhandled event type:", type);
    }

    res.status(200).json({ success: true, message: "Webhook processed successfully." });
  } catch (err) {
    console.error("!!! WEBHOOK HANDLER FAILED !!! Error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
}

// API Controller function to get user available credits data
const userCredits = async (req, res) => {
    try {
        const { userId } = req.auth;

        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated." });
        }
        
        const userData = await userModel.findOne({ clerkId: userId });

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found in our database." });
        }

        res.json({ success: true, credits: userData.creditBalance });

    } catch (error) {
        console.error("Error fetching user credits:", error.message);
        res.status(500).json({ success: false, message: "An internal server error occurred." });
    }
}


// Payment API to add credits ( RazorPay )
const paymentRazorpay = async (req, res) => {
    try {

        const { clerkId, planId } = req.body

        const userData = await userModel.findOne({ clerkId })

        // checking for planId and userdata
        if (!userData || !planId) {
            return res.json({ success: false, message: 'Invalid Credentials' })
        }

        let credits, plan, amount, date

        // Switch Cases for different plans
        switch (planId) {
            case 'Basic':
                plan = 'Basic'
                credits = 100
                amount = 10
                break;

            case 'Advanced':
                plan = 'Advanced'
                credits = 500
                amount = 50
                break;

            case 'Business':
                plan = 'Basic'
                credits = 5000
                amount = 250
                break;

            default:
                return res.json({ success: false, message: 'plan not found' })
        }

        date = Date.now()

        // Creating Transaction Data
        const transactionData = {
            clerkId,
            plan,
            amount,
            credits,
            date
        }

        // Saving Transaction Data to Database
        const newTransaction = await transactionModel.create(transactionData)

        // Creating options to create razorpay Order
        const options = {
            amount: amount * 100,
            currency: process.env.CURRENCY,
            receipt: newTransaction._id,
        }

        // Creating razorpay Order
        await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.json({ success: false, message: error });
            }
            res.json({ success: true, order });
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API Controller function to verify razorpay payment
const verifyRazorpay = async (req, res) => {
    try {

        const { razorpay_order_id } = req.body;

        // Fetching order data from razorpay
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        // Checking for payment status
        if (orderInfo.status === 'paid') {
            const transactionData = await transactionModel.findById(orderInfo.receipt)
            if (transactionData.payment) {
                return res.json({ success: false, message: 'Payment Failed' })
            }

            // Adding Credits in user data
            const userData = await userModel.findOne({ clerkId: transactionData.clerkId })
            const creditBalance = userData.creditBalance + transactionData.credits
            await userModel.findByIdAndUpdate(userData._id, { creditBalance })

            // Marking the payment true 
            await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true })

            res.json({ success: true, message: "Credits Added" });
        }
        else {
            res.json({ success: false, message: 'Payment Failed' });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { clerkWebhooks, userCredits, paymentRazorpay, verifyRazorpay}