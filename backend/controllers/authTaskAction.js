import checkgroup from "../utils/checkgroup.js";
import { db } from "../utils/db.js";
export default (action) => {
  return async (req, res, next) => {
    const { appAcronym } = req.body;
    try {
      const permittedGroup = await db
        .execute(`select app_permit_${action} from applications where app_acronym=?;`, appAcronym)
        .then(([apps, fields]) => {
          apps[0];
        });
      const token = req.headers.authorization.split(" ")[1];
      const { username } = jwt.verify(token, process.env.JWT_SECRET);
      const { isUserInGroup, message } = await checkgroup(username, permittedGroup);
      if (message != "") {
        res.status(500).json({
          success: false,
          message,
        });
      } else if (!isUserInGroup) {
        req.status(200).json({
          success: false,
          message: `User not permitted to do action:${action}.`,
        });
      } else {
        next();
      }
    } catch (error) {
      console.log(error);
      res.status(200).json({
        success: false,
        message: "Internal Server Error.",
      });
    }
  };
};
