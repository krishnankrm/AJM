var express = require('express');
var router = express.Router()
var MongoClient = require('mongodb').MongoClient;
var path = require("path");
var ConfigFile=require('../../../Configuration Files/config.json')
var mongoclienturl = ConfigFile.mongoclienturl;
var ApiError=require('../../error/ApiError')
var Excel=require('exceljs');

function add532(paramDate)
{
    paramDate=new Date(paramDate)
    paramDate.setHours(paramDate.getHours()+5)
    paramDate.setMinutes(paramDate.getMinutes()+30)
    return(paramDate)
}


var cellborderStyles = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" }
  };

  async function excelOp23(array,array1) {
    let workbook = new Excel.Workbook();
    console.log(1)
   workbook = await workbook.xlsx.readFile('../ExcelList/Book1.xlsx'); 
   let worksheet = workbook.getWorksheet('Sheet1');
    let k=['A','B','C','D','E']
    array.forEach((element,i) => {
        k.forEach((ele)=>{
            worksheet.getRow((7+i).toString()).getCell(ele).font = {name: 'Arial', size: 11};
            worksheet.getRow((7+i).toString()).getCell(ele).border = cellborderStyles
            worksheet.getRow((7+i).toString()).getCell(ele).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
           })
        worksheet.getRow((7+i).toString()).getCell('A').value = i+1;
        worksheet.getRow((7+i).toString()).getCell('B').value = element.cycleCount;
        worksheet.getRow((7+i).toString()).getCell('C').value = element.time.toISOString().slice(0,19).replace('T',' ');
        worksheet.getRow((7+i).toString()).getCell('D').value = element.stoptime.toISOString().slice(0,19).replace('T',' ');
        worksheet.getRow((7+i).toString()).getCell('E').value = Math.floor(element.dateDifference/60)+":"+element.dateDifference % 60;
      
       
    
    })
    return(await workbook);

  }

  function R(StartDate,StopDate)
  {
    return MongoClient.connect(mongoclienturl,(err,db)=>{
        if(!err)
           {    
                var db0 = db.db("AJM");
                db0.collection('MixerStatus').aggregate([{$match:{ time:{$gte:StartDate,$lt:StopDate},stoptime:{$ne:''}}},
                { $project: { dateDifference: {$divide:[ {$subtract: [ "$stoptime", "$time" ]},1000] },time:1,stoptime:1,cycleCount:1}}])
                .toArray(async (err,result)=>{
                    console.log(result.length)
                    return(result.length)
                })

           }
        })
  }

router.post('/EnergyReport', async (req,res100,next) => {
    var StartDate=add532(req.body.start_time)
    var StopDate=add532(req.body.stop_time)

    MongoClient.connect(mongoclienturl,(err,db)=>{
        if(!err)
           {    
                var db0 = db.db("AJM");
                db0.collection('Energy').aggregate([{$match:{ time:{$gte:StartDate,$lt:StopDate},machineId:req.body.machineId}},
                // { $project: { dateDifference: {$divide:[ {$subtract: [ "$stoptime", "$time" ]},1000] },time:1,stoptime:1,cycleCount:1}}
            ]).toArray(async (err,result)=>{
                    if(!err)
                        {
                            if(result.length!=0)
                                {
                                    console.log(result)
                                    // let d=await R(StartDate,StopDate)
                                    //  excelOp23(result, d)
                                    // .then(function(result2){     
                                    //     res100.setHeader('Access-Control-Expose-Headers', "Content-Disposition"); 
                                    //     res100.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                                    //     res100.setHeader("Content-Disposition", "attachment; filename=" +`MixerStatusReport.xlsx`);
                                    //     return result2.xlsx.write(res100)
                                    //        .then(function(){
                                    //         res100.end();
                                    //        });
                                    // })       
                            
                                }        
                            else
                            { next(ApiError.NoDAta()); return;}
                        }
                    else
                        { console.log(err); next(ApiError.DbQuerryError()); return;}
            })
        }
            else
            { console.log(err); next(ApiError.DbQuerryError()); return;}
           })
        
})

module.exports = router
