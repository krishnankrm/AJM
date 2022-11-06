"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apiErrorHandler = require('./../error/api-error-handler');
const app = (0, express_1.default)();
const port = 1019;
var cors = require('cors');
const bodyParser = require('body-parser');
app.use(express_1.default.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const jwt = require('../_helpers/jwt');
const errorHandler = require('../_helpers/error-handler');
app.use(jwt());
app.use(errorHandler);
app.use('/login', require('../users/users.controller'));
app.use('/dashboard', require('./Routes/dashboard'));
app.use('/analysis', require('./Routes/analysis'));
// app.use('/reports', require('./Routes/reports'));
app.use('/reports', require('./Routes/reports'));
app.use(apiErrorHandler);
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
module.exports = app;
//# sourceMappingURL=app.js.map