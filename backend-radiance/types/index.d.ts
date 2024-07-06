import { JwtPayload } from "../src/middlewares/authenticateToken";
import { Request } from "express";

export interface JwtPayload {
  user: {
    id: string;
  };
}
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload["user"];
    }
  }
}
