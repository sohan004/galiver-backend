// node js version 20.7.0
const express = require('express');
const app = express();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const geoip = require('geoip-lite');

// Middlewares
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './temp/'
}));

// Routes
app.use('/api/v1', require('./router/v1_route/v1_route'));
app.get('/ip', async (req, res) => {
    try {
        const ip = await req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var geo = await geoip.lookup(ip);
        console.log(geo);
        res.json({ geo , ip});
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})


module.exports = { app };