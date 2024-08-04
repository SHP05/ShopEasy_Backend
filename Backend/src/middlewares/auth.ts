import express, { Request, Response, NextFunction } from 'express';
import prisma from '../db/index';
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config';
import { ErrorHandler } from '../helpers/error';

declare module 'express-serve-static-core' {
  interface Request {
    id?: number | JwtPayload;
    user?: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      avatar: string;
    };
  }
}

const authmiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authtoken = req.cookies.authorization;

  if (!authtoken || !authtoken.startsWith('Bearer ')) {
    return res.status(403).json('Invalid Token !');
    // throw new ErrorHandler('Invalid Token !', 403);
  }

  const token = authtoken.split(' ')[1];

  try {
    const decode = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.id = decode.id;

    const user = await prisma.user.findUnique({
      where: { id: decode.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
      },
    });

    if (!user) {
      return res.status(403).json('Invalid Token !');
      // throw new ErrorHandler('User Not Found !', 404);
    }

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
    };
    next();
  } catch (err) {
    console.log(err);

    if (err instanceof jwt.TokenExpiredError) {
      next(new ErrorHandler('Token Expired', 403));
    }
    next(new ErrorHandler('Authentication Failed', 403));
  }
};

export default authmiddleware;
