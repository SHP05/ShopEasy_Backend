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
const db_1 = __importDefault(require("../db"));
const config_1 = require("../config/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { firstName, lastName, email, password, shopName } = req.body;
            const existUser = yield db_1.default.user.findUnique({ where: { email: email } });
            if (existUser) {
                return res.status(409).json({ msg: "USer Already exist!" });
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
            res.cookie("authorization", `Bearer ${token}`);
            return res
                .status(201)
                .json({ msg: "User Created Successfully !", data: newUser });
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: "Internal Server Error" });
        }
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const user = yield db_1.default.user.findUnique({
                where: { email: email, password: password },
            });
            if (!user) {
                return res.status(404).json({
                    msg: "Invalid Username or Password / User Not Exist !",
                });
            }
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
            }, config_1.JWT_SECRET);
            res.cookie("authorization", `Bearer ${token}`);
            return res.status(200).json({
                id: user.id,
                name: user.firstName + " " + user.lastName,
                email: user.email,
                msg: "User Logged in successfully !",
            });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ msg: "Internal Sever Error" });
        }
    });
}
