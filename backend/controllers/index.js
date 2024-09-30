const { User } = require("../model/index")
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')

require('dotenv').config();
const sendEmail = require('../utils/sendEmail')
const axios = require('axios');

const { jwtAuthMiddleware, generateToken } = require('../jwt')



async function handleUserSignup(req, res) {
    try {
        const { username, email, password } = await req.body
      

        const existingVerifiedUserByUsername = await User.findOne(
            { username, isVerified: true })

        if (existingVerifiedUserByUsername) {
            return res.status(400).json({ message: "Username already taken" , errorId: "signup_error_1" })
        }

        const existingUserByMail = await User.findOne({ email })
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        let savedUser

        if (existingUserByMail) {

            if (existingUserByMail.isVerified) {
                return res.status(400).json({ message: "User already exist with this email", errorId: "signup_error_2" })
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByMail.password = hashedPassword;
                existingUserByMail.verifyCode = verifyCode;
                existingUserByMail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByMail.save()
            }

        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            })
            savedUser = await newUser.save()

            const emailResponse = await sendEmail({ email, userId: savedUser._id, verifyCode })
            console.log(emailResponse)

            if (!emailResponse.response) {
                return res.status(500).json({ message: "error occured while sending verification code" , errorId: "signup_error_3" })
            }
            console.log("successfully created new user..wait for verification code...", newUser)

        }

        //send verification code
        // const emailResponse = await sendEmail({email, userId : newUser._id, verifyCode})
        // if (!emailResponse.success) {
        //     return res.status(500).json({ message: "error occured while sending verification code" })
        // }

        if (!savedUser || !savedUser._id) {
            return res.status(500).json({ message: "User creation or update failed" , errorId: "signup_error_4" });
        }

        const payload = {
            id: savedUser.email,
            username: savedUser.username
        }
        const token = generateToken(payload)
        console.log("token", token)
        return res.status(201).json({ message: "User created successfully... Verify your account via mail" })


    }

    catch (error) {
        console.log(error)
        res.status(500).json({ message: "ERROR! Registering user...TRY AGAIN" , errorId: "signup_error_5" })
    }
}

async function handleUserLogin(req, res) {
    try {
        const { email, password } = await req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "No user found with this email" , errorId: "login_error_1"} );
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: "Account not verified. Please check your email." , errorId: "login_error_2" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password !", errorId: "login_error_3" });
        }

        // const token = await jwt.sign(
        //     { userId: user._id },
        //     process.env.JWT_SECRET, // Replace with your actual JWT secret
        //     { expiresIn: '1h' } // Token expires in 1 hour
        // );

        const payload = {
            email: email,
            userId: user._id,
            userName:user.username
        }
        const token = generateToken(payload)
        res.status(201).json({
            message: "Login successful",
            user,
            token

        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging in" });
    }
}

async function verifyEmail(req, res) {
    try {
        const { userId, verifyCode } = await req.query;
        console.log("userid", userId)
        console.log("code..", verifyCode)

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "Invalid link: User not found." });
        }
        console.log(user)

        const token = await User.findOne({
            _id: userId,
            verifyCode: verifyCode,
            verifyCodeExpiry: { $gt: Date.now() }
        });
        console.log(token)

        if (!token)
            return res.status(500).json({ message: "invalid link" })

        user.isVerified = true;
        user.verifyCode = 'verified hence null';
        await user.save();

        return res.status(201).json({ message: "email verified successfully" })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: "error while verifing user email..." })
    }
}

async function acceptMessage(req, res) {
    const { messageStatus, userId } = await req.body
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessage: messageStatus
            })
        if (!user) {
            return res.status(500).json({ message: "error while finding user" })
        }
        return res.status(201).json({ message: "message status updated successfully..." })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: "error while handling message accptance status..." })
    }

}

async function getAcceptMessage(req, res) {
    const { userId } = req.body;

    // Validate userId (you might need a more thorough check depending on your userId format)
    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: `User with ID ${userId} not found`,
                userId
            });
        }

        return res.status(200).json({
            message: "Message status retrieved successfully",
            messageAcceptStatus: user.isAcceptingMessage
        });
    } catch (error) {
        console.error('Error getting message acceptance status:', error);
        return res.status(500).json({ message: "Error while getting message acceptance status" });
    }
}


async function sendMessage(req, res) {
    const { username, content } = await req.body

    try {
        const user = await User.findOne({ username })

        if (!user) {
            return res.status(404).json({ message: "user not found..." })
        }

        if (!user.isAcceptingMessage) {
            return res.status(404).json({ message: 'User is not accepting messages', success: false })
        }
        const newMessage = { content, createdAt: new Date() }

        user.messages.push(newMessage)
        await user.save()
        return res.status(201).json({ message: 'Message sent successfully', success: true })

    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }

}

// async function getAllMessage(req, res) {
//     const { userid } = req.body;
//     const userId = new mongoose.Types.ObjectId(userid);
//     console.log("galm", userid)

//     try {
//         const user = await User.aggregate([
//             { $match: { _id: userId } },
//             { $unwind: '$messages' },
//             { $sort: { 'messages.createdAt': -1 } },
//             { $group: { _id: '$_id', messages: { $push: '$messages' } } },
//         ]).exec();

//         if (!user || user.length === 0 || !user[0].messages) {
//             return res.status(404).json({ message: 'User not found', success: false });
//         }

//         return res.status(200).json({ messages: user[0].messages });
//     } catch (error) {
//         console.error('An unexpected error occurred:', error);
//         return res.status(500).json({ message: 'Internal server error', success: false });
//     }
// }

async function getAllMessage(req, res) {
    const { userid } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userid)) {
        return res.status(400).json({ message: 'Invalid User ID format', success: false });
    }

    const userId = new mongoose.Types.ObjectId(userid);
    console.log("User ID (ObjectId):", userId);

    try {
       
        const user = await User.findById(userId).exec();

     
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

       
        if (!user.messages || user.messages.length === 0) {
            return res.status(402).json({ message: 'No messages found for this user', success: false });
        }

        
        const sortedMessages = user.messages.sort((a, b) => b.createdAt - a.createdAt);

        return res.status(200).json({ messages: sortedMessages });
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return res.status(500).json({ message: 'Internal server error', success: false });
    }
}


async function handleDeleteMessage(req, res) {
    const { userId, messageId } = req.params; // Extract parameters from the URL
    console.log(userId , messageId)
  
    if (!userId || !messageId) {
      return res.status(400).json({ error: 'User ID and Message ID are required' });
    }
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const messageIndex = user.messages.findIndex(message => message._id.toString() === messageId);
  
      if (messageIndex === -1) {
        return res.status(404).json({ error: 'Message not found' });
      }
  
      user.messages.splice(messageIndex, 1);

      await user.save();
  
      res.status(200).json({ success: 'Message deleted successfully' });
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  

async function suggestQuestions(req, res) {

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    console.log("called", OPENAI_API_KEY)

    const instance = axios.create({
        baseURL: 'https://api.openai.com/v1/engines/davinci-codex/completions', // Change endpoint if needed
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/completions',
            {
                model: 'text-davinci-003',
                prompt,
                max_tokens: 150,
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log("RR", response.data)
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }

    try {
        const response = await instance.post('', {
          prompt: prompt,
          max_tokens: 50, // Adjust as needed
        });
        return response.data.choices[0].text.trim();
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        return res.status(500).send(error.message);;
      }
}

module.exports = { handleUserSignup, getAcceptMessage, verifyEmail, handleUserLogin, acceptMessage, sendMessage, getAllMessage, suggestQuestions,handleDeleteMessage }