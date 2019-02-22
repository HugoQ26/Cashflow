const router = require('express').Router();
const error_ctrl = require('../Controllers/404_ctrl');




module.exports = router.use(error_ctrl);