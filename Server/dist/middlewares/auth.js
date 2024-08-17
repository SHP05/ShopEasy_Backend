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
const index_1 = __importDefault(require("../db/index"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const error_1 = require("../helpers/error");
const authmiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authtoken = req.cookies.authorization;
    if (!authtoken || !authtoken.startsWith('Bearer ')) {
        return res.status(403).json('Invalid Token !');
        // throw new ErrorHandler('Invalid Token !', 403);
    }
    const token = authtoken.split(' ')[1];
    try {
        const decode = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        req.id = decode.id;
        const user = yield index_1.default.user.findUnique({
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
    }
    catch (err) {
        console.log(err);
        if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            next(new error_1.ErrorHandler('Token Expired', 403));
        }
        next(new error_1.ErrorHandler('Authentication Failed', 403));
    }
});
exports.default = authmiddleware;
