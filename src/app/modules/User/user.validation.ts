import z from "zod";

const adminValidation = z.object({
  body: z.object({
    password: z.string(),
    admin: z.object({
      firstName: z
        .string()
        .min(2, { message: "First Name must be 2 characters" })
        .max(20, { message: "First Name must be at most 20 characters" }),
      middleName: z.string().optional(),
      lastName: z
        .string()
        .min(2, { message: "Last Name must be 2 characters" })
        .max(20, { message: "First Name must be at most 20 characters" }),
      email: z.email(),
      contactNumber: z.string({}),
      gender: z.enum(["MALE", "FEMALE"]),
    }),
  }),
});

const customerValidation = z.object({
  body: z.object({
    password: z.string(),
    customer: z.object({
      firstName: z
        .string()
        .min(2, { message: "First Name must be 2 characters" })
        .max(20, { message: "First Name must be at most 20 characters" }),
      middleName: z.string().optional(),
      lastName: z
        .string()
        .min(2, { message: "Last Name must be 2 characters" })
        .max(20, { message: "First Name must be at most 20 characters" }),
      email: z.email(),
      contactNumber: z.string(),
    }),
  }),
});

const myProfileValidation = z.object({
  body: z.object({
    firstName: z
      .string()
      .min(2, { message: "First Name must be 2 characters" })
      .max(20, { message: "First Name must be at most 20 characters" })
      .optional(),
    middleName: z.string().optional(),
    lastName: z
      .string()
      .min(2, { message: "Last Name must be 2 characters" })
      .max(20, { message: "First Name must be at most 20 characters" })
      .optional(),
    contactNumber: z.string({}).optional(),
    gender: z.enum(["MALE", "FEMALE"]).optional(),
  }),
});

export const UserValidations = {
  adminValidation,
  customerValidation,
  myProfileValidation,
};
