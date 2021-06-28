const { Sequelize } = require("sequelize");
const db = require("../models/database");

module.exports.create = async (req, res) => {
  try {
    let result = await db.Quiz.create({
      id: parseInt(req.body.id),
      platform: req.body.platform,
    });
    res.status(201).send(result);
  } catch (error) {
    // TODO: change? don't just send server-side error
    res.status(500).send(error);
  }
};

module.exports.toggleQuizState = async (req, res) => {
  try {
    let [affected, actual] = await db.Quiz.update(
      { isActive: Sequelize.literal("NOT isActive") },
      { where: { id: req.body.id } }
    );

    if (affected <= 0) {
      throw Error("Could not find quiz, or failed to toggle status.");
    }

    res.status(200).end();
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports.unflagData = async (req, res) => {
  try {
    let deletedRows = await db.FlaggedData.destroy({
      where: { id: req.params.id },
    });

    if (deletedRows) {
      res.status(200).send({ message: "Data unflagged." });
    } else {
      res.status(404).send({ message: "No data found." });
    }
  } catch (error) {
    console.log(error);
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
      // group: ["Quiz.id", Sequelize.col("Sessions.id")],
      group: ["Quiz.id"],
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
              Sequelize.literal(
                "(SELECT COUNT(`Flagged_Data`.`id`) FROM `Flagged_Data` WHERE `Flagged_Data`.`SessionId` = `Session`.`id` AND `Flagged_Data`.`type` = 1)"
              ),
              "noFlaggedFrames",
            ],
            [
              Sequelize.literal(
                "(SELECT COUNT(`Flagged_Data`.`id`) FROM `Flagged_Data` WHERE `Flagged_Data`.`SessionId` = `Session`.`id` AND `Flagged_Data`.`type` = 2)"
              ),
              "noFlaggedMiscData",
            ],
            [
              Sequelize.literal("(SELECT noFlaggedFrames + noFlaggedMiscData)"),
              "noFlaggedData",
            ],
          ],
          exclude: ["createdAt", "updatedAt"],
        },
        include: [{ model: db.FlaggedData, as: "FlaggedData", attributes: [] }],
      });

      res.status(200).send(results);
    } else {
      res.status(404).send({ message: "Quiz not found." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

module.exports.getFlaggedData = async (req, res) => {
  try {
    let session = await db.Session.findByPk(req.params.id);

    if (session) {
      let results = await session.getFlaggedData({
        attributes: {
          exclude: ["SessionId", "createdAt", "updatedAt"],
        },
        where: { type: req.params.type },
      });

      res.status(200).send(results);
    } else {
      res.status(404).send({ message: "Session not found." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
