import LandingLayout from "~/components/landing/landing-layout";
import {Container} from "@chakra-ui/react";
import {Outlet, useLoaderData} from "@remix-run/react";
import {json, LoaderFunction} from "@remix-run/cloudflare";
import authenticator from "~/services/auth.server";

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
    let user = await authenticator.isAuthenticated(request);
    return json({ user });
};

