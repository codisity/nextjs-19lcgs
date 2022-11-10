import { setCookie } from "cookies-next";
import { sessionCookieName } from "../config";

const secondsIn7days = 60 * 60 * 24 * 7;

export function setSessionCookie({ req, res, sessionToken }) {
  setCookie(sessionCookieName, sessionToken, {
    req,
    res,
    maxAge: secondsIn7days,
  });
}
