import express from "express";
import loginRouter from "./login"; // Adjust the path as necessary
import signUpRouter from "./signUp"; // Adjust the path as necessary
import logoutRouter from "./logout";

const authRouter = express.Router();

authRouter.use("/login", loginRouter);
authRouter.use("/logout", logoutRouter);
authRouter.use("/sign_up", signUpRouter);

export default authRouter;