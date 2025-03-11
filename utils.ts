import { NewPatient, Gender } from "./types";

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

const isGender = (str: string): str is Gender => {
  return Object.values(Gender)
    .map((x) => x.toString())
    .includes(str);
};

const parseGender = (str: unknown): Gender => {
  if (!isString(str) || !isGender(str)) {
    throw new Error(`Incorrect or missing ${str}`);
  }
  return str;
};

const isNewPatient = (obj: unknown): obj is NewPatient => {
  if (
    !obj ||
    typeof obj !== "object" ||
    !("name" in obj) ||
    !("dateOfBirth" in obj) ||
    !("ssn" in obj) ||
    !("gender" in obj) ||
    !("occupation" in obj)
  ) {
    throw new Error("Incorrect or missing data");
  }
  return true;
};

export const toNewPatient = (obj: unknown): NewPatient => {
  if (!isNewPatient(obj)) {
    throw new Error("Incorrect data: some fields are missing");
  }
  return {
    name: parseName(obj.name),
    dateOfBirth: parseDateOfBirth(obj.dateOfBirth),
    ssn: parseGenericString(obj.ssn, "ssn"),
    gender: parseGender(obj.gender),
    occupation: parseGenericString(obj.occupation, "occupation"),
  };
};
