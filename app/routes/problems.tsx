import ContentLayout from "~/components/content/content-layout";
import {Outlet, useLoaderData} from "@remix-run/react";
import type {LoaderFunction} from "@remix-run/cloudflare";
import authenticator from "~/services/auth.server";
import {json} from "@remix-run/cloudflare";

export default function Index() {
    const {user} = useLoaderData();

    return <ContentLayout user={user}>
        <Outlet></Outlet>
    </ContentLayout>;
}

export let loader: LoaderFunction = async ({ request }) => {
    let user = await authenticator.isAuthenticated(request);
    return json({ user });
};

