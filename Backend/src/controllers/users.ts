import prisma from '../db';
import { NextFunction, Request, Response } from 'express';
import { JWT_SECRET } from '../config/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ErrorHandler } from '../helpers/error';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { firstName, lastName, email, password, shopName } = req.body;
    const existUser = await prisma.user.findUnique({ where: { email: email } });

    if (existUser) {
      return next(new ErrorHandler('User Already exist!', 409));
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { firstName, lastName, email, password: hashPassword, shopName },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        avatar: true,
        shopName: true,
      },
    });

    const token = jwt.sign(
      {
        id: newUser.id,
      },
      JWT_SECRET
    );

    res.cookie('authorization', `Bearer ${token}`);

    return res
      .status(201)
      .json({ msg: 'User Created Successfully !', data: newUser });
  } catch (e) {
    console.log(e);
    return next(new ErrorHandler('Register: Internal Server Error!', 500));
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return next(
        new ErrorHandler('Invalid Username or Password / User Not Exist !', 404)
      );
    }

    const decodedPassword: boolean = await bcrypt.compare(
      password,
      user.password
    );

    if (!decodedPassword) {
      return next(new ErrorHandler('Invalid Password !', 403));
    } else {
      const token = jwt.sign(
        {
          id: user.id,
        },
        JWT_SECRET,
        { expiresIn: '6h' }
      );

      res.cookie('authorization', `Bearer ${token}`);
      return res.status(200).json({
        id: user.id,
        name: user.firstName + ' ' + user.lastName,
        email: user.email,
        msg: 'User Logged in successfully !',
      });
    }
  } catch (err) {
    console.log(err);
    return next(new ErrorHandler('Login : Internal Server Error!', 500));
  }
}

export async function logOut(req: Request, res: Response) {
  res
    .status(200)
    .clearCookie('authorization')
    .json({ msg: 'User Logged Out successfully !' });
}
