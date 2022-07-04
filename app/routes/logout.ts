import authenticator from "~/services/auth.server";
import type {LoaderFunction} from "@remix-run/cloudflare";

export let loader: LoaderFunction = async ({ request }) => {
    await authenticator.logout(request, { redirectTo: "/" });
};
