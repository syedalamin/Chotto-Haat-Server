
import z from "zod";

const adminValidation = z.object({
  body: z.object({
    password: z.string(),
    admin: z.object({
      name: z.object({
        firstName: z
          .string()
          .min(2, { message: "First Name must be 2 characters" })
          .max(20, { message: "First Name must be at most 20 characters" }),
        middleName: z.string().optional(),
        lastName: z
          .string()
          .min(2, { message: "Last Name must be 2 characters" })
          .max(20, { message: "First Name must be at most 20 characters" }),
      }),
      email: z.email(),
      contactNumber: z.string({}),
      gender: z.enum(["MALE", "FEMALE"]),
    }),
  }),
});

export const UserValidations = {
  adminValidation,
};
