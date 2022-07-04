import LandingLayout from "~/components/landing/landing-layout";
import {Container} from "@chakra-ui/react";
import {Outlet, useLoaderData} from "@remix-run/react";
import {json, LoaderFunction} from "@remix-run/cloudflare";
import tokenCheck from "~/services/token-check";

export default function FeaturesIndex() {
    const {user} = useLoaderData();

    return (
        <LandingLayout user={user}>
            <Container
                display={'flex'}
                maxW={'5xl'}
                justifyContent="center"
                alignItems="center"
            >
                <Outlet></Outlet>
            </Container>
        </LandingLayout>
    );
};

export let loader: LoaderFunction = async ({ request }) => {
    const user = await tokenCheck(request);
    return json({ user });
};

