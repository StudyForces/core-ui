import type { ReactNode } from 'react';

import {
    Box,
    Container,
    Link,
    SimpleGrid,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { Link as RemixLink } from "@remix-run/react";

const ListHeader = ({ children }: { children: ReactNode }) => {
    return (
        <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
            {children}
        </Text>
    );
};

export default function Footer() {
    return (
        <Box
            bg={useColorModeValue('gray.50', 'gray.900')}
            color={useColorModeValue('gray.700', 'gray.200')}>
            <Container as={Stack} maxW={'6xl'} py={10}>
                <SimpleGrid
                    templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr 1fr' }}
                    spacing={8}>
                    <Stack spacing={6}>
                        <Box>
                            <Text
                                fontFamily={'heading'}
                                fontWeight={600}
                                color={useColorModeValue('gray.700', 'white')}>
                                StudyForces
                            </Text>
                        </Box>
                        <Text fontSize={'sm'}>
                            © 2022 StudyForces. All rights reserved
                        </Text>
                    </Stack>
                    <Stack align={'flex-start'}>
                        <ListHeader>Product</ListHeader>
                        <Link as={RemixLink} to={'/'}>Overview</Link>
                        <Link as={RemixLink} to={'/features'}>Features</Link>
                        <Link as={RemixLink} to={'/pricing'}>Pricing</Link>
                    </Stack>
                    <Stack align={'flex-start'}>
                        <ListHeader>Company</ListHeader>
                        <Link as={RemixLink} to={'/team/about'}>About</Link>
                        <Link as={RemixLink} to={'/team/press'}>Press</Link>
                        <Link as={RemixLink} to={'/team/jobs'}>Careers</Link>
                        <Link as={RemixLink} to={'/team/contacts'}>Contact</Link>
                        <Link as={RemixLink} to={'/partnership'}>Partners</Link>
                    </Stack>
                    <Stack align={'flex-start'}>
                        <ListHeader>Support</ListHeader>
                        <Link href={'https://pkasila.net/sf/tos.pdf'}>Terms of Service</Link>
                        <Link href={'https://pkasila.net/sf/privacypolicy.pdf'}>Privacy Policy</Link>
                    </Stack>
                    <Stack align={'flex-start'}>
                        <ListHeader>Follow Us</ListHeader>
                        <Link href={'https://github.com/StudyForces'}>GitHub</Link>
                    </Stack>
                </SimpleGrid>
            </Container>
        </Box>
    );
}
