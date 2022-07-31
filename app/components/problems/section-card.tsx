import {Box, Heading, Text, useColorModeValue} from "@chakra-ui/react";
import type {ReactNode} from "react";

export default function SectionCard({children, title}: {children: ReactNode, title?: string}) {
    return <Box
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        borderWidth='1px' borderRadius='lg'
        rounded={'md'}
        p={6}
        overflow={'hidden'}>

        {
            title ? <Heading
                fontSize={'2xl'}
                mb={2}
                fontFamily={'body'}>
                {title}
            </Heading> : null
        }

        <Box color={useColorModeValue('gray.700', 'gray.200')}>
            {children}
        </Box>
    </Box>;
}
