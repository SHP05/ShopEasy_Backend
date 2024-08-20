"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_1 = require("./user");
const service_1 = require("./service");
const client_1 = require("./client");
const records_1 = require("./records");
const auth_1 = __importDefault(require("../middlewares/auth"));
exports.router = (0, express_1.Router)();
exports.router.get('/', (req, res) => {
    res.json({ msg: 'Welcome to Shop Easy !!' });
});
exports.router.use('/user', user_1.router);
exports.router.use('/service', auth_1.default, service_1.router);
exports.router.use('/client', auth_1.default, client_1.router);
exports.router.use('/record', auth_1.default, records_1.router);
