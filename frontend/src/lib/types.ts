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
  app_acronym: string;
  app_rnumber: Number;
  app_startdate: string;
  app_enddate: string;
  app_permit_create: string;
  app_permit_open: string;
  app_permit_todolist: string;
  app_permit_doing: string;
  app_permit_done: string;
  app_description: string;
}

interface Plan {
  plan_mvp_name: string;
  plan_app_name: string;
  plan_startdate: string;
  plan_enddate: string;
  plan_colour: string;
}
