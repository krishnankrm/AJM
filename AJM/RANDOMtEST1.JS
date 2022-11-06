var date1=new Date("2022-09-19T00:00:00.000Z")
var date2=new Date("2022-09-21T00:00:00.000Z")
var delta=(date2.getTime()-date1.getTime())/24
var newDateArray=[]
for (i=0;i<24;i++)
{
    newDateArray.push(new Date(date1.setTime(date1.getTime()+delta)))
}

console.log(newDateArray)