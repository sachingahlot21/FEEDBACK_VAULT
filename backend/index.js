require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors')

const userRoute = require('./routes/index')
const app = express()

const PORT = 3000
app.use(cors())
app.use(cors({
    origin: "",
    methods: ["POST", "GET"],
    credentials: true
}))
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

app.use('/', userRoute)


app.listen(PORT, () => console.log("APP STARTED AT PORT : ", PORT))