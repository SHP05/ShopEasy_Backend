import { Router } from "express";
import { createService , updateService } from "../controllers/service";

export const router = Router();

router.post("/", createService);
router.put("/:id", updateService);
