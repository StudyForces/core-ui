import {Form} from "@remix-run/react";
import type {LoaderFunction} from "@remix-run/cloudflare";
import authenticator from "~/services/auth.server";
import {Box, Button, Flex, Heading, Link, Stack, useColorModeValue, Text} from "@chakra-ui/react";
import Navbar from "~/components/layout/navbar";

export default function Login() {
    return <>
        <Box w={'100%'} position={'fixed'} top={0}>
            <Navbar></Navbar>
        </Box>
        <Form action={'/auth/keycloak'} method={'post'}>
            <Flex
                minH={'100vh'}
                align={'center'}
                justify={'center'}
                bg={useColorModeValue('gray.50', 'gray.800')}>
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                    <Stack align={'center'}>
                        <Heading fontSize={'4xl'}>Sign in to your account</Heading>
                        <Text fontSize={'lg'} color={'gray.600'}>
                            to enjoy all of our cool <Link color={'brand.400'}>features</Link> ✌️
                        </Text>
                    </Stack>
                    <Box
                        rounded={'lg'}
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow={'lg'}
                        p={8}>
                        <Stack spacing={4}>
                            <Button
                                as={'button'}
                                type={'submit'}
                                bg={'brand.400'}
                                color={'white'}
                                _hover={{
                                    bg: useColorModeValue('brand.500', 'brand.300')
                                }}>
                                Sign in
                            </Button>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
        </Form>
    </>;
}

export let loader: LoaderFunction = async ({ request }) => {
    // If the user is already authenticated redirect to /dashboard directly
    return await authenticator.isAuthenticated(request, {
        successRedirect: "/problems",
    });
};
