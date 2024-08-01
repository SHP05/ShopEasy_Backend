import prisma from "../db";
import { Request, Response, Router } from "express";

export async function createService(req: Request, res: Response) {
  try {
    const { userId, serviceName, unit, pricePerUnit } = req.body;

    const service = await prisma.service.create({
      data: { userId, serviceName, unit, pricePerUnit },
      select: {
        id: true,
        userId: true,
        serviceName: true,
        unit: true,
        pricePerUnit: true,
      },
    });

    res
      .status(201)
      .json({ msg: "Service created Successfully", data: service });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function updateService(req: Request, res: Response) {
  const { userId , unit, pricePerUnit } = req.body;

  // const updateService = await prisma.service.update({
  //   data:{ userId , unit , pricePerUnit },
  //   select: {
  //     id: true,
  //     unit: true,
  //     pricePerUnit: true
  //   }
  // })
}
