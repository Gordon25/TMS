import { connection } from "../utils/dbconnection.js";
export default async (req, res) => {
  try {
    const data = await connection
      .query("select * from applications order by app_startdate, app_enddate;")
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
