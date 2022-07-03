import LandingLayout from "~/components/landing/landing-layout";
import {Box, Flex, chakra, SimpleGrid, Container} from "@chakra-ui/react";
import {ReactNode} from "react";
import {IoPeopleSharp} from "react-icons/io5";

export default function FeaturesIndex() {
    const Feature = (props: {color: string, title: string, icon: ReactNode, children: ReactNode}) => {
        return (
            <Box>
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
                <chakra.h3
                    mb={2}
                    fontWeight="semibold"
                    lineHeight="shorter"
                    _light={{
                        color: "gray.900",
                    }}
                >
                    {props.title}
                </chakra.h3>
                <chakra.p
                    fontSize="sm"
                    color="gray.500"
                    _dark={{
                        color: "gray.400",
                    }}
                >
                    {props.children}
                </chakra.p>
            </Box>
        );
    };

    return (
        <LandingLayout>
            <Container
                display={'flex'}
                maxW={'5xl'}
                justifyContent="center"
                alignItems="center"
            >
                <Box
                    px={8}
                    pt={{base: 8, md: 20}}
                    pb={20}
                    mx="auto"
                    bg="white"
                    _dark={{
                        bg: "gray.800",
                    }}
                >
                    <Box
                        textAlign={{
                            lg: "center",
                        }}
                    >
                        <chakra.p
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
                        </chakra.p>
                        <chakra.p
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
                        </chakra.p>
                    </Box>
                    <SimpleGrid
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
                            color="red"
                            title="Whoops!"
                            icon={<IoPeopleSharp />}
                        >
                            It needs to be added
                        </Feature>
                    </SimpleGrid>
                </Box>
            </Container>
        </LandingLayout>
    );
};

