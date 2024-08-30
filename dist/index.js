"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("./routes/index");
const error_1 = require("./helpers/error");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
console.log(PORT);
const corsOption = {
    credentials: true,
    origin: ['http://localhost:5173'],
};
app.use((0, cors_1.default)(corsOption));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use('/', index_1.router);
app.use(error_1.handleError);
app.listen(PORT, () => {
    console.log(`server is runnig on http://localhost:${PORT}`);
});
