import authenticator from "~/services/auth.server";
import {commitSession, getSession} from "~/services/session.server";
import {redirect} from "@remix-run/cloudflare";

export default async function tokenCheck(request: Request) {
    let user = await authenticator.isAuthenticated(request);
    if (user !== null) {
        if (user.expiration - Date.now() / 1000 < 3600) {
            const session = await getSession(request.headers.get("Cookie"));

            session.unset('user');
            const url = new URL(request.url);
            session.set('back_auth_url', url.pathname+url.search);

            throw redirect('/auth/keycloak', {
                headers: {
                    'Set-Cookie': await commitSession(session),
                }
            });
        }
    }
    return user;
}
