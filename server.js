require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const morgan = require('morgan');
const ejs = require('ejs');

const app = express();
app.use(express.static('public'));

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.set('view engine', 'ejs');


const port = process.env.PORT || 5000; 


const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT, 
});

module.exports = pool

//Routes
app.use('/api/v1', require('./routes/data'))

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
