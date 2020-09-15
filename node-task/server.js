var port = 8081;
const express = require('express')
var bodyParser = require("body-parser")
var app = express()
const fs = require("fs");
app.use(bodyParser.json({limit:"10mb"}));
app.use(bodyParser.urlencoded({limit:"10mb", extended:true, parameterLimit:500}))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var data = require("./userData.json");
app.get("/users", (req, res) => {
    try{
        if(data!=null){
            res.status(200).json({"message":"All User Data Fetched","data": data});
        }else{
            res.status(400).json({"message":"No Data Found"});
        }
    }catch(error){
        res.status(500).json({"message":error});
    }
  });

app.post("/addUsers",(req,res)=>{
    try{
        if(req.body!=null){
            var name= req.body.name;
            var createdDate = req.body.createdDate;
            var phNumber = req.body.phNumber;
            var incomingCallCount = req.body.incomingCallCount;
            var location = req.body.location;
            var outGoingCallCount = req.body.outGoingCallCount;
            let user = {"name": name,"createdDate": createdDate, "phNumber":phNumber, "incomingCallCount": incomingCallCount,"location": location,"outGoingCallCount": outGoingCallCount };
            data.push(user);
            fs.writeFile("userData.json", JSON.stringify(data) , function (err) {
                if (err){
                    res.status(400).json({"message":"Something Went Wrong"}); 
                }else{
                    res.status(200).json({"message":"Added User To Existing Records"}); 
                }
             })          
        }else{
            res.status(400).json({"message":"Somethong Went Wrong"});
        }
    }catch(error){
        res.status(500).json({"message":"Something went worng","errorMsg":error});
    }
})

app.put("/updateUser",(req,res)=>{
    
})

app.delete("/deleteUser",(req,res)=>{
    try{
        if(req.query.phNumber!=null){
            var setValue = data;
            const dataRemoved = setValue.filter((el) => {
            return el.phNumber !== req.query.phNumber;
        });
        console.log(dataRemoved);
        fs.writeFile("userData.json", JSON.stringify(dataRemoved) , function (err) {
            if (err){
                res.status(400).json({"message":"Something Went Wrong"}); 
            }else{
                res.status(200).json({"message":"Deleted User From Existing Records"}); 
            }
         })   
        }else{
            res.status(400).json({"message":"Somethong Went Wrong"});
        }
    }catch(error){
        res.status(500).json({"message":"Error Deleting","errMsg":error});
    }
})

app.listen(port,() => {
    console.log("Backend Server Started at",port,"\n");
})