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
var ConfigFile = require('../../../Configuration Files/config.json');
var mongoclienturl = ConfigFile.mongoclienturl;
var ApiError = require('../../error/ApiError');
var CryptoJS = require("crypto-js");
router.post('/', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let dateTime = new Date();
    let secretKey = "*$" + dateTime.getDate() + "-" + dateTime.getMonth() + "-" + "@ISL_AJM#$" + "-" + dateTime.getFullYear() + "**";
    var bytes = CryptoJS.AES.decrypt(req.body.encryptedJSON, secretKey);
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    MongoClient.connect(mongoclienturl, (err, db) => {
        if (!err) {
            var db0 = db.db("AJM");
            db0.collection('Login').aggregate([{ $match: { username: decryptedData.username, password: decryptedData.password } }]).toArray((err, result) => {
                if (!err) {
                    if (result.length != 0)
                        return res.status(200).json({ message: 'Success Login' });
                    else {
                        next(ApiError.UnAuthorizedRequest());
                        return;
                    }
                }
                else {
                    console.log(err);
                    next(ApiError.DbQuerryError());
                    return;
                }
            });
        }
        else {
            console.log(err);
            next(ApiError.DbQuerryError());
            return;
        }
    });
}));
module.exports = router;
//# sourceMappingURL=login.js.map