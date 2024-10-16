import { db } from "../utils/db.js";
export default async (req, res) => {
  const { appAcronym } = req.body;
  try {
    const data = await db
      .execute("select * from applications where app_acronym=?;", appAcronym)
      .then(([apps, fields]) => apps);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
