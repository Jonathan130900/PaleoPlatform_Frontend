import { DecodedToken } from "../types/DecodedToken";

export const parseJwt = (token: string): DecodedToken => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const decoded = JSON.parse(jsonPayload);

    // Map to DecodedToken interface
    return {
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier":
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ] || decoded.id,
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name":
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
        decoded.name,
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress":
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ] || decoded.email,
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role":
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] || decoded.role,
      exp: decoded.exp,
    };
  } catch (error) {
    console.error("Error parsing JWT:", error);
    throw new Error("Invalid token format");
  }
};
