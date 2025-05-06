import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../types/DecodedToken";

export const parseJwt = (token: string): DecodedToken => {
  const decoded = jwtDecode<DecodedToken>(token);

  return {
    id: decoded[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ],
    name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
    email:
      decoded[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      ],
    role: decoded[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ],
    exp: decoded.exp,
  };
};
