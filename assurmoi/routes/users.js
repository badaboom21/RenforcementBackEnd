const express = require("express");
const router = express.Router();
const { validateUsername } = require("../middlewares/users");

router.post("/", validateUsername, (req, res) => {
  const user = req.body;
  res.status(201).json({
    user,
  });
});

router.get("/:id", (req, res) => {
  res.status(200).json({
    user: req.params.id,
  });
});

module.exports = router;
