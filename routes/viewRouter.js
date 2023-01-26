const express = require('express');
const router = express.Router();

const{
    dash,
    charts,
    tables
} = require('../controllers/viewController');

router.get('/',dash);
router.get('/chart',charts);
router.get('/table',tables);

module.exports = router;