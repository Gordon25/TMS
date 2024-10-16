import { db } from "../utils/db.js";
export default async (req, res) => {
  const field = "plan";
  try {
    const { planName, appAcronym, startDate, endDate, planColour } = req.body;
    await db.execute(
      `INSERT INTO plans 
      (plan_mvp_name, plan_app_acronym, plan_startdate, plan_enddate, plan_colour)
      VALUES (?, ?, ?, ?, ?);`,
      [planName, appAcronym, startDate, endDate, planColour]
    );
    res.status(200).json({
      success: true,
      field,
      message: `Plan ${planName} has been created.`,
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
