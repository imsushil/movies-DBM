var express = require("express");
var app = express();
app.use(express.static(__dirname + "/resources")); // myApp will be the same folder name.
app.get("/", function (req, res,next) {
    console.log("get request for index page"+ __dirname);
    res.sendFile( __dirname + "/index.html");
});
app.listen(process.env.PORT || 8080);
console.log("MoviesDBM Server is Listening on port:" + process.env.PORT);
