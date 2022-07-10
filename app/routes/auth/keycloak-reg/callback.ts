import type {LoaderFunction} from "@remix-run/cloudflare";
import authenticator from "~/services/auth.server";

export let loader: LoaderFunction = ({ request }) => {
    return authenticator.authenticate("sf-keycloak-reg", request, {
        successRedirect: "/problems",
        failureRedirect: "/",
    });
};
