import { connection } from "../utils/dbconnection.js";
export default async (req, res) => {
  const field = "app";
  try {
    const { appAcronym, startDate, endDate, description, create, open, todo, doing, done } =
      req.body;
    await connection.query(
      `INSERT INTO applications 
      (app_acronym, app_description, app_startdate, app_enddate, app_permit_create, app_permit_open, app_permit_todolist, app_permit_doing, app_permit_done)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [appAcronym, description, startDate, endDate, create, open, todo, doing, done]
    );
    res.status(200).json({
      success: true,
      field,
      message: `App ${appAcronym} has been created.`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      field,
      message: "Internal Server Error.",
    });
  }
};
