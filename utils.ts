import { Gender, HealthCheckRating } from "./types";
import { z } from "zod";

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
});

const BaseEntrySchema = z.object({
  description: z.string(),
  date: z.string().date(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
});

const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.nativeEnum(HealthCheckRating),
});

const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal("Hospital"),
  specialist: z.string(),
  discharge: z.object({
    date: z.string().date(),
    criteria: z.string(),
  }),
});

const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal("OccupationalHealthcare"),
  specialist: z.string(),
  employerName: z.string(),
  sickLeave: z
    .object({
      startDate: z.string().date(),
      endDate: z.string().date(),
    })
    .optional(),
});

// const EntryTypeSchema = z.union([
//   HealthCheckEntrySchema,
//   HospitalEntrySchema,
//   OccupationalHealthcareEntrySchema,
// ]);
// .superRefine((data, ctx) => {
//   if (data && isNaN(Date.parse(data.date))) {
//     ctx.addIssue({
//       code: "invalid_date",
//       message: `wrong value ${data.date}`,
//     });
//   }
// });

export const parseEntry = (entry: unknown) => {
  if (!entry || !(typeof entry === "object") || !("type" in entry)) {
    throw new Error("Invalid type of entry");
  }

  switch (entry.type) {
    case "HealthCheck": {
      return HealthCheckEntrySchema.parse(entry);
    }
    case "Hospital": {
      return HospitalEntrySchema.parse(entry);
    }
    case "OccupationalHealthcare": {
      return OccupationalHealthcareEntrySchema.parse(entry);
    }
    default:
      throw new Error(`Unexpected type: ${entry.type}`);
  }
  // const parsedEntry: EntryWithoutId = EntryTypeSchema.parse(entry);
  // if (!parsedEntry.success) {
  //   console.log(parsedEntry);
  //   throw new Error("Invalid entry");
  // }
};
