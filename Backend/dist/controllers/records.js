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
const db_1 = __importDefault(require("../db"));
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
                //   next(new ErrorHandler('Service Not Found', 404));
                return res
                    .status(404)
                    .json({ msg: 'Service Not Found Or Invalid Service Id!' });
            }
            const client = yield db_1.default.client.findUnique({
                where: { id: clientId },
            });
            if (!client) {
                return res.status(404).json({ msg: 'Client Not Found !' });
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
            console.log(error);
            res.status(500).json({ msg: 'Internal Server Error' });
        }
    });
}
function updateRecord(req, res) {
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
                return res.status(404).json({ msg: 'Record Not Found !' });
            }
            const service = yield db_1.default.service.findUnique({
                where: { id: serviceId },
            });
            if (!service) {
                //   next(new ErrorHandler('Service Not Found', 404));
                return res
                    .status(404)
                    .json({ msg: 'Service Not Found Or Invalid Service Id!' });
            }
            const client = yield db_1.default.client.findUnique({
                where: { id: clientId },
            });
            if (!client) {
                return res.status(404).json({ msg: 'Client Not Found !' });
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
            res.status(500).json({ msg: 'Record : Internal Server Error' });
        }
    });
}
function deleteRecord(req, res) {
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
                return res.status(404).json({ msg: 'Record Not Found !' });
            }
            const service = yield db_1.default.service.findUnique({
                where: { id: serviceId },
            });
            if (!service) {
                return res
                    .status(404)
                    .json({ msg: 'Service Not Found Or Invalid Service Id!' });
            }
            const client = yield db_1.default.client.findUnique({
                where: { id: clientId },
            });
            if (!client) {
                return res.status(404).json({ msg: 'Client Not Found !' });
            }
            yield db_1.default.dailyRecord.delete({
                where: { id: recordId },
            });
            res.status(200).json({ msg: 'Record Deleted !' });
        }
        catch (error) {
            res.status(500).json({ msg: 'Delete Record: Internal Server Error !' });
        }
    });
}
