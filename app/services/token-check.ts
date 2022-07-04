import authenticator from "~/services/auth.server";

export default async function tokenCheck(request: Request) {
    let user = await authenticator.isAuthenticated(request);
    if (user !== null) {
        if (user.expiration - Date.now() / 1000 < 3600) {
            await authenticator.logout(request, {redirectTo: '/login'});
            return null;
        }
    }
    return user;
}
