const express  = require('express');
const { signup, login } = require('../controllers/user');
const router = express.Router();
router
.post("/signup",signup())
.post("/login",login())
.post
module.exports.user = router;