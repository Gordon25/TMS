import { db } from "../utils/db.js";
const createPlan = async (req, res) => {
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

const getPlans = async (req, res) => {
  const { appAcronym } = req.body;
  try {
    const data = await db
      .execute(
        "select * from plans where plan_app_acronym=? order by plan_startdate, plan_enddate asc;",
        [appAcronym]
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

export { getPlans, createPlan };
