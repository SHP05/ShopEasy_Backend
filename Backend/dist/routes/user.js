"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const users_1 = require("../controllers/users");
const auth_1 = __importDefault(require("../middlewares/auth"));
exports.router = (0, express_1.Router)();
exports.router.post('/register', users_1.register);
exports.router.post('/login', users_1.login);
exports.router.post('/logout', auth_1.default, users_1.logOut);
exports.router.put('/update/:id', auth_1.default, users_1.updateUser);
exports.router.post('/forgotPass', auth_1.default, users_1.forgotPassword);
