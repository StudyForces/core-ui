import { ReactNode } from 'react';
import Navbar from '../layout/navbar';
import Footer from '../layout/footer';
import CallAction from "~/components/landing/call-action";
import {Box} from "@chakra-ui/react";

export default function LandingLayout({children}: {children: ReactNode}) {
    return  <>
        <Navbar></Navbar>
        {
            children
        }
        <Box pt={20}>
            <CallAction></CallAction>
        </Box>
        <Footer></Footer>
    </>;
}
