require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors')
const app = express()

// app.use(cors());
app.use(cors({
    allowedHeaders: ['Content-Type', 'Authorization', 'Other-Headers-If-Needed'],
}));
const userRoute = require('./routes/index')

const PORT = 3000

app.use(express.json());

const uri = process.env.MONGO_URI;

if (!uri) {
    throw new Error('MONGO_URI is not defined');
}
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get("/",(request,response)=>{
    ///server to client
    response.json({
        message : "Server is running " 
    })
})
app.use('/api/',userRoute)

// app.use('/', userRoute)



app.listen(PORT, () => console.log("APP STARTED AT PORT : ", PORT))