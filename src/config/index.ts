import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  jwt: {
    access_Token: process.env.ACCESS_TOKEN,
    access_Token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN,
    refresh_Token: process.env.REFRESH_TOKEN,
    refresh_Token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,

  },
};
