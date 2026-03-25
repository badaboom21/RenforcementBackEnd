const { History } = require("../models");

const getAllHistories = async (req, res) => {
  const { request_id, sinister_id, user_id } = req.query;
  const where = {};
  if (request_id) where.request_id = request_id;
  if (sinister_id) where.sinister_id = sinister_id;
  if (user_id) where.user_id = user_id;
  const histories = await History.findAll({ where });
  res.status(200).json({ histories });
};

const getHistory = async (req, res) => {
  const history = await History.findByPk(req.params.id);
  if (!history) return res.status(404).json({ message: "History not found" });
  res.status(200).json({ history });
};

const createHistory = async (req, res) => {
  const history = await History.create(req.body);
  res.status(201).json({ history });
};

const getHistoryByRequest = async (req, res) => {
  const histories = await History.findAll({
    where: { request_id: req.params.id },
  });
  res.status(200).json({ histories });
};

const getHistoryBySinister = async (req, res) => {
  const histories = await History.findAll({
    where: { sinister_id: req.params.id },
  });
  res.status(200).json({ histories });
};

const getHistoryByUser = async (req, res) => {
  const histories = await History.findAll({
    where: { user_id: req.params.id },
  });
  res.status(200).json({ histories });
};

module.exports = {
  getAllHistories,
  getHistory,
  createHistory,
  getHistoryByRequest,
  getHistoryBySinister,
  getHistoryByUser,
};
