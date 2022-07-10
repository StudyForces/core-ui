import type {LoaderFunction} from "@remix-run/cloudflare";
import authenticator from "~/services/auth.server";
import {getSession} from "~/services/session.server";

export let loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request.headers.get("Cookie"));

    return await authenticator.authenticate("sf-keycloak", request, {
        successRedirect: session.has('back_auth_url') ? session.get('back_auth_url') : "/problems",
        failureRedirect: '',
    });
};
