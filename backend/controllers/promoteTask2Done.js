import bcryptjs from "bcryptjs";
import { db } from "../utils/db.js";
import transporter from "../utils/transporter.js";
import timeStampNotes from "../utils/timeStampNotes.js";
import checkgroup from "../utils/checkgroup.js";
const promoteTask2DoneMicroservice = async (req, res) => {
  const url = req.originalUrl;
  const matchAdditionalInfoRegex = new RegExp(
    "(?<=\\/[Pp][Rr][Oo][Mm][Oo][Tt][Ee][Tt][Aa][Ss][Kk]2[Dd][Oo][Nn][Ee]).*[\\&\\?\\-\\'\\~\\%]+"
  );
  const isContainsAdditionalInfo = matchAdditionalInfoRegex.test(url);
  if (isContainsAdditionalInfo) {
    return res.json({
      code: "A001",
    });
  }
  if (
    req.headers["content-type"] !== "application/json" ||
    typeof req.body !== "object" ||
    Array.isArray(req.body)
  ) {
    return res.json({
      code: "B001",
    });
  }
  const mandatoryFields = ["username", "password", "task_id"];
  const isMandatoryFieldsMissing =
    mandatoryFields.filter((field) => !(field in req.body)).length > 0;
  if (isMandatoryFieldsMissing) {
    return res.json({
      code: "B002",
    });
  }
  if (typeof req.body.username !== "string") {
    return res.json({
      code: "C001",
    });
  }
  const loginUsername = req.body.username;
  const loginPassword = req.body.password;
  try {
    const [users, fields] = await db.execute(`select * from accounts where username=?;`, [
      loginUsername,
    ]);
    if (users.length === 0) {
      return res.json({
        code: "C001",
      });
    }
    // username matches a user
    const [user] = users;
    if (typeof loginPassword !== "string") {
      return res.json({
        code: "C001",
      });
    }
    const isPasswordMatch = await bcryptjs.compare(loginPassword, user.password);
    if (!isPasswordMatch || !user.isActive) {
      return res.json({
        code: "C001",
      });
    }
    if (typeof req.body.task_id !== "string") {
      return res.json({
        code: "D001",
      });
    }
    const taskId = req.body.task_id;
    const tasks = await db
      .execute(`select * from tasks where task_id=?;`, [taskId])
      .then(([tasks, fields]) => tasks);
    if (tasks.length === 0) {
      return res.json({
        code: "D001",
      });
    }
    const [task] = tasks;

    const permittedGroup = await db
      .execute(`select app_permit_doing from applications where app_acronym=?;`, [
        task.task_app_acronym,
      ])
      .then(([permittedGroup, fields]) => permittedGroup[0].app_permit_doing);
    let isPermitDoing = false;
    await checkgroup(loginUsername, permittedGroup).then((res) => {
      if (!res.message) {
        isPermitDoing = res.isUserInGroup;
      } else {
        console.log(res.message);
      }
    });
    if (!isPermitDoing) {
      return res.json({
        code: "C003",
      });
    }
    const taskState = task.task_state;
    if (taskState !== "Doing") {
      return res.json({
        code: "D001",
      });
    }
    const newState = "Done";
    const taskNotes = req.body.task_notes || "";
    if (typeof taskNotes !== "string") {
      return res.json({
        code: "D001",
      });
    }
    const promoteNote = `Task state changed from ${taskState} to ${newState}.`;
    const stampedNotes = timeStampNotes(loginUsername, taskState, taskNotes);
    const stampedPromoteNote = timeStampNotes(loginUsername, taskState, promoteNote);

    await db.execute(
      "UPDATE tasks set task_state=?, task_owner=?, task_notes= CONCAT(?,task_notes) where task_id = ?;",
      [newState, loginUsername, stampedPromoteNote + stampedNotes, taskId]
    );
    const emails = await db
      .execute(
        `select email from accounts where username in 
	    (select username from user_groups where groupname = 
		    (select app_permit_done from applications where app_acronym = 
			    (select task_app_acronym from tasks where task_id = ?)));`,
        [taskId]
      )
      .then(([emails, fields]) => emails)
      .then((emails) => emails.map((email) => email.email))
      .then((emails) => emails.filter((email) => email != null));
    transporter.sendMail({
      from: `"Maddison Foo Koch " ${process.env.SMTP_FROM_EMAIL}`,
      to: emails.join(", "),
      subject: `Task ID ${taskId} pending task review.`,
      text: `This task is pending approval.`,
    });
    return res.json({
      code: "S000",
    });
  } catch (error) {
    await db.rollback();
    console.log(error);
    return res.json({
      code: "E004",
    });
  }
};

export { promoteTask2DoneMicroservice };
/**
 *  *  * promote task 2 done:
 *  - validate url done
 *  - validate body structure done
 *  - validate username done
 *  - validate password done
 *  - validate user group done
 *  - validate taskid done
 *  - validate task notes ?
 *  - validate task state done
 *  - promote task done
 *  - send email done
 *  - send {code} done
 */
