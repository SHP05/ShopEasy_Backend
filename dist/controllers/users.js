"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.logOut = logOut;
exports.updateUser = updateUser;
exports.forgotPassword = forgotPassword;
const db_1 = __importDefault(require("../db"));
const config_1 = require("../config/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const error_1 = require("../helpers/error");
const nodemailer_1 = __importDefault(require("nodemailer"));
function register(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { firstName, lastName, email, password, shopName } = req.body;
            const existUser = yield db_1.default.user.findUnique({ where: { email: email } });
            if (existUser) {
                return next(new error_1.ErrorHandler('User Already exist!', 409));
            }
            const hashPassword = yield bcrypt_1.default.hash(password, 10);
            const newUser = yield db_1.default.user.create({
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
            const token = jsonwebtoken_1.default.sign({
                id: newUser.id,
            }, config_1.JWT_SECRET);
            res.cookie('authorization', `Bearer ${token}`);
            return res
                .status(201)
                .json({ msg: 'User Created Successfully !', data: newUser });
        }
        catch (e) {
            console.log(e);
            return next(new error_1.ErrorHandler('Register: Internal Server Error!', 500));
        }
    });
}
function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const user = yield db_1.default.user.findUnique({
                where: { email: email },
            });
            if (!user) {
                return next(new error_1.ErrorHandler('Invalid Username or Password / User Not Exist !', 404));
            }
            const decodedPassword = yield bcrypt_1.default.compare(password, user.password);
            if (!decodedPassword) {
                return next(new error_1.ErrorHandler('Invalid Password !', 403));
            }
            else {
                const token = jsonwebtoken_1.default.sign({
                    id: user.id,
                }, config_1.JWT_SECRET, { expiresIn: '6h' });
                res.cookie('authorization', `Bearer ${token}`);
                return res.status(200).json({
                    id: user.id,
                    name: user.firstName + ' ' + user.lastName,
                    email: user.email,
                    msg: 'User Logged in successfully !',
                });
            }
        }
        catch (err) {
            console.log(err);
            return next(new error_1.ErrorHandler('Login : Internal Server Error!', 500));
        }
    });
}
function logOut(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res
            .status(200)
            .clearCookie('authorization')
            .json({ msg: 'User Logged Out successfully !' });
    });
}
function updateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { firstName, lastName, shopName } = req.body;
        const { id } = req.params;
        try {
            const user = yield db_1.default.user.findUnique({
                where: { id: parseInt(id) },
            });
            if (!user) {
                return next(new error_1.ErrorHandler('User Not Exist Or Invalid user ID !', 403));
            }
            const updateUser = yield db_1.default.user.update({
                where: { id: parseInt(id) },
                data: { firstName, lastName, shopName },
            });
            res.status(200).json({ msg: 'User Updated !', data: updateUser });
        }
        catch (error) {
            return next(new error_1.ErrorHandler('Update User :Internal Server Error', 500));
        }
    });
}
function forgotPassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // find user by email
            const user = yield db_1.default.user.findUnique({
                where: { email: req.body.email },
            });
            // if user not exist
            if (!user) {
                return next(new error_1.ErrorHandler('User Not Found Or Invalid User ID !', 403));
            }
            // generate unique jwt token
            const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.JWT_SECRET, {
                expiresIn: '2h',
            });
            //send the token to the user's mail
            const transporter = nodemailer_1.default.createTransport({
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
        }
        catch (err) {
            console.log(err);
            return next(new error_1.ErrorHandler('Forgot Password: Internal Server Error !', 500));
        }
    });
}
