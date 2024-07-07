import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel";
import { Request } from "express";
import { Group } from "../models/groupModel";

const resolvers = {
  Query: {
    account: async (parent: any, args: any, context: { req: Request }) => {
      if (!context.req.user) {
        throw new Error("User not authenticated");
      }
      return User.findById(context.req.user.id).select("-password");
    },
    getGroupMembers: async (_: any, { groupName }: any) => {
      try {
        const group = await Group.findOne({ name: groupName }).populate(
          "users",
          "id username profilePic online"
        );
        if (!group) {
          throw new Error(`Group with name ${groupName} not found`);
        }
        return group.users;
      } catch (err) {
        console.error(`Error fetching members of group ${groupName}:`, err);
        throw new Error(`Failed to fetch members of group ${groupName}`);
      }
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

        user = new User({
          email,
          username,
          password: hashedPassword,
          joinedGroups: ["Global Group"],
        });
        await user.save();

        await Group.findOneAndUpdate(
          { name: "Global Group" },
          { $addToSet: { users: user._id } },
          { new: true, upsert: true }
        );

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
    joinGroup: async (
      _: any,
      { groupName }: any,
      context: { req: Request }
    ) => {
      try {
        const userId = context.req.user.id;
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $addToSet: { joinedGroups: groupName } },
          { new: true }
        );

        await Group.findOneAndUpdate(
          { name: groupName },
          { $addToSet: { users: userId } }
        );

        return updatedUser;
      } catch (err) {
        console.error("Error joining group:", err);
        throw new Error("Error joining group");
      }
    },
    createGroup: async (
      _: any,
      { groupName }: any,
      context: { req: Request }
    ) => {
      try {
        const userId = context.req.user.id;
        const newGroup = new Group({ name: groupName, users: [userId] });
        const savedGroup = await newGroup.save();
        await User.findByIdAndUpdate(userId, {
          $addToSet: { joinedGroups: groupName },
        });
        return savedGroup;
      } catch (err) {
        console.error(err);
        throw new Error("Error creating group");
      }
    },
    quitGroup: async (
      _: any,
      { groupName }: any,
      context: { req: Request }
    ) => {
      try {
        const userId = context.req.user.id;
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $pull: { joinedGroups: groupName } },
          { new: true }
        ).select("-password");

        if (!updatedUser) {
          throw new Error("User not found or unable to update");
        }

        const updatedGroup = await Group.findOneAndUpdate(
          { name: groupName },
          { $pull: { users: userId } },
          { new: true }
        );

        if (!updatedGroup) {
          throw new Error("Group not found or unable to update");
        }

        return updatedUser;
      } catch (err) {
        console.error("Error quitting group:", err);
        throw new Error("Failed to quit group");
      }
    },
    updateProfilePicture: async (_, { profilePic }, context) => {
      try {
        const userId = context.req.user.id;
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { profilePic },
          { new: true }
        );

        if (!updatedUser) {
          throw new Error("User not found or unable to update");
        }

        return updatedUser;
      } catch (err) {
        console.error("Error updating profile picture:", err);
        throw new Error("Failed to update profile picture");
      }
    },
  },
};

export default resolvers;
