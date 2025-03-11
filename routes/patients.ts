import express from "express";
import { Response } from "express";
import service from "../services/patientService";
import { NonSensitivePatient } from "../types";

const router = express.Router();

router.get("/", (_req, res: Response<NonSensitivePatient[]>) => {
  res.send(service.getNonSensitiveEntries());
});

export default router;
