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
exports.createClient = createClient;
exports.updateClient = updateClient;
exports.delteClient = delteClient;
const db_1 = __importDefault(require("../db"));
function createClient(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, userId, contactInfo } = req.body;
        try {
            const user = yield db_1.default.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                res.status(404).json({ msg: 'User Not Found !' });
                //   return new ErrorHandler('User Not Found !', 404);
            }
            const newClient = yield db_1.default.client.create({
                data: { userId, name, contactInfo },
                select: {
                    id: true,
                    name: true,
                    contactInfo: true,
                    user: true,
                    createdAt: true,
                },
            });
            res
                .status(200)
                .json({ msg: 'New Client Created Successfully !', data: newClient });
        }
        catch (error) {
            console.log('Client error: ', error);
            res.status(404).json({ msg: 'Client is Not Created !' });
            // throw new ErrorHandler('Client is Not created !', 500);
        }
    });
}
function updateClient(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, contactInfo } = req.body;
        const { id } = req.params;
        try {
            const client = yield db_1.default.client.findUnique({
                where: { id: parseInt(id) },
            });
            if (!client) {
                res.status(400).json({ msg: 'Client not Found !' });
                //   return new ErrorHandler('Client Not Found !', 400);
            }
            const UpdatedClient = yield db_1.default.client.update({
                where: { id: parseInt(id) },
                data: {
                    name,
                    contactInfo,
                },
                select: {
                    id: true,
                    name: true,
                    contactInfo: true,
                },
            });
            res
                .status(200)
                .json({ msg: 'Client Updated Successfully', data: UpdatedClient });
        }
        catch (error) {
            res.status(500).json({ msg: 'Client Not Updated !' });
            // throw new ErrorHandler('Client Not Updated !', 500);
        }
    });
}
function delteClient(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const client = yield db_1.default.client.findUnique({
                where: { id: parseInt(id) },
            });
            if (!client) {
                res.status(404).json({ msg: 'Invalid Id or Client not Found!' });
            }
            yield db_1.default.client.delete({
                where: { id: parseInt(id) },
            });
            res.status(200).json({ msg: 'Client is Deleted !' });
        }
        catch (error) { }
    });
}
