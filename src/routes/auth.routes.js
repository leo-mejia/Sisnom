const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();


router.post("/registro", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));

module.exports = router;
