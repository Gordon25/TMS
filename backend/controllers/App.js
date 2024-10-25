import { db } from "../utils/db.js";

const createApp = async (req, res) => {
  const field = "app";
  try {
    const {
      appAcronym,
      rNumber,
      startDate,
      endDate,
      description,
      create,
      open,
      todo,
      doing,
      done,
    } = req.body;
    await db.execute(
      `INSERT INTO applications 
      (app_acronym, app_rnumber, app_description, app_startdate, app_enddate, app_permit_create, app_permit_open, app_permit_todolist, app_permit_doing, app_permit_done)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [appAcronym, rNumber, description, startDate, endDate, create, open, todo, doing, done]
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

const updateApp = async (req, res) => {
  const field = "app";
  try {
    const { appAcronym, startDate, endDate, description, create, open, todo, doing, done } =
      req.body;
    await db.execute(
      `UPDATE applications 
      SET app_description=?, app_startdate=?, app_enddate=?, app_permit_create=?, app_permit_open=?, app_permit_todolist=?, app_permit_doing=?, app_permit_done=?
      where app_acronym=?;`,
      [description, startDate, endDate, create, open, todo, doing, done, appAcronym]
    );
    res.status(200).json({
      success: true,
      field,
      message: `App ${appAcronym} has been updated.`,
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

const getApps = async (req, res) => {
  try {
    const data = await db
      .execute("select * from applications order by app_startdate, app_enddate;")
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

export { createApp, updateApp, getApps };
