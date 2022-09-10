const express = require('express');
const router = express.Router();

const demoController = require('../controllers/demo.controller');

router.post('/getStatePolygon', demoController.getStatePolygon);
router.post('/searchFilter', demoController.searchFilter);
router.post('/consultaDenue', demoController.consultaDenue);
router.post('/censoEconomico', demoController.getCensoEconomico);
router.post('/subcategoriesDenue', demoController.getSubcategoriesDenue);
router.post('/historicalDenue', demoController.getHistoricalDenue);

module.exports = router;
