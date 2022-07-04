import ContentLayout from "~/components/content/content-layout";
import {Outlet, useLoaderData} from "@remix-run/react";
import type {LoaderFunction} from "@remix-run/cloudflare";
import {json} from "@remix-run/cloudflare";
import tokenCheck from "~/services/token-check";

export default function Index() {
    const {user} = useLoaderData();

    return <ContentLayout user={user}>
        <Outlet></Outlet>
    </ContentLayout>;
}

export let loader: LoaderFunction = async ({ request }) => {
    const user = await tokenCheck(request);
    return json({ user });
};

