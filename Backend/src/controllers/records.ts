import { NextFunction, Request, Response } from 'express';
import prisma from '../db';
import { ErrorHandler } from '../helpers/error';

export async function createRecord(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { units, totalPrice, date } = req.body;
  const { cId, sId } = req.params;
  const clientId = parseInt(cId);
  const serviceId = parseInt(sId);

  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      //   next(new ErrorHandler('Service Not Found', 404));
      return res
        .status(404)
        .json({ msg: 'Service Not Found Or Invalid Service Id!' });
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return res.status(404).json({ msg: 'Client Not Found !' });
    }

    const newRecord = await prisma.dailyRecord.create({
      data: { clientId, serviceId, units, totalPrice, date },
      select: {
        client: true,
        serviceId: true,
        units: true,
        totalPrice: true,
        date: true,
      },
    });
    res.status(200).json({ msg: 'Record Created !', data: newRecord });
  } catch (error) {
    console.log(error);

    res.status(500).json({ msg: 'Internal Server Error' });
  }
}

export async function updateRecord(req: Request, res: Response) {
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
      return res.status(404).json({ msg: 'Record Not Found !' });
    }
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      //   next(new ErrorHandler('Service Not Found', 404));
      return res
        .status(404)
        .json({ msg: 'Service Not Found Or Invalid Service Id!' });
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return res.status(404).json({ msg: 'Client Not Found !' });
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
    res.status(500).json({ msg: 'Record : Internal Server Error' });
  }
}

export async function deleteRecord(req: Request, res: Response) {
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
      return res.status(404).json({ msg: 'Record Not Found !' });
    }
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return res
        .status(404)
        .json({ msg: 'Service Not Found Or Invalid Service Id!' });
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return res.status(404).json({ msg: 'Client Not Found !' });
    }

    await prisma.dailyRecord.delete({
      where: { id: recordId },
    });

    res.status(200).json({ msg: 'Record Deleted !' });
  } catch (error) {
    res.status(500).json({ msg: 'Delete Record: Internal Server Error !' });
  }
}
