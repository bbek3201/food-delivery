import { verifyToken } from "./auth";

export const getUser = (req: Request) => {
  const auth = req.headers.get("authorization");
  if (!auth) return null;
  const token = auth.replace("Bearer ", "");
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
};
