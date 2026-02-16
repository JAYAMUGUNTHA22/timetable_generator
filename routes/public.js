const express = require('express');
const router = express.Router();
const Department = require('../models/Department');

router.get('/departments', async (req, res) => {
  try {
    const list = await Department.find().select('_id departmentId name sectionsCount').lean();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
