import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel";
import { Request } from "express";

const resolvers = {
  Query: {
    account: async (parent: any, args: any, context: { req: Request }) => {
      if (!context.req.user) {
        throw new Error("User not authenticated");
      }
      return User.findById(context.req.user.id).select("-password");
    },
  },
  Mutation: {
    register: async (_: any, { input: { email, username, password } }: any) => {
      try {
        let user = await User.findOne({ email });
        if (user) {
          throw new Error("User already exists");
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ email, username, password: hashedPassword });
        await user.save();

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
          expiresIn: "10h",
        });

        return { ...user.toObject(), token };
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    login: async (_: any, { input: { email, password } }: any) => {
      try {
        let user = await User.findOne({ email });
        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Invalid credentials");
        }

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
          expiresIn: "1h",
        });

        return { ...user.toObject(), token };
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  },
};

export default resolvers;
