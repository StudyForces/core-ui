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
    IoListSharp,
    IoSearchSharp,
} from 'react-icons/io5';
import {
    MdMoneyOff
} from 'react-icons/md';
import Feature from './feature';

export default function EnormousCatalog() {
    return (
        <Container maxW={'5xl'} py={8}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
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
                        Features
                    </Text>
                    <Heading>Enormous Catalog</Heading>
                    <Text color={'gray.500'} fontSize={'lg'}>
                        Get access to a huge collection of problems and solutions in Physics,
                        Maths and other subjects.
                    </Text>
                    <Stack
                        spacing={4}
                        divider={
                            <StackDivider
                                borderColor={useColorModeValue('gray.100', 'gray.700')}
                            />
                        }>
                        <Feature
                            icon={<Icon as={MdMoneyOff} color={'green.500'} w={5} h={5} />}
                            iconBg={useColorModeValue('green.100', 'green.900')}
                            text={'Effectively Free'}
                        />
                        <Feature
                            icon={
                                <Icon as={IoListSharp} color={'yellow.500'} w={5} h={5} />
                            }
                            iconBg={useColorModeValue('yellow.100', 'yellow.900')}
                            text={'Over 9000 problems'}
                        />
                        <Feature
                            icon={
                                <Icon as={IoSearchSharp} color={'purple.500'} w={5} h={5} />
                            }
                            iconBg={useColorModeValue('purple.100', 'purple.900')}
                            text={'Search with ease'}
                        />
                    </Stack>
                </Stack>
                <Flex>
                    <Image
                        rounded={'md'}
                        alt={'feature image'}
                        loading={'lazy'}
                        src={
                            'https://images.unsplash.com/photo-1554200876-56c2f25224fa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                        }
                        objectFit={'cover'}
                    />
                </Flex>
            </SimpleGrid>
        </Container>
    );
}
