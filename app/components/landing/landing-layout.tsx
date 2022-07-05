import { ReactNode } from 'react';
import Navbar from '../layout/navbar';
import Footer from '../layout/footer';
import CallAction from "~/components/landing/call-action";
import {Box} from "@chakra-ui/react";
import type User from "~/services/user";

export default function LandingLayout({children, user}: {children: ReactNode, user?: User}) {
    return  <>
        <Box w={'100%'} position={'sticky'} top={0}>
            <Navbar user={user}></Navbar>
        </Box>
        {
            children
        }
        <Box pt={20}>
            <CallAction user={user}></CallAction>
        </Box>
        <Footer></Footer>
    </>;
}
