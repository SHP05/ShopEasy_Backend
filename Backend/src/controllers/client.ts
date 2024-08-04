import expres, { NextFunction, Request, Response } from 'express';
import prisma from '../db';
import { ErrorHandler } from '../helpers/error';

export async function createClient(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, userId, contactInfo } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      // res.status(404).json({ msg: 'User Not Found !' });
      return next(new ErrorHandler('User Not Found !', 404));
    }

    const newClient = await prisma.client.create({
      data: { userId, name, contactInfo },
      select: {
        id: true,
        name: true,
        contactInfo: true,
        user: true,
        createdAt: true,
      },
    });

    res
      .status(200)
      .json({ msg: 'New Client Created Successfully !', data: newClient });
  } catch (error) {
    return next(
      new ErrorHandler('Create Client : Internal Server Error !', 500)
    );
  }
}

export async function updateClient(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, contactInfo } = req.body;
  const { id } = req.params;
  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) },
    });

    if (!client) {
      return next(new ErrorHandler('Client Not Found !', 400));
    }

    const UpdatedClient = await prisma.client.update({
      where: { id: parseInt(id) },
      data: {
        name,
        contactInfo,
      },
      select: {
        id: true,
        name: true,
        contactInfo: true,
      },
    });

    res
      .status(200)
      .json({ msg: 'Client Updated Successfully', data: UpdatedClient });
  } catch (error) {
    return next(new ErrorHandler('Client: Internal Server Error!', 500));
  }
}

export async function delteClient(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) },
    });

    if (!client) {
      return next(new ErrorHandler('Invalid Id or Client not Found !', 404));
    }

    await prisma.client.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ msg: 'Client is Deleted !' });
  } catch (error) {
    return next(
      new ErrorHandler('Delete Client: Internal Server Error !', 500)
    );
  }
}
