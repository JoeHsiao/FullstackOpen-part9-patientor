import express, { NextFunction } from "express";
import { Request, Response } from "express";
import service from "../services/patientService";
import { NonSensitivePatient } from "../types";
import { NewPatientSchema } from "../utils";
import { z } from "zod";

const router = express.Router();

const errorMiddleware = (
  error: unknown,
  _request: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

router.get("/", (_req: Request, res: Response<NonSensitivePatient[]>) => {
  res.send(service.getNonSensitiveEntries());
});

router.post("/", newPatientParser, (req, res) => {
  try {
    const patient = NewPatientSchema.parse(req.body);
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

router.use(errorMiddleware);

export default router;
