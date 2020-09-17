var port = 8081;
const express = require('express')
var bodyParser = require("body-parser")
var app = express()
const fs = require("fs");
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
var cors = require('cors');
app.use(cors())
app.use(bodyParser.json({limit:"10mb"}));
app.use(bodyParser.urlencoded({limit:"10mb", extended:true, parameterLimit:500}))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var data = require("./userData.json");

app.post("/userLogin",(req,res)=>{
    try {
        var username = "user";
        var password = "user@123";
        if(req.body.username==username && req.body.password==password){
            var token = jwt.sign({ username: password }, 'shhhhh');
            res.status(200).json({"message":"Logged In Success","token":token});
        }else{
            res.status(401).json({"message":"Invalid Credentails"});
        }
    } catch (error) {
        res.status(500).json({"message":"Something went wrong","errMsg":error});
    }
})

app.get("/users", auth,(req, res) => {
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

app.post("/addUsers",auth,(req,res)=>{
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

app.put("/updateUser",auth,(req,res)=>{
    try {
        if(req.body!=null){
            var jsonObj = data;
            for (var i = 0; i < jsonObj.length; i++) {
                if (jsonObj[i].phNumber === req.body.phNumber) {
                  jsonObj[i].name = req.body.name;
                  break;
                }
            } 
            fs.writeFile("userData.json", JSON.stringify(jsonObj) , function (err) {
                if (err){
                    res.status(400).json({"message":"Something Went Wrong"}); 
                }else{
                    res.status(200).json({"message":"Updated User From Existing Records"}); 
                }
             })  
        }else{
            res.status(400).json({"message":"Something Went Wrong"});
        }
    } catch (error) {
        res.status(500).json({"message":"Error Updating","errMsg":error});
    }
})

app.delete("/deleteUser",auth,(req,res)=>{
    try{
        if(req.query.phNumber!=null){
            var setValue = data;
            const dataRemoved = setValue.filter((el) => {
            return el.phNumber !== req.query.phNumber;
        });
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