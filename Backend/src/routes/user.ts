import { Request, Response, Router } from "express";
import { register, login } from "../controllers/users";

export const router = Router();

router.post("/register", register);
router.post("/login", login);
