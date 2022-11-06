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
var f = require('../Functions/Add5.30');
var ApiError = require('../../error/ApiError');
router.post('/MixerStatus', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    var Mc = MongoClient.connect(mongoclienturl).then((db, err) => {
        if (!err) {
            var db0 = db.db("AJM");
            db0.collection('MixerStatus').aggregate([{ $match: { machineId: req.body.machineId } }, { $sort: { time: -1 } }, { $limit: 1 }, { $project: { _id: 0 } }]).toArray((err, result) => {
                if (!err)
                    if (result.length == 1)
                        if (result[0].stoptime == '')
                            return res.status(200).json({ "status": true, "time": result[0].time });
                        else
                            return res.status(200).json({ "status": false, "time": result[0].stoptime });
                    else {
                        next(ApiError.NoDAta());
                        return;
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
            next(ApiError.DbConnectError());
            return;
        }
    });
}));
router.post('/HatchStatus', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    var Mc = MongoClient.connect(mongoclienturl).then((db, err) => {
        if (!err) {
            var db0 = db.db("AJM");
            db0.collection('Hatch').aggregate([{ $match: { machineId: req.body.machineId } }, { $sort: { time: -1 } }, { $limit: 1 }, { $project: { _id: 0 } }]).toArray((err, result) => {
                if (!err)
                    if (result.length == 1)
                        if (result[0].stoptime == '')
                            return res.status(200).json({ "status": true, "time": result[0].time });
                        else
                            return res.status(200).json({ "status": false, "time": result[0].stoptime });
                    else {
                        next(ApiError.NoDAta());
                        return;
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
            next(ApiError.DbConnectError());
            return;
        }
    });
}));
router.post('/LeverStatus', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    var Mc = MongoClient.connect(mongoclienturl).then((db, err) => {
        if (!err) {
            var db0 = db.db("AJM");
            db0.collection('Lever').aggregate([{ $match: { machineId: req.body.machineId } }, { $sort: { time: -1 } }, { $limit: 1 }, { $project: { _id: 0 } }]).toArray((err, result) => {
                if (!err)
                    if (result.length == 1)
                        if (result[0].stoptime == '')
                            return res.status(200).json({ "status": true, "time": result[0].time });
                        else
                            return res.status(200).json({ "status": false, "time": result[0].stoptime });
                    else {
                        next(ApiError.NoDAta());
                        return;
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
            next(ApiError.DbConnectError());
            return;
        }
    });
}));
router.post('/TodaysCycleCount', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    var Mc = MongoClient.connect(mongoclienturl).then((db, err) => {
        if (!err) {
            var db0 = db.db("AJM");
            var querydate = new Date(new Date().setUTCHours(0, 0, 0, 0));
            db0.collection('MixerStatus').aggregate([{ $match: { time: { $gt: querydate }, machineId: req.body.machineId } }, { $group: { _id: 1, count: { $sum: 1 } } }, { $project: { _id: 0 } }]).toArray((err, result) => {
                if (!err) {
                    if (result.length != 0)
                        return res.status(200).json(result[0]);
                    else {
                        next(ApiError.NoDAta());
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
            next(ApiError.DbConnectError());
            return;
        }
    });
}));
router.post('/rpm1', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    var Mc = MongoClient.connect(mongoclienturl).then((db, err) => {
        if (!err) {
            var db0 = db.db("AJM");
            db0.collection('Rpm1').aggregate([{ $match: { machineId: req.body.machineId } }, { $sort: { time: -1 } }, { $limit: 1 }, { $project: { _id: 0, time: 0 } }]).toArray((err, result) => {
                if (!err) {
                    if (result.length != 0)
                        return res.status(200).json(result[0]);
                    else {
                        next(ApiError.NoDAta());
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
            next(ApiError.DbConnectError());
            return;
        }
    });
}));
router.post('/rpm2', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    var Mc = MongoClient.connect(mongoclienturl).then((db, err) => {
        if (!err) {
            var db0 = db.db("AJM");
            db0.collection('Rpm2').aggregate([{ $match: { machineId: req.body.machineId } }, { $sort: { time: -1 } }, { $limit: 1 }, { $project: { _id: 0, time: 0 } }]).toArray((err, result) => {
                if (!err) {
                    if (result.length != 0)
                        return res.status(200).json(result[0]);
                    else {
                        next(ApiError.NoDAta());
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
            next(ApiError.DbConnectError());
            return;
        }
    });
}));
router.post('/energyGraph', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    var Mc = MongoClient.connect(mongoclienturl).then((db, err) => {
        if (!err) {
            var db0 = db.db("AJM");
            var querydate = new Date(new Date().setUTCHours(0, 0, 0, 0));
            db0.collection('Energy').aggregate([{ $match: { time: { $gt: querydate }, machineId: req.body.machineId } },
                { $project: { time: 1, diff: 1, _id: 0 } },
                { $group: { _id: { hour: { $hour: "$time" } }, Energy: { $sum: "$diff" } } },
                { $project: { hour: "$_id.hour", _id: 0, Energy: 1 } }, { $sort: { hour: 1 } }
            ]).toArray((err, result) => {
                if (!err) {
                    if (result.length > 0)
                        return res.status(200).json(result);
                    else {
                        next(ApiError.NoDAta());
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
    });
}));
router.post('/CycleDetailsToday', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    var count = 0;
    var Mc = MongoClient.connect(mongoclienturl).then((db, err) => {
        if (!err) {
            var db0 = db.db("AJM");
            var querydate = new Date(new Date().setUTCHours(0, 0, 0, 0));
            db0.collection('MixerStatus').aggregate([{ $match: { time: { $gt: querydate }, machineId: req.body.machineId } },
                { $sort: { time: -1 } },
                { $project: { time: { $dateToString: { format: "%H:%M:%S", date: "$time" } }, _id: 0, stoptime: { $cond: { if: { $eq: ["$stoptime", ''] }, then: 'NA', else: { $dateToString: { format: "%H:%M:%S", date: "$stoptime" } } } },
                    } },
            ]).toArray((err, result) => {
                if (!err) {
                    if (result.length != 0)
                        return res.status(200).json(result);
                    else {
                        next(ApiError.NoDAta());
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
            next(ApiError.DbConnectError());
            return;
        }
    });
}));
router.post('/TodayOnTimeTotal', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    var querydate = new Date(new Date().setUTCHours(0, 0, 0, 0));
    MongoClient.connect(mongoclienturl, (err, db) => {
        if (!err) {
            var db0 = db.db("AJM");
            db0.collection('MixerStatus').aggregate([{ $match: { time: { $gte: querydate }, stoptime: { $ne: '' }, machineId: req.body.machineId } },
                { $project: { dateDifference: { $divide: [{ $subtract: ["$stoptime", "$time"] }, 1000] }, cycleCount: 1 } },
                { $group: { _id: '', TimeDiffinMillis: { $sum: '$dateDifference' } } },
                { $project: { _id: 0, hh: { $trunc: [{ $divide: ["$TimeDiffinMillis", 3600] }, 0] }, TimeDiffinMillis: 1 } },
                { $project: { hh: 1, TimeDiffinMillis: 1, minute: { $subtract: ["$TimeDiffinMillis", { $multiply: ["$hh", 3600] }] } } },
                { $project: { hh: 1, mm: { $trunc: [{ $divide: ["$minute", 60] }, 0] }, TimeDiffinMillis: 1 } },
                { $project: { hh: 1, mm: 1, TimeDiffinMillis: 1, sec1: { $subtract: ["$TimeDiffinMillis", { $multiply: ["$mm", 60] }] } } },
                { $project: { hh: 1, mm: 1, ss: { $trunc: [{ $subtract: ["$sec1", { $multiply: ["$hh", 3600] }] }, 0] } } },
                { $project: { mm: 1, ss: 1, hh: { $cond: { if: { "$gt": ["$hh", 9] }, then: "$hh", else: { $concat: ["0", { $toString: "$hh" }] } } } } },
                { $project: { hh: 1, ss: 1, mm: { $cond: { if: { "$gt": ["$mm", 9] }, then: "$mm", else: { $concat: ["0", { $toString: "$mm" }] } } } } },
                { $project: { hh: 1, mm: 1, ss: { $cond: { if: { "$gt": ["$ss", 9] }, then: "$ss", else: { $concat: ["0", { $toString: "$ss" }] } } } } },
                { $project: { TodaysRunningTime: { $concat: [{ $toString: "$hh" }, ':', { $toString: '$mm' }, ':', { $toString: '$ss' }] } } }
            ]).toArray((err, result) => {
                if (!err) {
                    if (result.length != 0)
                        return res.status(200).json(result[0]);
                    else {
                        next(ApiError.NoDAta());
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
            next(ApiError.DbConnectError());
            return;
        }
    });
}));
module.exports = router;
//# sourceMappingURL=dashboard.js.map