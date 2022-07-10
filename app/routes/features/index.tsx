import {Box, Flex, Heading, Text, SimpleGrid} from "@chakra-ui/react";
import type {ReactNode} from "react";
import {IoListSharp} from "react-icons/io5";
import {MetaFunction} from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
    return {
        title: 'Features',
        description: 'Get inside of what makes us better.',
    };
};

export default function FeaturesIndex() {
    const Feature = (props: { color: string, title: string, icon: ReactNode, children: ReactNode }) => {
        return (
            <Flex direction={'column'}
                  alignItems={{base: 'start', lg: 'center'}}
                  justifyContent={{base: 'start', lg: 'center'}}>
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    w={8}
                    h={8}
                    mb={4}
                    rounded="full"
                    color={`${props.color}.600`}
                    _dark={{
                        color: `${props.color}.100`,
                        bg: `${props.color}.600`
                    }}
                    bg={`${props.color}.100`}
                >
                    {props.icon}
                </Flex>
                <Heading
                    mb={2}
                    fontSize={'md'}
                    fontWeight="semibold"
                    lineHeight="shorter"
                    _light={{
                        color: "gray.900",
                    }}
                >
                    {props.title}
                </Heading>
                <Text
                    fontSize="sm"
                    color="gray.500"
                    _dark={{
                        color: "gray.400",
                    }}
                    textAlign={{base: 'start', lg: 'center'}}
                >
                    {props.children}
                </Text>
            </Flex>
        );
    };

    return (
        <Box mt={{base: 6, lg: 10}} w={'full'}>
            <Box
                textAlign={{
                    lg: "center",
                }}
            >
                <Heading
                    mt={2}
                    fontSize={{
                        base: "3xl",
                        sm: "4xl",
                    }}
                    lineHeight="8"
                    fontWeight="extrabold"
                    letterSpacing="tight"
                    _light={{
                        color: "gray.900",
                    }}
                >
                    Features
                </Heading>
                <Text
                    mt={4}
                    maxW="2xl"
                    fontSize="xl"
                    mx={{
                        lg: "auto",
                    }}
                    color="gray.500"
                    _dark={{
                        color: "gray.400",
                    }}
                >
                    Get inside of what makes us better.
                </Text>
            </Box>
            <SimpleGrid
                px={{base: 0, lg: 4}}
                columns={{
                    base: 1,
                    sm: 2,
                    md: 3,
                    lg: 4,
                }}
                spacingX={{
                    base: 16,
                    lg: 24,
                }}
                spacingY={20}
                mt={6}
            >
                <Feature
                    color="brand"
                    title="Collection"
                    icon={<IoListSharp/>}
                >
                    An enormous catalog of 9000 problems
                </Feature>
            </SimpleGrid>
        </Box>
    );
};

