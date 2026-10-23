export interface LoginRequest{
    email:string,
    password:string
}

export interface LoginResponse{
    status: string,
    message: string,
    data: Object
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone:string
}

export interface Authcontext{
    message:string,
    data:UserDetailsData
}

export interface UserDetailsData {
  user: User;
  roles: Role[];
  permissions: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface Role {
  id: string;
  name: string;
}