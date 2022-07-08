import {
    Box,
    Heading,
    Text,
    Stack,
    useColorModeValue, Button, Spacer, Flex, Icon, Tag
} from '@chakra-ui/react';
import {Link as RemixLink} from '@remix-run/react';
import { FaArrowRight } from 'react-icons/fa';
import type Problem from "~/types/problem";
import ReactKatex from "@pkasila/react-katex";
import { Fragment } from 'react';

export default function ProblemCard({problem}: {problem: Problem}) {
    const badgeVariant = useColorModeValue('solid', 'outline');

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
                        <ReactKatex strict={false} children={problem.problem}></ReactKatex>
                    </Heading>

                    <Text color={'gray.500'}
                          noOfLines={3}>
                        <ReactKatex strict={false} children={problem.problem}></ReactKatex>
                    </Text>
                </Stack>

                <Stack pt={6} direction={'row'} spacing={4} align={'center'}
                       justify={'flex-end'} flex={0}>
                    <Stack direction={'row'} spacing={1} fontSize={'sm'}>
                        {
                            problem.tags?.slice(0, 2).map(tag => <Fragment key={tag.id}>
                                <Tag colorScheme={tag.color} variant={badgeVariant}>
                                    {tag.title}
                                </Tag>
                                {' '}
                            </Fragment>)
                        }
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
