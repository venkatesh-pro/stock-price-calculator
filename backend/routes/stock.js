const express = require("express");
const {
  getStockListByTyping,
  getStockListByTypingPrice,
} = require("../controller/stock");

const router = express.Router();

router.post("/getStockListByTyping", getStockListByTyping);
router.post("/getStockListByTypingPrice", getStockListByTypingPrice);

module.exports = router;
