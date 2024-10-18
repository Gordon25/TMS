import { db } from "../utils/db.js";
export default async (req, res, next) => {
  const field = "plan name";
  const planNameRegex = new RegExp("^(?=.*[a-zA-Z])[a-zA-Z0-9]+$");
  const { planName, appAcronym } = req.body;
  const isValidPlanName = planNameRegex.test(planName);
  if (!isValidPlanName) {
    res.status(200).json({
      success: false,
      field,
      message: "Plan name must be alphanumeric.",
      ...req.body,
    });
  } else {
    try {
      const [matchedPlanNames, fields] = await db.execute(
        "select plan_mvp_name from plans where plan_mvp_name=? and plan_app_acronym=?;",
        [planName, appAcronym]
      );

      if (matchedPlanNames.length != 0) {
        res.status(200).json({
          success: false,
          field,
          message: "Duplicate plan names not allowed.",
          ...req.body,
        });
      } else {
        next();
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        field,
        message: "Internal Server Errror.",
      });
    }
  }
};
