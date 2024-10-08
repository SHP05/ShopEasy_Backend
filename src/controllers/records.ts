import { NextFunction, Request, Response } from 'express';
import prisma from '../db';
import { ErrorHandler } from '../helpers/error';

export async function createRecord(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { units, totalPrice, date, price } = req.body;
  const { cId, sId } = req.params;
  const clientId = parseInt(cId);
  const serviceId = parseInt(sId);

  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return next(
        new ErrorHandler('Service Not Found or Invalid Service Id!', 404)
      );
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return next(new ErrorHandler('Client Not Found !', 404));
    }

    const parseDate = new Date(date);
    const newRecord = await prisma.dailyRecord.create({
      data: { clientId, serviceId, units, totalPrice, date: parseDate, price },
      select: {
        client: true,
        serviceId: true,
        units: true,
        totalPrice: true,
        date: true,
        price: true,
      },
    });
    res.status(200).json({ msg: 'Record Created !', data: newRecord });
  } catch (error) {
    console.log(error);

    return next(new ErrorHandler('Create Record: Internal Server Error!', 500));
  }
}

export async function updateRecord(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { units, totalPrice, date } = req.body;
  const { sId, cId, id } = req.params;
  const clientId = parseInt(cId);
  const serviceId = parseInt(sId);
  const recordId = parseInt(id);
  try {
    const record = await prisma.dailyRecord.findUnique({
      where: { id: recordId },
    });
    if (!record) {
      return next(new ErrorHandler('Record Not Found !', 404));
    }
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return next(
        new ErrorHandler('Service Not Found Or Invalid Service Id!', 404)
      );
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return next(new ErrorHandler('Client Not Found !', 404));
    }

    const updatedRecord = await prisma.dailyRecord.update({
      where: { id: recordId },
      data: {
        units: units,
        totalPrice: totalPrice,
        date: date,
      },
    });

    res
      .status(200)
      .json({ msg: 'Record Updated Successfully !', data: updatedRecord });
  } catch (error) {
    return next(
      new ErrorHandler('Update Record : Internal Server Error!', 500)
    );
  }
}

export async function deleteRecord(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { sId, cId, id } = req.params;
  const clientId = parseInt(cId);
  const serviceId = parseInt(sId);
  const recordId = parseInt(id);

  try {
    const record = await prisma.dailyRecord.findUnique({
      where: { id: recordId },
    });
    if (!record) {
      return next(new ErrorHandler('Record Not Found !', 404));
    }
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return next(
        new ErrorHandler('Service Not Found Or Invalid Service Id!', 404)
      );
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return next(new ErrorHandler('Client Not Found !', 404));
    }

    await prisma.dailyRecord.delete({
      where: { id: recordId },
    });

    res.status(200).json({ msg: 'Record Deleted !' });
  } catch (error) {
    return next(
      new ErrorHandler('Delete Record: Internal Server Error !', 500)
    );
  }
}

export async function searchRecords(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { startDate, endDate } = req.body;

  if (
    !startDate ||
    typeof startDate !== 'string' ||
    !endDate ||
    typeof endDate !== 'string'
  ) {
    return next(
      new ErrorHandler(
        'StartDate and EndDate Parameters is Required and Must be string ',
        400
      )
    );
  }

  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);
  if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
    return next(new ErrorHandler('Invalid Date Formate !', 400));
  }

  try {
    const records = await prisma.dailyRecord.findMany({
      where: {
        date: {
          gte: parsedStartDate,
          lte: parsedEndDate,
        },
      },
      include: {
        client: true,
        service: true,
      },
    });

    res.status(200).json({ msg: 'Serch Records..', data: records });
  } catch (error) {
    return next(
      new ErrorHandler('Search Record : Internal Serer Error !', 500)
    );
  }
}

export async function getRecords(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { clientId } = req.params;

  try {
    const client = await prisma.client.findUnique({
      where: {
        id: parseInt(clientId),
      },
    });

    if (!client) {
      return next(new ErrorHandler('Client Not Found!', 404));
    }

    const records = await prisma.dailyRecord.findMany({
      where: {
        clientId: parseInt(clientId),
      },
    });

    res.status(200).json({ msg: 'Client Records...', data: records });
  } catch (error) {
    return next(new ErrorHandler('Get Records: Internal Server Error!', 500));
  }
}
