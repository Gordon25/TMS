interface InputField {
  name: string;
  type: string;
  value?: string;
}
interface User {
  username: string;
  password: string;
  email: string;
  groups: string[];
  isActive: boolean;
}
interface Status {
  success: boolean;
  failure: boolean;
}
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
