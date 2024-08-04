"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const records_1 = require("../controllers/records");
exports.router = (0, express_1.Router)();
exports.router.post('/:cId/:sId', records_1.createRecord);
exports.router.put('/:cId/:sId/:id', records_1.updateRecord);
exports.router.delete('/:cId/:sId/:id', records_1.deleteRecord);
