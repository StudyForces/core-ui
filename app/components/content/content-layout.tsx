import {
    Box, Button,
    Collapse,
    Drawer,
    DrawerContent,
    DrawerOverlay,
    Flex,
    Icon, IconButton, Input, InputGroup, InputLeftElement, Stack, Text, useColorMode,
    useColorModeValue,
    useDisclosure
} from "@chakra-ui/react";
import {FiMenu, FiSearch, MdHome, MdKeyboardArrowRight, RiAdminFill} from "react-icons/all";
import {ReactNode} from "react";
import {MoonIcon, SunIcon} from "@chakra-ui/icons";
import {NavLink as RemixLink} from "@remix-run/react";
import {IoListSharp} from "react-icons/io5";
import AuthButtons from "../auth-buttons";
import User from "~/services/user";

export default function ContentLayout({children, user}: { children: ReactNode, user?: User }) {
    const sidebar = useDisclosure();
    const admin = useDisclosure();
    const color = useColorModeValue("gray.600", "gray.300");
    const {colorMode, toggleColorMode} = useColorMode();

    const NavItem = ({ icon, children, ...rest }: any) => {
        return (
            <Flex
                align="center"
                px="4"
                pl="4"
                py="3"
                cursor="pointer"
                color="inherit"
                _dark={{
                    color: "gray.400",
                }}
                _hover={{
                    bg: "gray.100",
                    _dark: {
                        bg: "gray.900",
                    },
                    color: "gray.900",
                }}
                role="group"
                fontWeight="semibold"
                transition=".15s ease"
                {...rest}
            >
                {icon && (
                    <Icon
                        mx="2"
                        boxSize="4"
                        _groupHover={{
                            color: color,
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        );
    };

    // @ts-ignore
    const SidebarContent = (props: any) => (
        <Box
            as="nav"
            pos="fixed"
            top="0"
            left="0"
            zIndex="sticky"
            h="full"
            pb="10"
            overflowX="hidden"
            overflowY="auto"
            bg="white"
            _dark={{
                bg: "gray.800",
            }}
            border
            color="inherit"
            borderRightWidth="1px"
            w="60"
            {...props}
        >
            <Flex px="4" py="5" align="center">
                <Text
                    fontSize="2xl"
                    ml="2"
                    color="brand.500"
                    _dark={{
                        color: "white",
                    }}
                    fontWeight="semibold"
                >
                    StudyForces
                </Text>
            </Flex>
            <Flex
                direction="column"
                as="nav"
                fontSize="sm"
                color="gray.600"
                aria-label="Main Navigation"
            >
                <NavItem icon={MdHome} as={RemixLink} to={'/'}>Home</NavItem>
                <NavItem icon={IoListSharp} as={RemixLink} to={'/problems'}>Problems</NavItem>
                <NavItem icon={RiAdminFill} onClick={admin.onToggle}>
                    Admin
                    <Icon
                        as={MdKeyboardArrowRight}
                        ml="auto"
                        transform={admin.isOpen && "rotate(90deg)"}
                    />
                </NavItem>
                <Collapse in={admin.isOpen}>
                    <NavItem pl="12" py="2" as={RemixLink} to={'/admin/problems'}>Problems</NavItem>
                </Collapse>
            </Flex>
        </Box>
    );

    return (
        <Box
            as="section"
            bg="gray.50"
            _dark={{
                bg: "gray.900",
            }}
            minH="100vh"
        >
            <SidebarContent
                display={{
                    base: "none",
                    md: "unset",
                }}
            />
            <Drawer
                isOpen={sidebar.isOpen}
                onClose={sidebar.onClose}
                placement="left"
            >
                <DrawerOverlay/>
                <DrawerContent>
                    <SidebarContent w="full" borderRight="none"/>
                </DrawerContent>
            </Drawer>
            <Box
                ml={{
                    base: 0,
                    md: 60,
                }}
                transition=".3s ease"
            >
                <Flex
                    as="header"
                    align="center"
                    justify="space-between"
                    w="full"
                    px="4"
                    bg="white"
                    _dark={{
                        bg: "gray.800",
                    }}
                    borderBottomWidth="1px"
                    color="inherit"
                    h="14"
                    position="sticky"
                    top={0}
                >
                    <IconButton
                        aria-label="Menu"
                        display={{
                            base: "inline-flex",
                            md: "none",
                        }}
                        onClick={sidebar.onOpen}
                        icon={<FiMenu/>}
                        size="sm"
                    />
                    <InputGroup
                        w="96"
                        display={{
                            base: "none",
                            md: "flex",
                        }}
                    >
                        <InputLeftElement color="gray.500">
                            <FiSearch/>
                        </InputLeftElement>
                        <Input placeholder="Search..."/>
                    </InputGroup>

                    <Stack
                        flex={{base: 1, md: 0}}
                        justify={'flex-end'}
                        direction={'row'}
                        spacing={4}>
                        <Button display={{base: 'none', md: 'flex'}} onClick={toggleColorMode} variant={'link'}>
                            {colorMode === 'light' ? <MoonIcon/> : <SunIcon/>}
                        </Button>
                        <AuthButtons user={user}></AuthButtons>
                    </Stack>
                </Flex>

                <Box as="main" p="4">
                    {children}
                </Box>
            </Box>
        </Box>
    );
};
