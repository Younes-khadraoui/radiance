import { JwtPayload } from "../src/middlewares/authenticateToken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload["user"];
    }
  }
}
