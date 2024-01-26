import express, { Request, Response } from "express";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    res.status(200).json({ reslut: "success" });
  } catch (e) {
    console.log(e);
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { id, pw } = req.body;
    console.log(id, pw);
    res.status(200).json({ reslut: "success" });
  } catch (e) {
    console.log(e);
  }
});

export default router;
