import prisma from '../db';
import { NextFunction, Request, Response } from 'express';
import { JWT_SECRET } from '../config/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ErrorHandler } from '../helpers/error';
import nodemailer from 'nodemailer';

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

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { firstName, lastName, shopName } = req.body;
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return next(new ErrorHandler('User Not Exist Or Invalid user ID !', 403));
    }

    const updateUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { firstName, lastName, shopName },
    });

    res.status(200).json({ msg: 'User Updated !', data: updateUser });
  } catch (error) {
    return next(new ErrorHandler('Update User :Internal Server Error', 500));
  }
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // find user by email
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    // if user not exist
    if (!user) {
      return next(new ErrorHandler('User Not Found Or Invalid User ID !', 403));
    }

    // generate unique jwt token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: '2h',
    });

    //send the token to the user's mail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD_APP_EMAIL,
      },
    });
    const sortToken = token.split('.')[1];
    // Email configuration
    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: 'Reset Password',
      html: `<h1>Reset Your Password</h1>
        <p>Click on the following link to reset your password:</p>
        <a href="http://localhost:5173/reset/${sortToken}">http://localhost:5173/reset/${sortToken}</a>
        <h3>Token : ${token}</h3>
        <p>The link will expire in 10 minutes.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.status(200).json({ message: 'Email sent' });
    });
  } catch (err) {
    console.log(err);
    return next(
      new ErrorHandler('Forgot Password: Internal Server Error !', 500)
    );
  }
}
