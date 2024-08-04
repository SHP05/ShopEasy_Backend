"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const client_1 = require("../controllers/client");
exports.router = (0, express_1.Router)();
exports.router.post('/', client_1.createClient);
exports.router.put('/:id', client_1.updateClient);
exports.router.delete('/:id', client_1.delteClient);
