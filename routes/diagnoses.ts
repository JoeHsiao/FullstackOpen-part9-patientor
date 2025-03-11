import express from "express";
import { Response } from "express";
import service from "../services/diagnosisService";
import { Diagnosis } from "../types";

const router = express.Router();

router.get("/", (_req, res: Response<Diagnosis[]>) => {
  res.send(service.getEntries());
});

export default router;
