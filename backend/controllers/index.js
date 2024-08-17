const { User } = require("../model/index")
const bcrypt = require('bcryptjs');
const { sendVerificationEmail } = require("../helpers/sendVerificationEmail")
const sendEmail = require('../utils/sendEmail')
const { jwtAuthMiddleware, generateToken } = require('../jwt')

async function handleUserSignup(req, res) {
    try {
        const body = req.body
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
        const { email, password } = req.body;

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

        const token = jwt.sign(
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
        const { userId, verifyCode } = req.query;
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

async function acceptMessage(req,res){

}

async function sendMessage(req, res){

}

async function getAllMessage(req,res){

}
module.exports = { handleUserSignup, verifyEmail,handleUserLogin, acceptMessage,sendMessage, getAllMessage }