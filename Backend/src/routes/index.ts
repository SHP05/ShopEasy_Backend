import { Request, Response, Router } from "express";
import { router as userRouter } from "./user";
import { router as serviceRouter } from "./service";
export const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ msg: "Welcome to Shop Easy !!" });
});

router.use("/user", userRouter);
router.use("/service", serviceRouter);
