import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../types/DecodedToken";

export const decodeToken = (token: string): DecodedToken => {
  return jwtDecode<DecodedToken>(token);
};

export const isTokenExpired = (token: string): boolean => {
  const { exp } = decodeToken(token);
  return Date.now() >= exp * 1000;
};
