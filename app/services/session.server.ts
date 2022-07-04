import { createCookieSessionStorage } from "@remix-run/cloudflare";

export let sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "_session",
        sameSite: "lax",
        path: "/",
        httpOnly: false,
        secrets: [process.env.SESSION_SECRET ?? "s3cr3t"],
        secure: process.env.NODE_ENV === "production",
    },
});

export let { getSession, commitSession, destroySession } = sessionStorage;
