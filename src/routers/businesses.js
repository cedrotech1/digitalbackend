const express = require('express');
const router = express.Router();
const { getAllJsons } = require('../controllers/businesesController'); 

// Get all combined JSON data
router.get('/all', getAllJsons);

module.exports = router;
