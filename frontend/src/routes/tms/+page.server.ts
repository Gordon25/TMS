import axiosInstance from "../../lib/axiosConfig";
import type { PageServerLoad } from "./$types";
interface App {
  acronym: String;
  rNumber: String;
  StartDate: String;
  EndDate: String;
  TaskCreate: String;
  TaskOpen: String;
  TaskToDo: string;
  TaskDoing: string;
  TaskDone: string;
  Description: string;
}
const load: PageServerLoad = () => {
  const appData: App[] = [
    {
      acronym: "App1",
      rNumber: "0",
      StartDate: "",
      EndDate: "",
      TaskCreate: "PL",
      TaskOpen: "User",
      TaskToDo: "",
      TaskDoing: "",
      TaskDone: "",
      Description: "This is the first app",
    },
    {
      acronym: "App2",
      rNumber: "0",
      StartDate: "",
      EndDate: "",
      TaskCreate: "PL",
      TaskOpen: "",
      TaskToDo: "",
      TaskDoing: "user",
      TaskDone: "",
      Description: "",
    },
  ];

  return { appData };
};
