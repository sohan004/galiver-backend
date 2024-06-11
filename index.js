// node js version 20.7.0
const express = require('express');
const app = express();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const geoip = require('geoip-lite');
const { getName, getCode } = require('country-list');

// Middlewares
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './temp/'
}));

app.use('/', (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
    const geo = geoip.lookup(ip)?.country || 'BD'
    const countryName = getName(geo);
    console.log(geo, countryName);
    req.country = countryName;
    next();
});

// Routes
app.use('/api/v1', require('./router/v1_route/v1_route'));
app.get('/ip', async (req, res) => {
    try {
        const country = await req.country;
        res.json({ country });
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})


module.exports = { app };