// @ts-nocheck
export function parseCookieString(
  cookies: string,
  cookiename: string
): string | false {
  const cookieArray = cookies.split(";");
  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i];
    if (!cookie || cookie === "" || Object.is(cookie, NaN)) {
      return false;
    }
    const cookieName = cookie.split("=")[0].trim();
    const cookieValue = cookie.split("=")[1];
    if (cookieName === cookiename) {
      return cookieValue;
    }
  }
  return false;
}
