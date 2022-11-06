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
function add530(paramDate) {
    paramDate = new Date(paramDate);
    paramDate.setHours(paramDate.getHours() + 5);
    paramDate.setMinutes(paramDate.getMinutes() + 30);
    return (paramDate);
}
function TimeInterval20(startDate, stopDate) {
    var delta = (stopDate.getTime() - startDate.getTime()) / 24;
    var newDateArray = [];
    for (let i = 0; i < 24; i++) {
        newDateArray.push(new Date(startDate.setTime(startDate.getTime() + delta)));
    }
    return (newDateArray);
}
router.post('/MixerOnOffTime', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    var StartDate = add530(req.body.start);
    var StopDate = add530(req.body.stop);
    MongoClient.connect(mongoclienturl, (err, db) => {
        if (!err) {
            var db0 = db.db("AJM");
            db0.collection('MixerStatus').aggregate([{ $match: { time: { $gte: StartDate, $lt: StopDate }, stoptime: { $ne: '' }, machineId: req.body.machineId } },
                { $project: { dateDifference: { $divide: [{ $subtract: ["$stoptime", "$time"] }, 1000] } } },
                { $group: { _id: '', TimeDiffinSec: { $sum: '$dateDifference' } } },
                { $project: { _id: 0, TimeDiffinSec: 1, TotalTimeDiffinSec: { $divide: [{ $subtract: [StopDate, StartDate] }, 1000] } } },
                { $project: { _id: 0, TimeDiffinSec: 1, TotalTimeDiffinSec: { $subtract: ["$TotalTimeDiffinSec", "$TimeDiffinSec"] } } },
                { $project: { _id: 0, hh: { $trunc: [{ $divide: ["$TimeDiffinSec", 3600] }, 0] }, TimeDiffinSec: 1, TotalTimeDiffinSec: 1, hh1: { $trunc: [{ $divide: ["$TotalTimeDiffinSec", 3600] }, 0] } } },
                { $project: { hh: 1, TimeDiffinSec: 1, minute: { $subtract: ["$TimeDiffinSec", { $multiply: ["$hh", 3600] }] }, hh1: 1, TotalTimeDiffinSec: 1, minute1: { $subtract: ["$TotalTimeDiffinSec", { $multiply: ["$hh1", 3600] }] } } },
                { $project: { hh: 1, mm: { $trunc: [{ $divide: ["$minute", 60] }, 0] }, TimeDiffinSec: 1, hh1: 1, mm1: { $trunc: [{ $divide: ["$minute1", 60] }, 0] }, TotalTimeDiffinSec: 1 } },
                { $project: { hh: 1, mm: 1, TimeDiffinSec: 1, seca: { $subtract: ["$TimeDiffinSec", { $multiply: ["$mm", 60] }] }, hh1: 1, mm1: 1, TotalTimeDiffinSec: 1, seca1: { $subtract: ["$TotalTimeDiffinSec", { $multiply: ["$mm1", 60] }] } } },
                { $project: { hh: 1, mm: 1, ss: { $trunc: [{ $subtract: ["$seca", { $multiply: ["$hh", 3600] }] }, 0] }, hh1: 1, mm1: 1, ss1: { $trunc: [{ $subtract: ["$seca1", { $multiply: ["$hh1", 3600] }] }, 0] } } },
                { $project: { mm: 1, ss: 1, hh: { $cond: { if: { "$gt": ["$hh", 9] }, then: "$hh", else: { $concat: ["0", { $toString: "$hh" }] } } }, mm1: 1, ss1: 1, hh1: { $cond: { if: { "$gt": ["$hh1", 9] }, then: "$hh1", else: { $concat: ["0", { $toString: "$hh1" }] } } } } },
                { $project: { hh: 1, ss: 1, mm: { $cond: { if: { "$gt": ["$mm", 9] }, then: "$mm", else: { $concat: ["0", { $toString: "$mm" }] } } }, hh1: 1, ss1: 1, mm1: { $cond: { if: { "$gt": ["$mm1", 9] }, then: "$mm1", else: { $concat: ["0", { $toString: "$mm1" }] } } } } },
                { $project: { hh: 1, mm: 1, ss: { $cond: { if: { "$gt": ["$ss", 9] }, then: "$ss", else: { $concat: ["0", { $toString: "$ss" }] } } }, hh1: 1, mm1: 1, ss1: { $cond: { if: { "$gt": ["$ss1", 9] }, then: "$ss1", else: { $concat: ["0", { $toString: "$ss1" }] } } } } },
                { $project: { Ontime: { $concat: [{ $toString: "$hh" }, ':', { $toString: '$mm' }, ':', { $toString: '$ss' }] }, OFF_time: { $concat: [{ $toString: "$hh1" }, ':', { $toString: '$mm1' }, ':', { $toString: '$ss1' }] } } }
            ]).toArray((err, result) => {
                if (!err) {
                    console.log(result);
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
router.post('/LatchOnOfftime', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    var StartDate = add530(req.body.start);
    var StopDate = add530(req.body.stop);
    MongoClient.connect(mongoclienturl, (err, db) => {
        if (!err) {
            var db0 = db.db("AJM");
            db0.collection('Lever').aggregate([{ $match: { time: { $gte: StartDate, $lt: StopDate }, stoptime: { $ne: '' }, machineId: req.body.machineId } },
                { $project: { dateDifference: { $divide: [{ $subtract: ["$stoptime", "$time"] }, 1000] } } },
                { $group: { _id: '', TimeDiffinSec: { $sum: '$dateDifference' } } },
                { $project: { _id: 0, TimeDiffinSec: 1, TotalTimeDiffinSec: { $divide: [{ $subtract: [StopDate, StartDate] }, 1000] } } },
                { $project: { _id: 0, TimeDiffinSec: 1, TotalTimeDiffinSec: { $subtract: ["$TotalTimeDiffinSec", "$TimeDiffinSec"] } } },
                { $project: { _id: 0, hh: { $trunc: [{ $divide: ["$TimeDiffinSec", 3600] }, 0] }, TimeDiffinSec: 1, TotalTimeDiffinSec: 1, hh1: { $trunc: [{ $divide: ["$TotalTimeDiffinSec", 3600] }, 0] } } },
                { $project: { hh: 1, TimeDiffinSec: 1, minute: { $subtract: ["$TimeDiffinSec", { $multiply: ["$hh", 3600] }] }, hh1: 1, TotalTimeDiffinSec: 1, minute1: { $subtract: ["$TotalTimeDiffinSec", { $multiply: ["$hh1", 3600] }] } } },
                { $project: { hh: 1, mm: { $trunc: [{ $divide: ["$minute", 60] }, 0] }, TimeDiffinSec: 1, hh1: 1, mm1: { $trunc: [{ $divide: ["$minute1", 60] }, 0] }, TotalTimeDiffinSec: 1 } },
                { $project: { hh: 1, mm: 1, TimeDiffinSec: 1, seca: { $subtract: ["$TimeDiffinSec", { $multiply: ["$mm", 60] }] }, hh1: 1, mm1: 1, TotalTimeDiffinSec: 1, seca1: { $subtract: ["$TotalTimeDiffinSec", { $multiply: ["$mm1", 60] }] } } },
                { $project: { hh: 1, mm: 1, ss: { $trunc: [{ $subtract: ["$seca", { $multiply: ["$hh", 3600] }] }, 0] }, hh1: 1, mm1: 1, ss1: { $trunc: [{ $subtract: ["$seca1", { $multiply: ["$hh1", 3600] }] }, 0] } } },
                { $project: { mm: 1, ss: 1, hh: { $cond: { if: { "$gt": ["$hh", 9] }, then: "$hh", else: { $concat: ["0", { $toString: "$hh" }] } } }, mm1: 1, ss1: 1, hh1: { $cond: { if: { "$gt": ["$hh1", 9] }, then: "$hh1", else: { $concat: ["0", { $toString: "$hh1" }] } } } } },
                { $project: { hh: 1, ss: 1, mm: { $cond: { if: { "$gt": ["$mm", 9] }, then: "$mm", else: { $concat: ["0", { $toString: "$mm" }] } } }, hh1: 1, ss1: 1, mm1: { $cond: { if: { "$gt": ["$mm1", 9] }, then: "$mm1", else: { $concat: ["0", { $toString: "$mm1" }] } } } } },
                { $project: { hh: 1, mm: 1, ss: { $cond: { if: { "$gt": ["$ss", 9] }, then: "$ss", else: { $concat: ["0", { $toString: "$ss" }] } } }, hh1: 1, mm1: 1, ss1: { $cond: { if: { "$gt": ["$ss1", 9] }, then: "$ss1", else: { $concat: ["0", { $toString: "$ss1" }] } } } } },
                { $project: { Ontime: { $concat: [{ $toString: "$hh" }, ':', { $toString: '$mm' }, ':', { $toString: '$ss' }] }, OFF_time: { $concat: [{ $toString: "$hh1" }, ':', { $toString: '$mm1' }, ':', { $toString: '$ss1' }] } } }
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
router.post('/HatchOnOfftime', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    var StartDate = add530(req.body.start);
    var StopDate = add530(req.body.stop);
    MongoClient.connect(mongoclienturl, (err, db) => {
        if (!err) {
            var db0 = db.db("AJM");
            db0.collection('Hatch').aggregate([{ $match: { time: { $gte: StartDate, $lt: StopDate }, stoptime: { $ne: '' }, machineId: req.body.machineId } },
                { $project: { dateDifference: { $divide: [{ $subtract: ["$stoptime", "$time"] }, 1000] } } },
                { $group: { _id: '', TimeDiffinSec: { $sum: '$dateDifference' } } },
                { $project: { _id: 0, TimeDiffinSec: 1, TotalTimeDiffinSec: { $divide: [{ $subtract: [StopDate, StartDate] }, 1000] } } },
                { $project: { _id: 0, TimeDiffinSec: 1, TotalTimeDiffinSec: { $subtract: ["$TotalTimeDiffinSec", "$TimeDiffinSec"] } } },
                { $project: { _id: 0, hh: { $trunc: [{ $divide: ["$TimeDiffinSec", 3600] }, 0] }, TimeDiffinSec: 1, TotalTimeDiffinSec: 1, hh1: { $trunc: [{ $divide: ["$TotalTimeDiffinSec", 3600] }, 0] } } },
                { $project: { hh: 1, TimeDiffinSec: 1, minute: { $subtract: ["$TimeDiffinSec", { $multiply: ["$hh", 3600] }] }, hh1: 1, TotalTimeDiffinSec: 1, minute1: { $subtract: ["$TotalTimeDiffinSec", { $multiply: ["$hh1", 3600] }] } } },
                { $project: { hh: 1, mm: { $trunc: [{ $divide: ["$minute", 60] }, 0] }, TimeDiffinSec: 1, hh1: 1, mm1: { $trunc: [{ $divide: ["$minute1", 60] }, 0] }, TotalTimeDiffinSec: 1 } },
                { $project: { hh: 1, mm: 1, TimeDiffinSec: 1, seca: { $subtract: ["$TimeDiffinSec", { $multiply: ["$mm", 60] }] }, hh1: 1, mm1: 1, TotalTimeDiffinSec: 1, seca1: { $subtract: ["$TotalTimeDiffinSec", { $multiply: ["$mm1", 60] }] } } },
                { $project: { hh: 1, mm: 1, ss: { $trunc: [{ $subtract: ["$seca", { $multiply: ["$hh", 3600] }] }, 0] }, hh1: 1, mm1: 1, ss1: { $trunc: [{ $subtract: ["$seca1", { $multiply: ["$hh1", 3600] }] }, 0] } } },
                { $project: { mm: 1, ss: 1, hh: { $cond: { if: { "$gt": ["$hh", 9] }, then: "$hh", else: { $concat: ["0", { $toString: "$hh" }] } } }, mm1: 1, ss1: 1, hh1: { $cond: { if: { "$gt": ["$hh1", 9] }, then: "$hh1", else: { $concat: ["0", { $toString: "$hh1" }] } } } } },
                { $project: { hh: 1, ss: 1, mm: { $cond: { if: { "$gt": ["$mm", 9] }, then: "$mm", else: { $concat: ["0", { $toString: "$mm" }] } } }, hh1: 1, ss1: 1, mm1: { $cond: { if: { "$gt": ["$mm1", 9] }, then: "$mm1", else: { $concat: ["0", { $toString: "$mm1" }] } } } } },
                { $project: { hh: 1, mm: 1, ss: { $cond: { if: { "$gt": ["$ss", 9] }, then: "$ss", else: { $concat: ["0", { $toString: "$ss" }] } } }, hh1: 1, mm1: 1, ss1: { $cond: { if: { "$gt": ["$ss1", 9] }, then: "$ss1", else: { $concat: ["0", { $toString: "$ss1" }] } } } } },
                { $project: { Ontime: { $concat: [{ $toString: "$hh" }, ':', { $toString: '$mm' }, ':', { $toString: '$ss' }] }, OFF_time: { $concat: [{ $toString: "$hh1" }, ':', { $toString: '$mm1' }, ':', { $toString: '$ss1' }] } } }
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
router.post('/TotalCycleCount', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    var StartDate = add530(req.body.start);
    var StopDate = add530(req.body.stop);
    var Mc = MongoClient.connect(mongoclienturl).then((db, err) => {
        if (!err) {
            var db0 = db.db("AJM");
            var querydate = new Date(new Date().setUTCHours(0, 0, 0, 0));
            db0.collection('MixerStatus').aggregate([{ $match: { time: { $gte: StartDate, $lt: StopDate }, machineId: req.body.machineId } },
                { $group: { _id: 1, count: { $sum: 1 } } }, { $project: { _id: 0 } }]).toArray((err, result) => {
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
router.post('/RPM1', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    var StartDate = add530(req.body.start);
    var StopDate = add530(req.body.stop);
    var Mc = MongoClient.connect(mongoclienturl).then((db, err) => {
        if (!err) {
            var db0 = db.db("AJM");
            db0.collection('Rpm1').aggregate([{ $match: { time: { $gte: StartDate, $lt: StopDate }, machineId: req.body.machineId } },
                { $group: { _id: '', avg: { $avg: "$val" }, max: { $max: "$val" }, min: { $min: "$val" } } },
                { $project: { _id: 0, avg: { $trunc: ["$avg", 2] }, max: 1, min: 1 } }
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
router.post('/RPM2', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    var StartDate = add530(req.body.start);
    var StopDate = add530(req.body.stop);
    var Mc = MongoClient.connect(mongoclienturl).then((db, err) => {
        if (!err) {
            var db0 = db.db("AJM");
            db0.collection('Rpm2').aggregate([{ $match: { time: { $gte: StartDate, $lt: StopDate }, machineId: req.body.machineId } },
                { $group: { _id: '', avg: { $avg: "$val" }, max: { $max: "$val" }, min: { $min: "$val" } } },
                { $project: { _id: 0, avg: { $trunc: ["$avg", 2] }, max: 1, min: 1 } }
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
router.post('/energyGraph', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    var StartDate = add530(req.body.start);
    var StopDate = add530(req.body.stop);
    var resultantFinal = [];
    var TimeInterval = TimeInterval20(StartDate, StopDate);
    for (let i = 0; i < TimeInterval.length; i++) {
        var Mc = MongoClient.connect(mongoclienturl).then((db, err) => {
            if (!err) {
                var db0 = db.db("AJM");
                db0.collection('Energy').aggregate([{ $match: { machineId: req.body.machineId, time: { $gt: TimeInterval[i], $lt: TimeInterval[i + 1] } } },
                    { $group: { _id: null, Energy: { $sum: "$Energy" } } },
                    { $project: { _id: 0, Energy: 1 } },
                ]).toArray((err, result) => {
                    if (!err) {
                        if (result.length != 0) {
                            resultantFinal.push({ time: TimeInterval[i], Energy: (result[0]['Energy']).toFixed(2) });
                        }
                        else
                            resultantFinal.push({ time: TimeInterval[i], Energy: "0" });
                        if (resultantFinal.length == 24) {
                            resultantFinal = resultantFinal.sort((a, b) => {
                                if (a.time.getTime() < b.time.getTime()) {
                                    return -1;
                                }
                            });
                            return res.status(200).json(resultantFinal);
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
    }
}));
module.exports = router;
//# sourceMappingURL=analysis.js.map