import { betterAuth } from "better-auth";
import prisma from "./db";
import { prismaAdapter } from "better-auth/adapters/prisma";

const clientUrl = process.env.CLIENT_URL as string;

export const auth = betterAuth({
    baseUrl: process.env.BETTER_AUTH_URL as string,
    secret: process.env.BETTER_AUTH_SECRET as string,
    trustedOrigins: [
        clientUrl
    ],
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    }
});

