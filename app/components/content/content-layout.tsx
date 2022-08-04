import {
    Box, Button,
    Collapse,
    Drawer,
    DrawerContent,
    DrawerOverlay,
    Flex,
    Heading,
    Icon, IconButton, Input, InputGroup, InputLeftElement, Stack, Text, useColorMode,
    useColorModeValue,
    useDisclosure
} from "@chakra-ui/react";
import {FiMenu, FiSearch, MdKeyboardArrowRight, RiAdminFill} from "react-icons/all";
import type {ReactNode} from "react";
import {MoonIcon, SunIcon} from "@chakra-ui/icons";
import {NavLink as RemixLink} from "@remix-run/react";
import {IoListSharp} from "react-icons/io5";
import AuthButtons from "../auth-buttons";
import type User from "~/services/user";

export default function ContentLayout({children, user}: { children: ReactNode, user?: User }) {
    const sidebar = useDisclosure();
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

    const EditorNavItems = () => {
        const editor = useDisclosure({isOpen: true});

        if (user === null || user === undefined) {
            return null;
        }

        if (!user.roles.includes('editor')) {
            return null;
        }

        return <>
            <NavItem icon={RiAdminFill} onClick={editor.onToggle}>
                Editor
                <Icon
                    as={MdKeyboardArrowRight}
                    ml="auto"
                    transform={editor.isOpen && "rotate(90deg)"}
                />
            </NavItem>
            <Collapse in={editor.isOpen}>
                <NavItem pl="12" py="2" as={RemixLink} to={'/editor/problems?selection=all'}>All problems</NavItem>
                <NavItem pl="12" py="2" as={RemixLink} to={'/editor/problems?selection=unpublished'}>Unpublished problems</NavItem>
                <NavItem pl="12" py="2" as={RemixLink} to={'/editor/problems?selection=published'}>Published problems</NavItem>
            </Collapse>
        </>;
    }

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
                <Heading
                    as={RemixLink} to={'/'}
                    fontSize="lg"
                    ml="2"
                    fontWeight="semibold"
                >
                    StudyForces {' '}
                    <Text as={'span'}
                          bgGradient='linear(to-tl, brand.400, brand.500)'
                          bgClip='text'
                          _dark={{
                              bgGradient: 'linear(to-tl, brand.300, brand.400)'
                          }}>Catalog</Text>
                </Heading>
            </Flex>
            <Flex
                direction="column"
                as="nav"
                fontSize="sm"
                color="gray.600"
                aria-label="Main Navigation"
            >
                <NavItem icon={IoListSharp} as={RemixLink} to={'/problems'}>Problems</NavItem>
                <EditorNavItems></EditorNavItems>
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
                    zIndex={1}
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
                        <Button display={{base: 'none', md: 'flex'}} onClick={toggleColorMode} variant={'link'} aria-label={'Change color mode'}>
                            {colorMode === 'light' ? <MoonIcon/> : <SunIcon/>}
                        </Button>
                        <AuthButtons user={user}></AuthButtons>
                    </Stack>
                </Flex>

                <Box as="main" py={4}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};
