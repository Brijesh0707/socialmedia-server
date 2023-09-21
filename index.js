const express = require("express");  
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
// const path = require("path");


require('./models/Model');
require('./models/Post');

app.use(express.json());
app.use(cors());


app.use(require("./routes/Auth"));
app.use(require("./routes/CreatePost"));
app.use(require('./routes/User'));


dotenv.config();


mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("connected", () => {
  console.log("DATABASE CONNECTED OK");
});



mongoose.connection.on("error", (err) => {
  console.error("DATABASE CONNECTION ERROR:", err);
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
