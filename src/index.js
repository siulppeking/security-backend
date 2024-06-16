require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');

const { connectDatabase } = require('./database');
const v1AuthRouter = require('./routers/auth.router');
const v1CategoryRouter = require('./routers/category.router');
const v1ProductRouter = require('./routers/product.router');
const v1SearchRouter = require('./routers/search.router');
const v1UploadRouter = require('./routers/upload.router');

// Config PORT environment
const PORT = process.env.PORT || 3000;

const app = express();

// config morgan
app.use(morgan('dev'));

// config cors
app.use(cors());

// config body parser JSON
app.use(express.json());

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true
}));

// routes
app.use(express.static(__dirname + '/public'))
app.use('/api/v1/auth', v1AuthRouter);
app.use('/api/v1/categories', v1CategoryRouter);
app.use('/api/v1/products', v1ProductRouter);
app.use('/api/v1/search', v1SearchRouter);
app.use('/api/v1/upload', v1UploadRouter);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})

connectDatabase()