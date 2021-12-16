var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/"; //connection URL

function Test() {
  MongoClient.connect(url, function (err, db) { //connect server
    if (err) throw err;

    var dbo = db.db("testdb"); //database ชื่อ testdb
    var Value = Math.random() * 1000; 
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;
    var myobj = { DATABASE: "realtime", Timestamp: dateTime, Value: Value };
    var mydetails = { DATABASE: "realtime" };
    var updateValue = {
      $set: { DATABASE: "realtime", Timestamp: dateTime, Value: Value },
    };
    var query = { DATABASE: "realtime" }; //กำหนดให้ค้นหา DATABASE "realtime"

    dbo.collection("DBrealtime").findOne({}, function (err, res) { //ค้นหา collection ที่ชื่อ "DBrealtime"
      if (err) throw err;
      if (res === null) 
        dbo.collection("DBrealtime").insertOne(myobj, function (err, res) { //ถ้าไม่เจอ ให้เพิ่ม collection ชื่อ DBrealtime เข้าไป
          console.log("Create document");
        });

      else {
        dbo
          .collection("DBrealtime")
          .updateOne(mydetails, updateValue, function (err, res) { //ถ้ามี collection DBrealtime อยู่แล้ว ให้อัพเดทข้อมูลใหม่เข้าไป
            console.log("1 document updated in DBrealtime");
          });
      }
    });

    dbo
      .collection("DBrealtime")   
      .find(query) //ค้นหาคำว่า DATABASE "realtime" ใน collection"DBrealtime" 
      .toArray(function (err, res) { //อาร์เรย์ result
        console.log(res); //แสดงผล result ทีได้
      });

    dbo.collection("RVCsat").insertOne(myobj, function (err, res) { //เพิ่ม document เข้าไปใน collection"RVCsat"เข้าไป
      if (err) throw err;
      console.log("1 document inserted");
    });

    dbo
      .collection("RVCsat")
      .find(query) //ค้นหาคำว่า DATABASE "realtime" ใน collection"RVCsat"
      .toArray(function (err, res) { //อาร์เรย์ result
        console.log(res); //แสดงผล result ทีได้
        db.close();
      });

    setTimeout(Test, 1000); //หน่วงเวลา 1 วินาที ในการวนลูป
  });
}

setTimeout(Test, 1000); //หน่วงเวลา 1 วินาที ในการแสดงผล
