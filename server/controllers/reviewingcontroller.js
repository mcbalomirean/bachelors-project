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
    let results = await db.Quiz.findAll({
      attributes: {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("Sessions.id")), "noStudents"],
        ],
        exclude: ["createdAt", "updatedAt"],
      },
      include: [{ model: db.Session, attributes: [] }],
      group: ["Quiz.id", Sequelize.col("Sessions.id")],
    });

    res.status(200).send(results);
  } catch (error) {
    // TODO: change? don't just send server-side error
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports.getQuizSessions = async (req, res) => {
  try {
    let quiz = await db.Quiz.findByPk(req.params.id);

    if (quiz) {
      let results = await quiz.getSessions({
        attributes: {
          include: [
            [
              Sequelize.fn("COUNT", Sequelize.col("FlaggedData.id")),
              "noFlaggedData",
            ],
          ],
          exclude: ["createdAt", "updatedAt"],
        },
        include: [{ model: db.FlaggedData, as: "FlaggedData", attributes: [] }],
        group: ["Session.id"],
      });

      res.status(200).send(results);
    } else {
      res.status(404).send("Quiz not found.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};