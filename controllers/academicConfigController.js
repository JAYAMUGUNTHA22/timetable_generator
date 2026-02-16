const AcademicConfig = require('../models/AcademicConfig');

const getConfig = async (req, res) => {
  try {
    let config = await AcademicConfig.findOne().sort({ updatedAt: -1 });
    if (!config) {
      config = await AcademicConfig.create({
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        periodsPerDay: 7,
        breakPeriodIndices: []
      });
    }
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateConfig = async (req, res) => {
  try {
    const { workingDays, periodsPerDay, breakPeriodIndices } = req.body;
    let config = await AcademicConfig.findOne().sort({ updatedAt: -1 });
    if (!config) {
      config = new AcademicConfig();
    }
    if (workingDays !== undefined) config.workingDays = workingDays;
    if (periodsPerDay !== undefined) config.periodsPerDay = periodsPerDay;
    if (breakPeriodIndices !== undefined) config.breakPeriodIndices = breakPeriodIndices;
    config.updatedAt = new Date();
    await config.save();
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getConfig, updateConfig };
