import {
    Box,
    Heading,
    Text,
    Stack,
    Badge,
    useColorModeValue, Button, Spacer, Flex, Icon
} from '@chakra-ui/react';
import {Link as RemixLink} from '@remix-run/react';
import { FaArrowRight } from 'react-icons/fa';
import Problem from "~/types/problem";
import ReactKatex from "@pkasila/react-katex";

export default function ProblemCard({problem}: {problem: Problem}) {
    return (
        <Box
            w={'full'}
            bg={useColorModeValue('white', 'gray.900')}
            borderWidth='1px' borderRadius='lg'
            rounded={'md'}
            p={6}
            overflow={'hidden'}>
            <Flex direction={'column'} height={'100%'}>
                <Stack flex={'auto'}>
                    <Text
                        color={useColorModeValue('brand.500', 'brand.300')}
                        textTransform={'uppercase'}
                        fontWeight={800}
                        fontSize={'sm'}
                        letterSpacing={1.1}>
                        #{problem.id}
                    </Text>

                    <Heading
                        noOfLines={1}
                        fontSize={'2xl'}
                        fontFamily={'body'}>
                        <ReactKatex output={'mathml'} children={problem.problem}></ReactKatex>
                    </Heading>

                    <Text color={'gray.500'}
                          noOfLines={3}>
                        <ReactKatex output={'mathml'} children={problem.problem}></ReactKatex>
                    </Text>
                </Stack>

                <Stack pt={6} direction={'row'} spacing={4} align={'center'}
                       justify={'flex-end'} flex={0}>
                    <Stack direction={'row'} spacing={0} fontSize={'sm'}>
                        <Badge colorScheme='brand' variant={useColorModeValue('solid', 'outline')}>
                            Physics
                        </Badge>
                    </Stack>

                    <Spacer />

                    <Button variant={'link'}
                            as={RemixLink}
                            to={`/problems/${problem.id}`}
                            color={'brand.400'}
                            _hover={{
                                color: useColorModeValue('brand.500', 'brand.300'),
                            }}>
                        View
                        <Icon ml={2} as={FaArrowRight}></Icon>
                    </Button>
                </Stack>
            </Flex>
        </Box>
    );
}
