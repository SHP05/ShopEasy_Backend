"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_1 = require("./user");
const service_1 = require("./service");
exports.router = (0, express_1.Router)();
exports.router.get("/", (req, res) => {
    res.json({ msg: "Welcome to Shop Easy !!" });
});
exports.router.use("/user", user_1.router);
exports.router.use("/service", service_1.router);
