import { connection } from "../utils/dbconnection.js";
export default async (req, res, next) => {
  const field = "app acronym";
  const appAcronymRegex = new RegExp("^(?=.*[a-zA-Z])[a-zA-Z0-9]+$");
  const { appAcronym } = req.body;
  const isValidAppAcronym = appAcronymRegex.test(appAcronym);
  if (!isValidAppAcronym) {
    //username not alphanumeric
    res.status(200).json({
      success: false,
      field,
      message: "App Acronym is not alphanumeric.",
    });
  } else {
    try {
      const [matchedAppAcronyms, fields] = await connection.query(
        `select app_acronym from applications where app_acronym=?;`,
        appAcronym
      );

      if (matchedAppAcronyms.length != 0) {
        //duplicate username
        res.status(200).json({
          success: false,
          field,
          message: `${appAcronym} has already been taken, choose another one.`,
        });
      } else {
        //username valid and unqiue
        next();
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        field,
        message: "Internal Server error.",
      });
    }
  }
};
