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
exports.searchClient = searchClient;
exports.getClients = getClients;
const db_1 = __importDefault(require("../db"));
const error_1 = require("../helpers/error");
function createClient(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, userId, contactInfo } = req.body;
        try {
            const user = yield db_1.default.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                // res.status(404).json({ msg: 'User Not Found !' });
                return next(new error_1.ErrorHandler('User Not Found !', 404));
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
            return next(new error_1.ErrorHandler('Create Client : Internal Server Error !', 500));
        }
    });
}
function updateClient(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, contactInfo } = req.body;
        const { id } = req.params;
        try {
            const client = yield db_1.default.client.findUnique({
                where: { id: parseInt(id) },
            });
            if (!client) {
                return next(new error_1.ErrorHandler('Client Not Found !', 400));
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
            return next(new error_1.ErrorHandler('Client: Internal Server Error!', 500));
        }
    });
}
function delteClient(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const client = yield db_1.default.client.findUnique({
                where: { id: parseInt(id) },
            });
            if (!client) {
                return next(new error_1.ErrorHandler('Invalid Id or Client not Found !', 404));
            }
            yield db_1.default.client.delete({
                where: { id: parseInt(id) },
            });
            res.status(200).json({ msg: 'Client is Deleted !' });
        }
        catch (error) {
            return next(new error_1.ErrorHandler('Delete Client: Internal Server Error !', 500));
        }
    });
}
function searchClient(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { query } = req.query;
        if (!query || typeof query !== 'string') {
            return next(new error_1.ErrorHandler('Query parameter is required and must be a string !', 400));
        }
        try {
            const clients = yield db_1.default.client.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { contactInfo: { contains: query, mode: 'insensitive' } },
                    ],
                },
            });
            res.status(200).json({ msg: 'Searching Clients..', data: clients });
        }
        catch (error) {
            return next(new error_1.ErrorHandler('Internal Server Error !', 500));
        }
    });
}
function getClients(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        try {
            const user = yield db_1.default.user.findUnique({
                where: { id: parseInt(userId) },
            });
            if (!user) {
                return next(new error_1.ErrorHandler('User Not Exist Or Invalid User ID !', 404));
            }
            const clients = yield db_1.default.client.findMany({
                where: {
                    userId: parseInt(userId),
                },
            });
            res.status(200).json({ msg: 'Clients Data', data: clients });
        }
        catch (error) {
            return next(new error_1.ErrorHandler('Get Clients: Internal Server Error!', 500));
        }
    });
}
