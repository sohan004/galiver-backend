// node js version 20.7.0
const express = require('express');
const app = express();
const port = process.env.PORT || 3013;
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { createConnection } = require('mongoose');
const dotenv = require('dotenv');

// Middlewares
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './temp/'
}));

// Routes
app.use('/api/v1', require('./router/v1_route/v1_route'));


app.get('/', (req, res) => {
    res.send('Hello World!')
})

// server connection
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})


module.exports = { app };