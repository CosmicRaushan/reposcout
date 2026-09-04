import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import type { Session } from "../lib/session";

declare module "express-serve-static-core" {
    interface Request {
        session?: Session
        user?: Session["user"]
    }
}

export async function requireAuth (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void>{
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
    });
    
    if(!session?.user){
        res.status(401).json({error: "Unauthorize"});
        return;
    };

    req.session = session;
    req.user = session.user;
    next();
}