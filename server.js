import express from 'express'
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import admin_route from "./routes/Admin/auth.route";
import front_route from "./routes/Front/auth.route";
// import user_dashboard from "./routes/User/userdash.route";
// import admin_settings from "./routes/Admin/settings.route";
// import admin_dashboard from "./routes/Admin/dashboard.route";
// import admin_restaurant from "./routes/Admin/restaurants.route";
// import admin_auth from "./routes/Admin/auth.route";
// import admin_users from "./routes/Admin/users.route";
// import admin_driver from "./routes/Admin/drivers.route";
// import restaurant_route from "./routes/Restaurant/auth.route";
import bcrypt from "bcrypt";
require("dotenv").config();


const app = express()
var corsOptions = {
   origin: "*",
   optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
// app.use(express.json())
// app.use(
//    bodyParser.json({
//       limit: "50mb"
//    })
// );
// app.use(
//    bodyParser.urlencoded({
//       extended: true,
//       limit: "50mb"
//    })
// );
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }))

mongoose.connect("mongodb://" + process.env.DATABASE_URL + "/" + process.env.DATABASE_NAME, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useFindAndModify: false
});
const connection = mongoose.connection;
connection.once("open", () => {
   // bcrypt.hash("admin5@gogo", 10, function (err,   hash) {
   //    console.log(hash)
   // })
   console.log("MongoDB database connection established successfully!");
});

const server = app.listen(process.env.PORT, process.env.BASE_URL);
// const io = socketIo().listen(server);
console.log('database', process.env.DATABASE_URL, 'app running on port ', process.env.PORT)


app.use("/api/admin/auth", admin_route);
app.use("/api/front/auth", front_route);
app.use("/uploads", express.static("uploads"));

app.get('/', (req, res) => {
   return res
      .status(200)
      .json({ message: '....' })
})
