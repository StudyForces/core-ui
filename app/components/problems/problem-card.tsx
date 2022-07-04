import {
    Box,
    Heading,
    Text,
    Stack,
    Avatar,
    useColorModeValue
} from '@chakra-ui/react';
import Problem from "~/types/problem";

export default function ProblemCard({problem}: {problem: Problem}) {
    return (
        <Box
            w={'full'}
            bg={useColorModeValue('white', 'gray.900')}
            borderWidth='1px' borderRadius='lg'
            rounded={'md'}
            p={6}
            overflow={'hidden'}>
            <Stack>
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
                    color={useColorModeValue('gray.700', 'white')}
                    fontSize={'2xl'}
                    fontFamily={'body'}>
                    {problem.problem}
                </Heading>
                <Text color={'gray.500'}
                      noOfLines={3}>
                    {problem.problem}
                </Text>
            </Stack>
        </Box>
    );
}
