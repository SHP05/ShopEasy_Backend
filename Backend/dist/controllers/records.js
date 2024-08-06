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
exports.createRecord = createRecord;
exports.updateRecord = updateRecord;
exports.deleteRecord = deleteRecord;
exports.searchRecords = searchRecords;
const db_1 = __importDefault(require("../db"));
const error_1 = require("../helpers/error");
function createRecord(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { units, totalPrice, date } = req.body;
        const { cId, sId } = req.params;
        const clientId = parseInt(cId);
        const serviceId = parseInt(sId);
        try {
            const service = yield db_1.default.service.findUnique({
                where: { id: serviceId },
            });
            if (!service) {
                return next(new error_1.ErrorHandler('Service Not Found or Invalid Service Id!', 404));
            }
            const client = yield db_1.default.client.findUnique({
                where: { id: clientId },
            });
            if (!client) {
                return next(new error_1.ErrorHandler('Client Not Found !', 404));
            }
            const newRecord = yield db_1.default.dailyRecord.create({
                data: { clientId, serviceId, units, totalPrice, date },
                select: {
                    client: true,
                    serviceId: true,
                    units: true,
                    totalPrice: true,
                    date: true,
                },
            });
            res.status(200).json({ msg: 'Record Created !', data: newRecord });
        }
        catch (error) {
            return next(new error_1.ErrorHandler('Create Record: Internal Server Error!', 500));
        }
    });
}
function updateRecord(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { units, totalPrice, date } = req.body;
        const { sId, cId, id } = req.params;
        const clientId = parseInt(cId);
        const serviceId = parseInt(sId);
        const recordId = parseInt(id);
        try {
            const record = yield db_1.default.dailyRecord.findUnique({
                where: { id: recordId },
            });
            if (!record) {
                return next(new error_1.ErrorHandler('Record Not Found !', 404));
            }
            const service = yield db_1.default.service.findUnique({
                where: { id: serviceId },
            });
            if (!service) {
                return next(new error_1.ErrorHandler('Service Not Found Or Invalid Service Id!', 404));
            }
            const client = yield db_1.default.client.findUnique({
                where: { id: clientId },
            });
            if (!client) {
                return next(new error_1.ErrorHandler('Client Not Found !', 404));
            }
            const updatedRecord = yield db_1.default.dailyRecord.update({
                where: { id: recordId },
                data: {
                    units: units,
                    totalPrice: totalPrice,
                    date: date,
                },
            });
            res
                .status(200)
                .json({ msg: 'Record Updated Successfully !', data: updatedRecord });
        }
        catch (error) {
            return next(new error_1.ErrorHandler('Update Record : Internal Server Error!', 500));
        }
    });
}
function deleteRecord(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { sId, cId, id } = req.params;
        const clientId = parseInt(cId);
        const serviceId = parseInt(sId);
        const recordId = parseInt(id);
        try {
            const record = yield db_1.default.dailyRecord.findUnique({
                where: { id: recordId },
            });
            if (!record) {
                return next(new error_1.ErrorHandler('Record Not Found !', 404));
            }
            const service = yield db_1.default.service.findUnique({
                where: { id: serviceId },
            });
            if (!service) {
                return next(new error_1.ErrorHandler('Service Not Found Or Invalid Service Id!', 404));
            }
            const client = yield db_1.default.client.findUnique({
                where: { id: clientId },
            });
            if (!client) {
                return next(new error_1.ErrorHandler('Client Not Found !', 404));
            }
            yield db_1.default.dailyRecord.delete({
                where: { id: recordId },
            });
            res.status(200).json({ msg: 'Record Deleted !' });
        }
        catch (error) {
            return next(new error_1.ErrorHandler('Delete Record: Internal Server Error !', 500));
        }
    });
}
function searchRecords(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { date } = req.query;
        if (!date || typeof date !== 'string') {
            return next(new error_1.ErrorHandler('Query Parameter is Required and Must be string ', 400));
        }
        const parseDate = new Date(date);
        console.log(parseDate);
        if (isNaN(parseDate.getTime())) {
            return next(new error_1.ErrorHandler('Invalid Date Formate !', 400));
        }
        try {
            const records = yield db_1.default.dailyRecord.findMany({
                where: {
                    date: parseDate,
                },
                include: {
                    client: true,
                    service: true,
                },
            });
            res.status(200).json({ msg: 'Serch Records..', data: records });
        }
        catch (error) {
            return next(new error_1.ErrorHandler('Search Record : Internal Serer Error !', 500));
        }
    });
}
