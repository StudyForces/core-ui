import authenticator from "~/services/auth.server";
import type {ActionFunction, LoaderFunction} from "@remix-run/cloudflare";

export let loader: LoaderFunction = ({request}: any) => {
    return authenticator.authenticate("sf-keycloak", request);
}

export let action: ActionFunction = ({ request }: any) => {
    return authenticator.authenticate("sf-keycloak", request);
};
