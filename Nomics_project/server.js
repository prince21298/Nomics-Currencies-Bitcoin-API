const express=require('express')
const app = express()
app.use(express.json())
const axios=require('axios')
const dotenv=require('dotenv').config()
const CircularJSON=require('circular-json')
const port = process.env.port

// Creating Database and Tables.
var knex = require('./model/table')

// Task 1
var currencies=express.Router()
app.use('/',currencies)
require('./controllers/Currency_m_data')(currencies,axios,CircularJSON,knex)

// Task 2

var ticker_m_data=express.Router();
app.use('/',ticker_m_data);
require('./controllers/tickerMetadata')(ticker_m_data,axios,CircularJSON,knex)


app.listen(port,()=>{
    console.log('port is working......  ');
})