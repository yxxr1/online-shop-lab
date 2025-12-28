import {v4 as uuidv4} from "uuid";
import {cookies} from "next/headers";

const COOKIE_NAME = 'userSession';

// получить или создать сессию пользователя (id пользователя)
export const getSession = async () => {
  const cookieStore = await cookies();
  let userSession = cookieStore.get(COOKIE_NAME)?.value;

  if (!userSession) {
    userSession = uuidv4();
    cookieStore.set(COOKIE_NAME, userSession);
  }

  return userSession;
}

// только получить сессию пользователя (id пользователя)
export const getSessionIfExists = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}
