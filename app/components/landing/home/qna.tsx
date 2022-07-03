import {
    Container,
    SimpleGrid,
    Image,
    Flex,
    Heading,
    Text,
    Stack,
    StackDivider,
    Icon,
    useColorModeValue,
} from '@chakra-ui/react';
import {
    IoPeopleSharp,
    IoSpeedometerOutline,
} from 'react-icons/io5';
import Feature from './feature';

export default function Qna() {
    return (
        <Container maxW={'5xl'} py={8}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                <Flex>
                    <Image
                        rounded={'md'}
                        alt={'feature image'}
                        src={
                            'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                        }
                        objectFit={'cover'}
                    />
                </Flex>
                <Stack spacing={4}>
                    <Text
                        textTransform={'uppercase'}
                        color={'brand.400'}
                        fontWeight={600}
                        fontSize={'sm'}
                        bg={useColorModeValue('brand.50', 'brand.900')}
                        p={2}
                        alignSelf={'flex-start'}
                        rounded={'md'}>
                        Community
                    </Text>
                    <Heading>Q&A</Heading>
                    <Text color={'gray.500'} fontSize={'lg'}>
                        Ask, find and give. Q&A allows you to ask questions in topics related
                        to almost any subject and get answers from the community.
                    </Text>
                    <Stack
                        spacing={4}
                        divider={
                            <StackDivider
                                borderColor={useColorModeValue('gray.100', 'gray.700')}
                            />
                        }>
                        <Feature
                            icon={<Icon as={IoSpeedometerOutline} color={'orange.500'} w={5} h={5} />}
                            iconBg={useColorModeValue('orange.100', 'orange.900')}
                            text={'Fast and easy to use'}
                        />
                        <Feature
                            icon={
                                <Icon as={IoPeopleSharp} color={'blue.500'} w={5} h={5} />
                            }
                            iconBg={useColorModeValue('blue.100', 'blue.900')}
                            text={'Driven by the community'}
                        />
                    </Stack>
                </Stack>
            </SimpleGrid>
        </Container>
    );
}
