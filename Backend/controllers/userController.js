
import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
    try {
        console.log("enter in getAlluser")
      const users = await User.find().select("-password"); // DB se sab users laao
      res.status(200).json(users); // frontend ko bhej do
    } catch (error) {
        console.log("error in getalluser route", error)
      res.status(500).json({ error: "Failed to fetch users" });
    }
  };