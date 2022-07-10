import Hero from "~/components/landing/home/hero";
import EnormousCatalog from "~/components/landing/home/enormous-catalog";
import LandingLayout from "~/components/landing/landing-layout";
import Qna from "~/components/landing/home/qna";
import type {LoaderFunction} from "@remix-run/cloudflare";
import {json, MetaFunction} from "@remix-run/cloudflare";
import {useLoaderData} from "@remix-run/react";
import tokenCheck from "~/services/token-check";

export default function Index() {
    const {user} = useLoaderData();

    return <LandingLayout user={user}>
        <Hero user={user}></Hero>
        <EnormousCatalog></EnormousCatalog>
        <Qna></Qna>
    </LandingLayout>;
}

export const meta: MetaFunction = () => {
    return {
        title: 'StudyForces',
        description: 'StudyForces is a platform with a modern problem and solution catalog and a superior Q&A section to ask and help people on topics related to Physics, Maths and other subjects.',
    };
};

export let loader: LoaderFunction = async ({request}) => {
    const user = await tokenCheck(request);
    return json({user});
};
