import z from "zod";
const name = z.object({
  firstName: z
    .string()
    .min(2, { message: "First Name must be 2 characters" })
    .max(20, { message: "First Name must be at most 20 characters" }),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .min(2, { message: "Last Name must be 2 characters" })
    .max(20, { message: "First Name must be at most 20 characters" }),
});

const adminValidation = z.object({
  body: z.object({
    password: z.string(),
    admin: z.object({
      name: name,
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
      name: name,
      email: z.email(),
      contactNumber: z.string(),
    }),
  }),
});

export const UserValidations = {
  adminValidation,
  customerValidation,
};
