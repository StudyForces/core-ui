import type User from "~/services/user";
import {Button, Menu, MenuButton, MenuDivider, MenuItem, MenuList, useColorModeValue} from "@chakra-ui/react";
import {Link as RemixLink} from "@remix-run/react/dist/components";
import {useSubmit, useTransition} from "@remix-run/react";

function NotAuthorized() {
    const submit = useSubmit();
    const transition = useTransition();

    const signIn = () => {
        submit(null, { method: "post", action: `/auth/keycloak` });
    }

    const signUp = () => {
        submit(null, { method: "post", action: `/auth/keycloak-reg` });
    }

    return <>
        <Button
            fontSize={'sm'}
            fontWeight={400}
            variant={'link'}
            disabled={transition.state !== 'idle'}
            isLoading={transition.state !== 'idle'}
            onClick={signIn}>
            Sign In
        </Button>
        <Button
            display={{base: 'none', md: 'inline-flex'}}
            fontSize={'sm'}
            fontWeight={600}
            color={'white'}
            bg={'brand.400'}
            _hover={{
                bg: useColorModeValue('brand.500', 'brand.300'),
            }}
            disabled={transition.state !== 'idle'}
            isLoading={transition.state !== 'idle'}
            onClick={signUp}>
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
            minW={0} translate={'no'}>
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
