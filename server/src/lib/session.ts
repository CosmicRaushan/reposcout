import { auth } from "./auth";

export type Session = typeof auth.$Infer.Session;
export type User = Session["user"];

declare global {
    namespace Express {
        interface Request {
            user?: User;
            session?: Session;
        }
    }
}