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
    next();
  }
};
