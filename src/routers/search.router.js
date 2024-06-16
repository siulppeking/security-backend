const express = require('express');
const searchController = require('../controllers/search.controller');

const v1SearchRouter = express.Router();

v1SearchRouter.get('/:collection/:filter', searchController.searchCollection)

module.exports = v1SearchRouter