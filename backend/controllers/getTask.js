import { db } from "../utils/db.js";
export default async (req, res) => {
  const { taskId } = req.body;
  try {
    const data = await db
      .execute(
        `select * from tasks 
        where task_id=?;`,
        [taskId]
      )
      .then(([tasks, fields]) => tasks);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
