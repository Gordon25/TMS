import { connection } from "../utils/dbconnection.js";
export default async (req, res, next) => {
  const field = "plan name";
  const planNameRegex = new RegExp("^(?=.*[a-zA-Z])[a-zA-Z0-9]+$");
  const { planName } = req.body;
  const isValidPlanName = planNameRegex.test(planName);
  if (!isValidPlanName) {
    res.status(200).json({
      success: false,
      field,
      message: "Plan name must be alphanumeric.",
    });
  } else {
    try {
      const [matchedPlanNames, fields] = await connection.query(
        "select plan_mvp_name from plans where plan_mvp_name=?;",
        planName
      );
      console.log(matchedPlanNames);
      if (matchedPlanNames.length != 0) {
        res.status(200).json({
          success: false,
          field,
          message: "Duplicate plan names not allowed.",
        });
      } else {
        next();
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        field,
        message: "Internal Server Errror.",
      });
    }
  }
};
