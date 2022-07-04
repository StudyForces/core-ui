import Hero from "~/components/landing/home/hero";
import EnormousCatalog from "~/components/landing/home/enormous-catalog";
import LandingLayout from "~/components/landing/landing-layout";
import Qna from "~/components/landing/home/qna";
import type {LoaderFunction} from "@remix-run/cloudflare";
import authenticator from "~/services/auth.server";
import {json} from "@remix-run/cloudflare";
import {useLoaderData} from "@remix-run/react";

export default function Index() {
    const {user} = useLoaderData();

    return <LandingLayout user={user}>
        <Hero></Hero>
        <EnormousCatalog></EnormousCatalog>
        <Qna></Qna>
    </LandingLayout>;
}

export let loader: LoaderFunction = async ({ request }) => {
    let user = await authenticator.isAuthenticated(request);
    return json({ user });
};
