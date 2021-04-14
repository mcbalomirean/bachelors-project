const { Sequelize } = require("sequelize");
var db = require("../models/database");

module.exports.create = async (req, res) => {
  try {
    let result = await db.Quiz.create({
      id: req.body.id,
      platform: req.body.platform,
    });
    res.status(201).send(result);
  } catch (error) {
    // TODO: change? don't just send server-side error
    res.status(500).send(error);
  }
};

module.exports.toggle = async (req, res) => {
  try {
    let [affected, actual] = await db.Quiz.update(
      { isActive: Sequelize.literal("NOT isActive") },
      { where: { id: req.params.id } }
    );

    if (affected <= 0) {
      throw Error("Could not find quiz, or failed to toggle status.");
    }

    res.status(200).end();
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports.findAll = async (req, res) => {
  try {
    let results = await db.Quiz.findAll();
    res.status(200).send(results);
  } catch (error) {
    // TODO: change? don't just send server-side error
    res.status(500).send(error);
  }
};
