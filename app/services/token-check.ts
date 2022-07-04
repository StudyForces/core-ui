import authenticator from "~/services/auth.server";
import jwt_decode from "jwt-decode";

export default async function tokenCheck(request: Request) {
    let user = await authenticator.isAuthenticated(request);
    if (user?._token.accessToken !== undefined) {
        if ((jwt_decode(user?._token.accessToken as string) as {exp: number}).exp - Date.now() / 1000 < 3600) {
            await authenticator.logout(request, {redirectTo: '/login'});
            return null;
        }
    }
    return user;
}
