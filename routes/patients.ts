import express, { NextFunction } from "express";
import { Request, Response } from "express";
import service from "../services/patientService";
import {
  EntryWithoutId,
  NewPatient,
  NonSensitivePatient,
  Patient,
} from "../types";
import { NewPatientSchema, parseEntry } from "../utils";
import { z } from "zod";
import patientService from "../services/patientService";

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

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    parseEntry(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

router.get("/", (_req: Request, res: Response<NonSensitivePatient[]>) => {
  res.send(service.getNonSensitiveEntries());
});

router.post(
  "/",
  newPatientParser,
  (
    req: Request<unknown, unknown, NewPatient>,
    res: Response<NewPatient | { error: string }>
  ) => {
    try {
      const patient = req.body;
      const newPatient = service.addPatient(patient);
      res.send(newPatient);
    } catch (err) {
      let message = "Error: ";
      if (err instanceof Error) {
        message += err.message;
      }
      res.status(400).json({ error: message });
    }
  }
);

router.get("/:id", (req, res) => {
  const id = req.params.id;
  try {
    res.send(service.getPatient(id));
  } catch (error) {
    let message = "Error: ";
    if (error instanceof Error) {
      message += error.message;
    }
    res.status(400).json({ error: message });
  }
});

router.post(
  "/:id/entries",
  newEntryParser,
  (
    req: Request<{ id: string }, unknown, EntryWithoutId>,
    res: Response<Patient | { error: string }>
  ) => {
    const entryId = req.params.id;
    try {
      const updatedPatient = patientService.addEntry(entryId, req.body);
      res.json(updatedPatient);
    } catch (error) {
      let message = "Error: ";
      if (error instanceof Error) {
        message += error.message;
      }
      res.status(400).json({ error: message });
    }
  }
);

router.use(errorMiddleware);

export default router;
