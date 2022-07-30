import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Stack,
    Collapse,
    Icon,
    Link,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useColorModeValue,
    useBreakpointValue,
    useDisclosure, Container, useColorMode,
} from '@chakra-ui/react';
import {
    HamburgerIcon,
    CloseIcon,
    ChevronDownIcon,
    ChevronRightIcon, SunIcon, MoonIcon,
} from '@chakra-ui/icons';
import {NavLink as RemixLink} from "@remix-run/react";
import User from "~/services/user";
import AuthButtons from '../auth-buttons';

export default function Navbar({user}: { user?: User }) {
    const {colorMode, toggleColorMode} = useColorMode();
    const {isOpen, onToggle} = useDisclosure();

    return (
        <Box bg={useColorModeValue('white', 'gray.800')}>
            <Container maxW={'5xl'}>
                <Flex
                    color={useColorModeValue('gray.600', 'white')}
                    minH={'60px'}
                    py={{base: 2}}
                    px={{base: 4}}
                    borderBottom={1}
                    borderStyle={'solid'}
                    borderColor={useColorModeValue('gray.200', 'gray.900')}
                    align={'center'}>
                    <Flex
                        flex={0}
                        ml={{base: -2}}
                        display={{base: 'flex', md: 'none'}}>
                        <IconButton
                            onClick={onToggle}
                            icon={
                                isOpen ? <CloseIcon w={3} h={3}/> : <HamburgerIcon w={5} h={5}/>
                            }
                            variant={'ghost'}
                            aria-label={'Toggle Navigation'}
                        />
                    </Flex>
                    <Flex flex={'auto'} justify={'start'}>
                        <Text
                            as={RemixLink}
                            to={'/'}
                            ml={2}
                            textAlign={useBreakpointValue({base: 'center', md: 'left'})}
                            fontWeight={600}
                            color={useColorModeValue('gray.800', 'white')}>
                            StudyForces
                        </Text>

                        <Flex display={{base: 'none', md: 'flex'}} ml={10}>
                            <DesktopNav/>
                        </Flex>
                    </Flex>

                    <Stack
                        flex={{base: 1, md: 0}}
                        justify={'flex-end'}
                        direction={'row'}
                        spacing={4}>
                        <Button display={{base: 'none', md: 'flex'}} onClick={toggleColorMode} variant={'link'} aria-label={'Change color mode'}>
                            {colorMode === 'light' ? <MoonIcon/> : <SunIcon/>}
                        </Button>
                        <AuthButtons user={user}></AuthButtons>
                    </Stack>
                </Flex>
            </Container>

            <Collapse in={isOpen} animateOpacity>
                <MobileNav/>
            </Collapse>
        </Box>
    );
}

const DesktopNav = () => {
    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const linkHoverColor = useColorModeValue('gray.800', 'white');
    const popoverContentBgColor = useColorModeValue('white', 'gray.800');

    return (
        <Stack direction={'row'} spacing={4}>
            {NAV_ITEMS.map((navItem) => {
                const link: { as?: any, to?: string, href?: string } = navItem.remix ? {
                    as: RemixLink,
                    to: navItem.href ?? '#'
                } : {
                    href: navItem.href ?? '#'
                }
                return (
                    <Box key={navItem.label}>
                        <Popover trigger={'hover'} placement={'bottom-start'}>
                            <PopoverTrigger>
                                <Link
                                    p={2}
                                    fontSize={'sm'}
                                    fontWeight={500}
                                    color={linkColor}
                                    _hover={{
                                        textDecoration: 'none',
                                        color: linkHoverColor,
                                    }} {...link}>
                                    {navItem.label}
                                </Link>
                            </PopoverTrigger>

                            {navItem.children && (
                                <PopoverContent
                                    border={0}
                                    boxShadow={'xl'}
                                    bg={popoverContentBgColor}
                                    p={4}
                                    rounded={'xl'}
                                    minW={'sm'}>
                                    <Stack>
                                        {navItem.children.map((child) => (
                                            <DesktopSubNav key={child.label} {...child} />
                                        ))}
                                    </Stack>
                                </PopoverContent>
                            )}
                        </Popover>
                    </Box>
                );
            })}
        </Stack>
    );
};

const DesktopSubNav = ({label, href, subLabel, remix}: NavItem) => {
    const link: { as?: any, to?: string, href?: string } = remix ? {
        as: RemixLink,
        to: href ?? '#'
    } : {
        href: href ?? '#'
    }
    return (
        <Link
            role={'group'}
            display={'block'}
            p={2}
            rounded={'md'}
            _hover={{bg: useColorModeValue('brand.50', 'gray.900')}} {...link}>
            <Stack direction={'row'} align={'center'}>
                <Box>
                    <Text
                        transition={'all .3s ease'}
                        _groupHover={{color: 'brand.400'}}
                        fontWeight={500}>
                        {label}
                    </Text>
                    <Text fontSize={'sm'}>{subLabel}</Text>
                </Box>
                <Flex
                    transition={'all .3s ease'}
                    transform={'translateX(-10px)'}
                    opacity={0}
                    _groupHover={{opacity: '100%', transform: 'translateX(0)'}}
                    justify={'flex-end'}
                    align={'center'}
                    flex={1}>
                    <Icon color={'brand.400'} w={5} h={5} as={ChevronRightIcon}/>
                </Flex>
            </Stack>
        </Link>
    );
};

const MobileNav = () => {
    return (
        <Stack
            bg={useColorModeValue('white', 'gray.800')}
            p={4}
            display={{md: 'none'}}>
            {NAV_ITEMS.map((navItem) => (
                <MobileNavItem key={navItem.label} {...navItem} />
            ))}
        </Stack>
    );
};

const MobileNavItem = ({label, children, href, remix}: NavItem) => {
    const {isOpen, onToggle} = useDisclosure();

    const link: { as?: any, to?: string, href?: string } = remix ? {
        as: RemixLink,
        to: href ?? '#'
    } : {
        as: Link,
        href: href ?? '#'
    }

    return (
        <Stack spacing={4} onClick={children && onToggle}>
            <Flex
                py={2}
                justify={'space-between'}
                align={'center'}
                _hover={{
                    textDecoration: 'none',
                }} {...link}>
                <Text
                    fontWeight={600}
                    color={useColorModeValue('gray.600', 'gray.200')}>
                    {label}
                </Text>
                {children && (
                    <Icon
                        as={ChevronDownIcon}
                        transition={'all .25s ease-in-out'}
                        transform={isOpen ? 'rotate(180deg)' : ''}
                        w={6}
                        h={6}
                    />
                )}
            </Flex>

            <Collapse in={isOpen} animateOpacity style={{marginTop: '0!important'}}>
                <Stack
                    mt={2}
                    pl={4}
                    borderLeft={1}
                    borderStyle={'solid'}
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    align={'start'}>
                    {children &&
                        children.map((child) => {
                            const link: { as?: any, to?: string, href?: string } = child.remix ? {
                                as: RemixLink,
                                to: child.href ?? '#'
                            } : {
                                href: child.href ?? '#'
                            }

                            return (
                                <Link key={child.label} py={2} {...link}>
                                    {child.label}
                                </Link>
                            );
                        })}
                </Stack>
            </Collapse>
        </Stack>
    );
};

interface NavItem {
    label: string;
    subLabel?: string;
    children?: Array<NavItem>;
    href?: string;
    remix?: boolean;
}

const NAV_ITEMS: Array<NavItem> = [
    {
        label: 'Problems',
        href: '/problems',
        remix: true,
    },
    {
        label: 'Features',
        href: '/features',
        remix: true
    },
];
