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
exports.createService = createService;
exports.updateService = updateService;
exports.deleteService = deleteService;
const db_1 = __importDefault(require("../db"));
const error_1 = require("../helpers/error");
function createService(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId, serviceName, unit, pricePerUnit } = req.body;
            const service = yield db_1.default.service.create({
                data: { userId, serviceName, unit, pricePerUnit },
                select: {
                    id: true,
                    userId: true,
                    serviceName: true,
                    unit: true,
                    pricePerUnit: true,
                },
            });
            res
                .status(201)
                .json({ msg: "Service created Successfully", data: service });
        }
        catch (err) {
            console.log(err);
            throw new error_1.ErrorHandler("Error occurred while creating Service", 500);
            // res.status(500).json({ msg: "Internal Server Error" });
        }
    });
}
function updateService(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const serviceId = parseInt(id);
            if (!serviceId) {
                return res.status(400).json({ msg: "Invalid Service ID" });
            }
            const service = yield db_1.default.service.findUnique({
                where: { id: serviceId },
            });
            if (!service) {
                return res.status(400).json({ msg: "Service Not Found" });
            }
            const { serviceName, unit, pricePerUnit } = req.body;
            const updateService = yield db_1.default.service.update({
                where: {
                    id: serviceId,
                },
                data: { serviceName, unit, pricePerUnit },
            });
            res
                .status(200)
                .json({ msg: "Service Updated Successfully", data: updateService });
        }
        catch (err) {
            throw new error_1.ErrorHandler("Error occurred while Updating Service", 500);
            // res.status(500).json({ msg: "Internal server Error", err: err });
            console.log(err);
        }
    });
}
function deleteService(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            if (!id) {
                return res.status(400).json({ msg: "Invalid Service ID" });
            }
            const service = yield db_1.default.service.findUnique({
                where: { id: parseInt(id) },
            });
            if (!service) {
                return res.status(400).json({ msg: "Service Not Found !" });
            }
            yield db_1.default.service.delete({ where: { id: parseInt(id) } }).then(() => {
                res.status(400).json({ msg: "Service Deleted Successfully!" });
            });
        }
        catch (error) {
            console.log("Error Deleting Service :", error);
            throw new error_1.ErrorHandler("Error occurred while Deleting Service", 500);
            // res.status(500).json({ msg: "Internal Server Error" });
        }
    });
}
