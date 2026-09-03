import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import type { session } from "../lib/session";

declare module "express-serve-static-core" {
    interface Request {
        session: session
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
        res.status(404).json({error: "Unauthorize"});
        return;
    };

    req.session = session;
    next();
}