import { db } from "../utils/db.js";
export default async (req, res) => {
  const { appAcronym } = req.body;
  try {
    const token = req.headers.authorization.split(" ")[1];
    const { username } = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({
      success: true,
      state: "Open",
      creator: username,
      owner: username,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      field,
      message: "Internal Server error.",
    });
  }
};
