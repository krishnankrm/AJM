var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var path = require("path");
var ApiError = require('../../error/ApiError');
var EnergyReport1 = require('./EnergyReport');
function add535(paramDate) {
    paramDate = new Date(paramDate);
    paramDate.setHours(paramDate.getHours() + 5);
    paramDate.setMinutes(paramDate.getMinutes() + 30);
    return (paramDate);
}
router.post('/', (req, res100, next) => __awaiter(this, void 0, void 0, function* () {
    var StartDate = add535(req.body.start_time);
    var StopDate = add535(req.body.stop_time);
    if (req.body.report_type === "Energy consumption report") {
        EnergyReport1.EnergyReport(StartDate, StopDate, req.body, res100, next);
    }
}));
module.exports = router;
//# sourceMappingURL=reports.js.map