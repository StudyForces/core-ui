import Hero from "~/components/landing/home/hero";
import EnormousCatalog from "~/components/landing/home/enormous-catalog";
import LandingLayout from "~/components/landing/landing-layout";
import Qna from "~/components/landing/home/qna";

export default function Index() {
    return <LandingLayout>
        <Hero></Hero>
        <EnormousCatalog></EnormousCatalog>
        <Qna></Qna>
    </LandingLayout>;
}
