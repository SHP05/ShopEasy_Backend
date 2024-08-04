import expres, { Request, Response } from 'express';
import prisma from '../db';
import { ErrorHandler } from '../helpers/error';

export async function createClient(req: Request, res: Response) {
  const { name, userId, contactInfo } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ msg: 'User Not Found !' });
      //   return new ErrorHandler('User Not Found !', 404);
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
    console.log('Client error: ', error);
    res.status(404).json({ msg: 'Client is Not Created !' });
    // throw new ErrorHandler('Client is Not created !', 500);
  }
}

export async function updateClient(req: Request, res: Response) {
  const { name, contactInfo } = req.body;
  const { id } = req.params;
  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) },
    });

    if (!client) {
      res.status(400).json({ msg: 'Client not Found !' });
      //   return new ErrorHandler('Client Not Found !', 400);
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
    res.status(500).json({ msg: 'Client Not Updated !' });
    // throw new ErrorHandler('Client Not Updated !', 500);
  }
}

export async function delteClient(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) },
    });

    if (!client) {
      res.status(404).json({ msg: 'Invalid Id or Client not Found!' });
    }

    await prisma.client.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ msg: 'Client is Deleted !' });
  } catch (error) {}
}
