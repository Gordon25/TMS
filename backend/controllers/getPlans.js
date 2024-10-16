import { connection } from "../utils/dbconnection.js";
export default async (req, res) => {
  const { appAcronym } = req.body;
  try {
    const data = await connection
      .query(
        "select * from plans where plan_app_acronym=? order by plan_startdate, plan_enddate asc;",
        appAcronym
      )
      .then(([plans, fields]) => plans);
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
