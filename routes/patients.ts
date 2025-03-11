import express from "express";
import { Response } from "express";
import service from "../services/patientService";
import { NonSensitivePatient } from "../types";
import utils from "../utils";

const router = express.Router();

router.get("/", (_req, res: Response<NonSensitivePatient[]>) => {
  res.send(service.getNonSensitiveEntries());
});

router.post("/", (req, res) => {
  try {
    const patient = utils.toNewPatient(req.body);
    const newPatient = service.addPatient(patient);
    res.send(newPatient);
  } catch (err) {
    let message = "Error: ";
    if (err instanceof Error) {
      message += err.message;
    }
    res.status(400).json({ error: message });
  }
});
export default router;
