import { db } from "../utils/db.js";
import checkgroup from "../utils/checkgroup.js";
import jwt from "jsonwebtoken";

export default async (req, res) => {
  const { appAcronym } = req.body;
  let isPermitCreate = false,
    isPermitOpen = false,
    isPermitTodo = false,
    isPermitDoing = false,
    isPermitDone = false;
  try {
    const permittedGroups = await db
      .execute(
        `select app_permit_create, app_permit_open, app_permit_todolist, app_permit_doing, app_permit_done from applications where app_acronym=?;`,
        [appAcronym]
      )
      .then(([groups, field]) => groups[0])
      .then((group) => group);
    const token = req.cookies.token;
    const { username } = jwt.verify(token, process.env.JWT_SECRET);

    await checkgroup(username, permittedGroups.app_permit_create).then((res) => {
      if (!res.message) {
        isPermitCreate = res.isUserInGroup;
      } else {
        console.log(res.message);
      }
    });
    await checkgroup(username, permittedGroups.app_permit_open).then((res) => {
      if (!res.message) {
        isPermitOpen = res.isUserInGroup;
      } else {
        console.log(res.message);
      }
    });
    await checkgroup(username, permittedGroups.app_permit_todolist).then((res) => {
      if (!res.message) {
        isPermitTodo = res.isUserInGroup;
      } else {
        console.log(res.message);
      }
    });
    await checkgroup(username, permittedGroups.app_permit_doing).then((res) => {
      if (!res.message) {
        isPermitDoing = res.isUserInGroup;
      } else {
        console.log(res.message);
      }
    });
    await checkgroup(username, permittedGroups.app_permit_done).then((res) => {
      if (!res.message) {
        isPermitDone = res.isUserInGroup;
      } else {
        console.log(res.message);
      }
    });
    res.status(200).json({
      success: true,
      isPermitCreate,
      isPermitOpen,
      isPermitTodo,
      isPermitDoing,
      isPermitDone,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      success: false,
      message: "Internal Server error.",
    });
  }
};
