var express = require("express");
var path = require("path");
const bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/form.html"));
});

app.post("/addName", (req, res) => {
    const name = req.body.name;
    const age = req.body.age;
    console.log("Received data: ", name, age);
    //res.status(200).send("Data received successfully");
    res.redirect("/");
});

app.listen(3000, function() {
    console.log("Example is running on port 3000");
});
