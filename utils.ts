import { NewPatient } from "./types";

const isString = (obj: unknown): obj is string => {
  return typeof obj === "string";
};

const isDate = (obj: string): boolean => {
  return Boolean(Date.parse(obj));
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error("Incorrect or missing name");
  }
  return name;
};

const parseDateOfBirth = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date");
  }
  return date;
};

const parseGenericString = (str: unknown, field: string): string => {
  if (!str || !isString(str)) {
    throw new Error(`Incorrect or missing ${field}`);
  }
  return str;
};

const toNewPatient = (obj: unknown): NewPatient => {
  if (!obj || typeof obj !== "object") {
    throw new Error("Incorrect or missing data");
  }
  if (
    "name" in obj &&
    "dateOfBirth" in obj &&
    "ssn" in obj &&
    "gender" in obj &&
    "occupation" in obj
  ) {
    const newPatient = {
      name: parseName(obj.name),
      dateOfBirth: parseDateOfBirth(obj.dateOfBirth),
      ssn: parseGenericString(obj.ssn, "ssn"),
      gender: parseGenericString(obj.gender, "gender"),
      occupation: parseGenericString(obj.occupation, "occupation"),
    };
    return newPatient;
  }
  throw new Error("Incorrect data: some fields are missing");
};

export default { toNewPatient };
