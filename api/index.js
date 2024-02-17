import express from "express";
import mongoose from "mongoose";
import userRouter from './routes/user.route.js';

mongoose.connect("mongodb+srv://naveenantonyp:mech1032@cluster0.palocap.mongodb.net/property-website?retryWrites=true&w=majority").then(() => {
    console.log('Connected to MongoDB!');
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();

app.listen(3000, () => {
    console.log('Server is running on port 3000!');
});


app.use('/api/user', userRouter);