import patientData from "../data/patients";
import {
  EntryWithoutId,
  NewPatient,
  NonSensitivePatient,
  Patient,
} from "../types";
import { v1 as uuid } from "uuid";

const getEntries = () => {
  console.log("getEntreis");

  return patientData;
};

const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patientData.map(
    ({ id, name, dateOfBirth, gender, occupation, entries }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
      entries,
    })
  );
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = { ...patient, id: uuid(), entries: [] };
  patientData.push(newPatient);
  return newPatient;
};

const getPatient = (id: string): Patient => {
  const patient = patientData.find((x) => x.id === id);
  if (!patient) {
    throw new Error("id not found");
  }
  return patient;
};

const addEntry = (id: string, entry: EntryWithoutId) => {
  const patient = patientData.find((x) => x.id === id);
  if (!patient) {
    throw new Error("patient not found");
  }
  const entryWithId = { ...entry, id: uuid() };
  patient.entries.push(entryWithId);
  return patient;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addPatient,
  getPatient,
  addEntry,
};
