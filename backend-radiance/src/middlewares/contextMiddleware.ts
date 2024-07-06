import { Request } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../../types/index";

export const contextMiddleware = ({ req }: { req: Request }) => {
  if (!req) {
    console.error("Request object is not available");
    return {};
  }

  const authorizationHeader = req.headers.authorization || "";

  if (authorizationHeader) {
    const actualToken = authorizationHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(
        actualToken,
        process.env.JWT_SECRET as string
      ) as JwtPayload;
      req.user = decoded.user;
      return { req };
    } catch (error: any) {
      console.error("Invalid token:", error.message);
    }
  } else {
    console.log("No token provided");
  }
  return { req };
};
