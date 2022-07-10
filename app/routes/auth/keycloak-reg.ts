import authenticator from "~/services/auth.server";
import type {ActionFunction, LoaderFunction} from "@remix-run/cloudflare";
import {redirect} from "@remix-run/cloudflare";

export let loader: LoaderFunction = () => redirect("/");

export let action: ActionFunction = ({ request }: any) => {
    return authenticator.authenticate("sf-keycloak-reg", request);
};
