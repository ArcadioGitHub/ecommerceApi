const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("DataBase connection successfull")).catch((err) => {console.log(err)})

app.use(express.json());
app.use("/api/v1/", userRoute);
app.use("/api/v1/", authRoute);

app.listen(process.env.PORT || 9000, ()=>{
    console.log("BackEnd Server is Running on Port");
})