const { User } = require("../model/index")
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')

require('dotenv').config();
const sendEmail = require('../utils/sendEmail')
const axios = require('axios');

const { jwtAuthMiddleware, generateToken } = require('../jwt')



async function handleUserSignup(req, res) {
    try {
        const body = await req.body
        const { username, email, password } = body

        const existingVerifiedUserByUsername = await User.findOne(
            { username, isVerified: true })

        if (existingVerifiedUserByUsername) {
            return res.status(400).json({ message: "Username already taken" })
        }

        const existingUserByMail = await User.findOne({ email })
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        let savedUser;

        if (existingUserByMail) {

            if (existingUserByMail.isVerified) {
                return res.status(400).json({ message: "User already exist with this email" })
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
                return res.status(500).json({ message: "error occured while sending verification code" })
            }
            console.log("successfully created new user..wait for verification code...", newUser)

        }

        //send verification code
        // const emailResponse = await sendEmail({email, userId : newUser._id, verifyCode})
        // if (!emailResponse.success) {
        //     return res.status(500).json({ message: "error occured while sending verification code" })
        // }

        if (!savedUser || !savedUser._id) {
            return res.status(500).json({ message: "User creation or update failed" });
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
        return res.status(500).json({ message: "ERROR! Registering user..." })
    }
}

async function handleUserLogin(req, res) {
    try {
        const { email, password } = await req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: "Account not verified. Please check your email." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = await jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET, // Replace with your actual JWT secret
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.status(200).json({
            message: "Login successful",
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

async function getAllMessage(req, res) {
    const { userid } = req.body;
    const userId = new mongoose.Types.ObjectId(userid);
  
    try {
      const user = await User.aggregate([
        { $match: { _id: userId } },
        { $unwind: '$messages' },
        { $sort: { 'messages.createdAt': -1 } },
        { $group: { _id: '$_id', messages: { $push: '$messages' } } },
      ]).exec();
  
      if (!user || user.length === 0) {
        return res.status(404).json({ message: 'User not found', success: false });
      }
  
      return res.status(200).json({ messages: user[0].messages });
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      return res.status(500).json({ message: 'Internal server error', success: false });
    }
}

async function suggestQuestions(req, res) {

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    console.log("called" , OPENAI_API_KEY)

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
}

module.exports = { handleUserSignup, verifyEmail, handleUserLogin, acceptMessage, sendMessage, getAllMessage, suggestQuestions }