import authenticator from "~/services/auth.server";
import type {LoaderFunction} from "@remix-run/cloudflare";

export let loader: LoaderFunction = async ({ request }) => {
    const user = await authenticator.isAuthenticated(request);
    if (user !== undefined && user !== null) {
        await fetch(`https://keycloak.pkasila.net/auth/realms/StudyForces/protocol/openid-connect/logout`, {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${user._token?.accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `client_id=core&refresh_token=${user._token?.refreshToken}`
        });
    }
    await authenticator.logout(request, { redirectTo: "/" });
};
