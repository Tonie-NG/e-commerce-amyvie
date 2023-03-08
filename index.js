const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const forgotPasswordRoute = require("./routers/forgot_password_route");
const registerRoute = require("./routers/register_route");
const loginRoute = require("./routers/login_route");
const userRoute = require("./routers/user_route");
const reviewRoute = require("./routers/review_route");
const productRoute = require("./routers/product_route");
const fileupload = require("express-fileupload");

const app = express();
require("./database/db").connect();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use(fileupload({ useTempFiles: true }));

dotenv.config();

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Welcome to the server" });
});

app.use("/", registerRoute);
app.use("/", loginRoute);
app.use("/", forgotPasswordRoute);
app.use("/user", userRoute);
app.use("/review", reviewRoute);
app.use("/product", productRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is up and running`);
});
