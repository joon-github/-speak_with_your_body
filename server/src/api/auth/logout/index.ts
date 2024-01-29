import express, { Request, Response } from "express";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  // Assuming you're storing the token in a cookie
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    // Or if tokens are stored in client storage like localStorage, just send a response
    // The client should handle deleting the token from storage
    res.status(200).json({
      result: "success",
      message: "Logout successful.",
    });
  } catch (e) {
    console.log(e);
  }
});

export default router;
