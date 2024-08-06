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
function createService(req, res, next) {
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
                .json({ msg: 'Service created Successfully', data: service });
        }
        catch (err) {
            return next(new error_1.ErrorHandler('Service : Internal Server Error !', 500));
        }
    });
}
function updateService(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const serviceId = parseInt(id);
            if (!serviceId) {
                return next(new error_1.ErrorHandler('Invalid Service ID !', 400));
            }
            const service = yield db_1.default.service.findUnique({
                where: { id: serviceId },
            });
            if (!service) {
                return next(new error_1.ErrorHandler('Service Not Found !', 400));
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
                .json({ msg: 'Service Updated Successfully', data: updateService });
        }
        catch (err) {
            return next(new error_1.ErrorHandler('Update Service : Internal Server Error !', 500));
        }
    });
}
function deleteService(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            if (!id) {
                return next(new error_1.ErrorHandler('Invalid Service ID!', 400));
            }
            const service = yield db_1.default.service.findUnique({
                where: { id: parseInt(id) },
            });
            if (!service) {
                return next(new error_1.ErrorHandler('Service Not Found !', 400));
            }
            yield db_1.default.service.delete({ where: { id: parseInt(id) } }).then(() => {
                res.status(400).json({ msg: 'Service Deleted Successfully!' });
            });
        }
        catch (error) {
            return next(new error_1.ErrorHandler('Delete Service : Internal Server Error', 500));
        }
    });
}
