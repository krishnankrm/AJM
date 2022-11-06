var MongoClient = require('mongodb').MongoClient;
var ConfigFile=require('../../../Configuration Files/config.json')
var mongoclienturl = ConfigFile.mongoclienturl;
var ApiError=require('../../error/ApiError')
var Excel=require('exceljs');

var cellborderStyles = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" }
  };

  async function excelOp2(array,Machinearray) {
    let workbook = new Excel.Workbook();
    console.log(Machinearray)
   workbook = await workbook.xlsx.readFile('../ExcelList/Mixer Energy Report.xlsx'); 
   let worksheet = workbook.getWorksheet('MIXER STATUS REPORT');
    let k=['A','B','C','D','E','F','G']
    array.forEach((element,i) => {
        k.forEach((ele)=>{
            worksheet.getRow((10+i).toString()).getCell(ele).font = {name: 'Arial', size: 11};
            worksheet.getRow((10+i).toString()).getCell(ele).border = cellborderStyles
            worksheet.getRow((10+i).toString()).getCell(ele).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
           })
        worksheet.getRow((10+i).toString()).getCell('A').value = i+1;
        worksheet.getRow((10+i).toString()).getCell('B').value = element.machineId;
        worksheet.getRow((10+i).toString()).getCell('C').value = element.time.toISOString().slice(0,19).replace('T',' ');
        worksheet.getRow((10+i).toString()).getCell('D').value = element.Energy;
        worksheet.getRow((10+i).toString()).getCell('E').value = element.Power;
        worksheet.getRow((10+i).toString()).getCell('F').value = element.PowerFactor;
        worksheet.getRow((10+i).toString()).getCell('G').value = element.diff;

      
       
    
    })
    return(await workbook);

  }



async function EnergyReport(StartDate,StopDate,reqBody,res100,next)
{
    const client = await MongoClient.connect('mongodb://127.0.0.1:27017/AJM', { useNewUrlParser: true })
    .catch(err => { console.log(err); });
    if (!client) {        return;    }
    try {
        const db = client.db("AJM");
        let collection = db.collection('Energy');
        let res = await collection.aggregate([{$match:{machineId: {$in:reqBody.machine_id}, time:{$gte:StartDate,$lt:StopDate}}},
            {$project:{_id:0}},
        ]).toArray();
       
        excelOp2(res,reqBody.machine_id)
        .then(function(result2){     
            res100.setHeader('Access-Control-Expose-Headers', "Content-Disposition"); 
            res100.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res100.setHeader("Content-Disposition", "attachment; filename=" +`MixerStatusReport.xlsx`);
            return result2.xlsx.write(res100)
               .then(function(){
                res100.end();
               });
        })     

    } catch (err) {
        console.log(err);
    } finally {
        client.close();
        return(1);
    }
}
module.exports = { EnergyReport };
