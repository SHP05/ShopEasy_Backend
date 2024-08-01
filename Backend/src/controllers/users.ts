import prisma from "../db";
import { Request, Response } from "express";
import { JWT_SECRET } from "../config/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function register(req: Request, res: Response) {
  try {
    const { firstName, lastName, email, password, shopName } = req.body;
    const existUser = await prisma.user.findUnique({ where: { email: email } });

    if (existUser) {
      return res.status(409).json({ msg: "USer Already exist!" });
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

    res.cookie("authorization", `Bearer ${token}`);

    return res
      .status(201)
      .json({ msg: "User Created Successfully !", data: newUser });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email, password: password },
    });

    if (!user) {
      return res.status(404).json({
        msg: "Invalid Username or Password / User Not Exist !",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      JWT_SECRET
    );

    res.cookie("authorization", `Bearer ${token}`);
    return res.status(200).json({
      id: user.id,
      name: user.firstName + " " + user.lastName,
      email: user.email,
      msg: "User Logged in successfully !",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Sever Error" });
  }
}
