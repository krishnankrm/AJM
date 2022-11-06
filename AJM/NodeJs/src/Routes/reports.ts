var express = require('express');
var router = express.Router()
var MongoClient = require('mongodb').MongoClient;
var path = require("path");

var ApiError=require('../../error/ApiError')

var EnergyReport1=require('./EnergyReport')

function add535(paramDate)
{
    paramDate=new Date(paramDate)
    paramDate.setHours(paramDate.getHours()+5)
    paramDate.setMinutes(paramDate.getMinutes()+30)
    return(paramDate)
}
router.post('/', async (req,res100,next) => {
    var StartDate=add535(req.body.start_time)
    var StopDate=add535(req.body.stop_time)

    if(req.body.report_type==="Energy consumption report")
    {
        EnergyReport1.EnergyReport(StartDate,StopDate,req.body,res100,next)
    }


   
})

module.exports = router
