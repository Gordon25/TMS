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
