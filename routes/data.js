const { fetchDataAndStore, displayData } = require('../controllers/data');

const router = require('express').Router();

router.get('/fetch_data', fetchDataAndStore)
router.get('/display_data', displayData)

module.exports = router