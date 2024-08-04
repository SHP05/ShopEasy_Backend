import prisma from "../db";
import { Request, Response, Router } from "express";
import { ErrorHandler } from "../helpers/error";

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
    throw new ErrorHandler("Error occurred while creating Service", 500);
    // res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function updateService(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const serviceId = parseInt(id);

    if (!serviceId) {
      return res.status(400).json({ msg: "Invalid Service ID" });
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return res.status(400).json({ msg: "Service Not Found" });
    }

    const { serviceName, unit, pricePerUnit } = req.body;

    const updateService = await prisma.service.update({
      where: {
        id: serviceId,
      },
      data: { serviceName, unit, pricePerUnit },
    });
    res
      .status(200)
      .json({ msg: "Service Updated Successfully", data: updateService });
  } catch (err) {
    throw new ErrorHandler("Error occurred while Updating Service", 500);
    // res.status(500).json({ msg: "Internal server Error", err: err });
    console.log(err);
  }
}

export async function deleteService(req: Request, res: Response) {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ msg: "Invalid Service ID" });
    }

    const service = await prisma.service.findUnique({
      where: { id: parseInt(id) },
    });

    if (!service) {
      return res.status(400).json({ msg: "Service Not Found !" });
    }

    await prisma.service.delete({ where: { id: parseInt(id) } }).then(() => {
      res.status(400).json({ msg: "Service Deleted Successfully!" });
    });
  } catch (error) {
    console.log("Error Deleting Service :", error);
    throw new ErrorHandler("Error occurred while Deleting Service", 500);
    // res.status(500).json({ msg: "Internal Server Error" });
  }
}
