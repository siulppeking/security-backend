require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDatabase } = require('./database');
const v1AuthRouter = require('./routers/auth.router');
const v1CategoryRouter = require('./routers/category.router');

// Config PORT environment
const PORT = process.env.PORT || 3000;

const app = express();

// config morgan
app.use(morgan('dev'));

// config cors
app.use(cors());

// config body parser JSON
app.use(express.json());

// routes
app.use(express.static(__dirname + '/public'))
app.use('/api/v1/auth', v1AuthRouter);
app.use('/api/v1/categories', v1CategoryRouter);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})

connectDatabase()