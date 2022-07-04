import {Box, Heading, Text, useColorModeValue} from "@chakra-ui/react";
import {ReactNode} from "react";

export default function SectionCard({children, title}: {children: ReactNode, title: string}) {
    return <Box
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        borderWidth='1px' borderRadius='lg'
        rounded={'md'}
        p={6}
        overflow={'hidden'}>

        <Heading
            fontSize={'2xl'}
            mb={2}
            fontFamily={'body'}>
            {title}
        </Heading>

        <Text color={useColorModeValue('gray.700', 'gray.200')} fontSize={'xl'}>
            {children}
        </Text>
    </Box>;
}
