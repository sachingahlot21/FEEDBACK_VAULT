const mongoose = require('mongoose')
const express = require('express')

const messageSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true
        },

        createdAt: {
            type: Date,
            required: true,
            default: Date.now()
        }
    }
)

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "username is required"],
            trim: true,
            unique: true
        },

        email: {
            type: String,
            required: [true, "email is required"],
            trim: true,
            unique: true,
            match: [/.+\@.+\..+/, "please, use a valid email address"
            ]
        },

        password: {
            type: String,
            required: [true, "password is required"]
        },

        verifyCode: {
            type: String,
            required: [true, "verify code is required"]
        },

        verifyCodeExpiry: {
            type: Date,
            required: [true, "verify code expiry is required"]
        },

        isVerified : {
            type: Boolean,
            default:false
        },

        isAcceptingMessage : {
            type: Boolean,
            default:true
        },

        messages : [messageSchema]
    }
)

const User = mongoose.model('User' , userSchema)
module.exports = {User}