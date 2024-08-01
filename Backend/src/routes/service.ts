import { Router } from "express";
import { createService } from "../controllers/service";

export const router = Router();

router.post("/service", createService);
