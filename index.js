const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();

api = process.env.API_KEY

app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
    console.log("Server started on port 3000!")
});

app.get('/', (req, res) => {
    // console.log(req.body)
    res.render('index', {
        icon: null,
        weather: null,
        desc: null,
        temp: null,
        humidity: null,
        wind: null,
        country: null,
        city: null,
        vis: null,
        date: null,
        time: null,
        message: 200,
        img: "main"
    })
})

app.post('/', (req, res, next) => {
    const location = req.body.loc
    // var d = new Date((new Date().getTime()) + 19800 * 1000)
    // var date = d.toISOString().slice(11, 16)
    // var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();;
    // console.log(date)

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${api}`
    axios.get(url)
        .then((response) => {
            const data = response.data
            const d = new Date((new Date().getTime()))
            const date = d.toLocaleString("en-IN", {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });
            const time = d.toLocaleTimeString("en-IN")
            const main = data.weather[0].main
            const icon = main.toLowerCase()
            const wind = (data.wind.speed * (18 / 5)).toFixed(2)
            const vis = data.visibility / 1000
            var img = icon
            // console.log(img)
            if (data.weather[0].id >= 300 && data.weather[0].id <= 531) {
                img = "rain"
            } else if (data.weather[0].id >= 701 && data.weather[0].id <= 781) {
                img = "haze"
            }
            res.render('index', {
                img,
                icon: data.weather[0].icon,
                weather: data.weather[0].main,
                desc: data.weather[0].description,
                temp: data.main.temp,
                humidity: data.main.humidity,
                wind,
                country: data.sys.country,
                city: data.name,
                vis,
                date,
                time,
                message: data.cod
            })
        })
        .catch((err) => {
            console.log(err)
            res.render('index', {
                icon: null,
                weather: null,
                desc: null,
                temp: null,
                humidity: null,
                wind: null,
                country: null,
                city: null,
                vis: null,
                date: null,
                time: null,
                message: 404,
                img: "main"
            })
        });
})


