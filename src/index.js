require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDatabase } = require('./database');
const { v1CategoryRouter } = require('./routers/category.router');
const { v1UserRouter } = require('./routers/user.router');
const morgan = require('morgan');

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
app.use('/api/v1/categories', v1CategoryRouter);
app.use('/api/v1/users', v1UserRouter);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})

connectDatabase()