import type User from "~/services/user";
import {Button, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, useColorModeValue} from "@chakra-ui/react";
import {Link as RemixLink} from "@remix-run/react/dist/components";

function NotAuthorized() {
    return <>
        <Button
            as={RemixLink}
            fontSize={'sm'}
            fontWeight={400}
            variant={'link'}
            to={'/login'}>
            Sign In
        </Button>
        <Button
            as={'a'}
            display={{base: 'none', md: 'inline-flex'}}
            fontSize={'sm'}
            fontWeight={600}
            color={'white'}
            bg={'brand.400'}
            href={'#'}
            _hover={{
                bg: useColorModeValue('brand.500', 'brand.300'),
            }}>
            Sign Up
        </Button>
    </>;
}

function Authorized({user}: {user: User}) {
    return <Menu>
        <MenuButton
            as={Button}
            rounded={'full'}
            variant={'link'}
            cursor={'pointer'}
            minW={0}>
            {user.displayName}
        </MenuButton>
        <MenuList>
            <MenuItem>Something</MenuItem>
            <MenuDivider />
            <MenuItem as={RemixLink} to={'/logout'}>Logout</MenuItem>
        </MenuList>
    </Menu>;
}

export default function AuthButtons({user}: {user?: User}) {
    return user === undefined || user === null ? <NotAuthorized /> : <Authorized user={user} />
}
