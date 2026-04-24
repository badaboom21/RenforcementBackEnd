const express = require("express");
const router = express.Router();

const {
  getAllSinisters,
  getSinister,
  createSinister,
  updateSinister,
  deleteSinister,
  validateSinister,
  updateDocuments,
  createSinisterDocument,
  getSinisterDocuments,
  getRequest,
  getHistory,
  createRequest,
} = require("../services/sinisters");

router.get("/", getAllSinisters);
router.post("/", createSinister);
router.get("/:id", getSinister);
router.put("/:id", updateSinister);
router.delete("/:id", deleteSinister);
router.patch("/:id/validate", validateSinister);
router.get("/:id/documents", getSinisterDocuments);
router.post("/:id/documents", createSinisterDocument);
router.patch("/:id/documents", updateDocuments);
router.get("/:id/request", getRequest);
router.get("/:id/history", getHistory);
router.post("/:id/create-request", createRequest);

module.exports = router;
