const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    const query = req.body.cityName;
    const appid = "26e2be791fa988fca83ac3eeb8ad7c93";
    const units = "metric";
    const url = "http://api.openweathermap.org/data/2.5/weather?appid=" + appid + "&units=" + units + "&q=" + query;

    http.get(url, function (response) {
        console.log(response.statusCode);

        response.on("data", function (data) { //data---json format
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const weatherIcon = weatherData.weather[0].icon;
            const imageUrl = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
            console.log(weatherDescription);
            res.write("<h1>The temperature in " + query + " is " + temp + " degrees celcis.</h1>");
            res.write("<br>The weather now is " + weatherDescription + "</br>");
            res.write("<img src=" + imageUrl + ">");
            res.send();
        });
    });

});

app.listen(3000, function () {
    console.log("server is running");
});