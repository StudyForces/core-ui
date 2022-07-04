import {Box, chakra, Flex, Stack, Image, Link} from "@chakra-ui/react";

export default function CallAction() {
    return <Flex
        direction={{
            base: "column",
            md: "row",
        }}
        _light={{
            bg: "brand.500",
        }}
        _dark={{
            bg: "brand.900"
        }}
        px={8}
        py={24}
        mx="auto"
    >
        <Box
            w={{
                base: "full",
                md: 11 / 12,
                xl: 9 / 12,
            }}
            mx="auto"
            pr={{
                md: 20,
            }}
        >
            <chakra.h2
                fontSize={{
                    base: "3xl",
                    sm: "4xl",
                }}
                fontWeight="extrabold"
                lineHeight="shorter"
                color="white"
                _dark={{
                    color: "gray.100",
                }}
                mb={6}
            >
                <chakra.span display="block">Are you ready?</chakra.span>
                <chakra.span
                    display="block"
                    color="white"
                    _dark={{
                        color: "gray.400",
                    }}
                >
                    Start using StudyForces now
                </chakra.span>
            </chakra.h2>
            <chakra.p
                mb={6}
                fontSize={{
                    base: "lg",
                    md: "xl",
                }}
                color="gray.100"
                _dark={{
                    color: "gray.300",
                }}
            >
                StudyForces is a platform with a modern problem and solution catalog and
                a superior Q&A section to ask and help people on topics related to Physics,
                Maths and other subjects.
            </chakra.p>
            <Stack
                direction={{
                    base: "column",
                    sm: "row",
                }}
                mb={{
                    base: 4,
                    md: 8,
                }}
                spacing={2}
            >
                <Box display="inline-flex" rounded="md" shadow="md">
                    <Link
                        display="inline-flex"
                        alignItems="center"
                        justifyContent="center"
                        px={5}
                        py={3}
                        border="solid transparent"
                        fontWeight="bold"
                        w="full"
                        rounded="md"
                        _light={{
                            color: "white",
                        }}
                        bg="brand.600"
                        _dark={{
                            bg: "brand.500",
                        }}
                        _hover={{
                            bg: "brand.700",
                            _dark: {
                                bg: "brand.600",
                            },
                        }}
                    >
                        Sign up for free
                    </Link>
                </Box>
            </Stack>
        </Box>
        <Box
            w={{
                base: "full",
                md: 10 / 12,
            }}
            mx="auto"
            textAlign="center"
        >
            <Image
                w="full"
                rounded="lg"
                shadow="2xl"
                src="/screenshot.png"
                alt="StudyForces landing screenshot"
            />
        </Box>
    </Flex>;
}