import prisma from '../db';
import { NextFunction, Request, Response, Router } from 'express';
import { ErrorHandler } from '../helpers/error';

export async function createService(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
      .json({ msg: 'Service created Successfully', data: service });
  } catch (err) {
    return next(new ErrorHandler('Service : Internal Server Error !', 500));
  }
}

export async function updateService(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const serviceId = parseInt(id);

    if (!serviceId) {
      return next(new ErrorHandler('Invalid Service ID !', 400));
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return next(new ErrorHandler('Service Not Found !', 400));
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
      .json({ msg: 'Service Updated Successfully', data: updateService });
  } catch (err) {
    return next(
      new ErrorHandler('Update Service : Internal Server Error !', 500)
    );
  }
}

export async function deleteService(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  try {
    if (!id) {
      return next(new ErrorHandler('Invalid Service ID!', 400));
    }

    const service = await prisma.service.findUnique({
      where: { id: parseInt(id) },
    });

    if (!service) {
      return next(new ErrorHandler('Service Not Found !', 400));
    }

    await prisma.service.delete({ where: { id: parseInt(id) } }).then(() => {
      res.status(400).json({ msg: 'Service Deleted Successfully!' });
    });
  } catch (error) {
    return next(
      new ErrorHandler('Delete Service : Internal Server Error', 500)
    );
  }
}
