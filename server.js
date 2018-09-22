var express = require("express");
var app = express();
app.use(express.static(__dirname + "/resources")); // myApp will be the same folder name.
app.get("/", function (req, res,next) {
    //res.redirect("/"); 
    console.log("get request for index page"+ __dirname);
    res.sendFile( __dirname + "/index.html");
});
app.listen(8081, "localhost");
console.log("MyProject Server is Listening on port 8081");