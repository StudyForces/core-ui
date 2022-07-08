import type Problem from "~/types/problem";
import {useSubmit, useTransition} from "@remix-run/react";
import {
    Badge,
    Button,
    Menu,
    MenuButton, MenuDivider,
    MenuGroup,
    MenuItem,
    MenuList,
    Td,
    Text, Tr,
    useColorModeValue
} from "@chakra-ui/react";
import ReactKatex from "@pkasila/react-katex";
import {Link as RemixLink} from "@remix-run/react/dist/components";

export default function ProblemRow({problem, url}: {problem: Problem, url: string}) {
    const submit = useSubmit();
    const transition = useTransition();
    const badgeVariant = useColorModeValue('solid', 'outline');
    const deleteColor = useColorModeValue('red.500', 'red.300');

    const publish = (problem: Problem) => {
        submit({
            url,
            act: 'publish',
            published: !problem.published ? 'true' : 'false'
        }, { method: "put", action: `/editor/problems/${problem.id}` });
    }

    const takeOwnership = (problem: Problem) => {
        submit({
            url,
            act: 'own'
        }, { method: "put", action: `/editor/problems/${problem.id}` });
    }

    const remove = (problem: Problem) => {
        submit({
            url
        }, { method: "delete", action: `/editor/problems/${problem.id}` });
    }

    return <Tr key={problem.id}>
        <Td>{problem.id}</Td>
        <Td>
            {
                problem.published ? <Badge colorScheme='blue' variant={badgeVariant}>
                    Published
                </Badge> : <Badge colorScheme='red' variant={badgeVariant}>
                    Not Published
                </Badge>
            }
        </Td>
        <Td>
            <Text noOfLines={3}>
                <ReactKatex strict={false} children={problem.problem} />
            </Text>
        </Td>
        <Td>
            <Menu>
                <MenuButton as={Button} isLoading={transition.state !== "idle"} colorScheme='brand' size={'sm'}>
                    Actions
                </MenuButton>
                <MenuList>
                    <MenuGroup title='Core'>
                        <MenuItem as={RemixLink} to={`/problems/${problem.id}`}>View</MenuItem>
                        <MenuItem as={RemixLink} to={`${problem.id}`}>Edit</MenuItem>
                        {
                            problem.createdBy == null ? <MenuItem onClick={() => takeOwnership(problem)}>
                                Take ownership
                            </MenuItem> : null
                        }
                        <MenuItem onClick={() => publish(problem)}>
                            {
                                problem.published ? 'Unpublish' : 'Publish'
                            }
                        </MenuItem>
                        <MenuItem onClick={() => remove(problem)} color={deleteColor}>
                            Remove
                        </MenuItem>
                    </MenuGroup>
                    {
                        problem.sourcesId ? <>
                            <MenuDivider />
                            <MenuGroup title='Sources'>
                                <MenuItem as={'a'} href={`https://sources-sf.pkasila.net/problems/${problem.sourcesId}`}>
                                    Synced as #{problem.sourcesId}
                                </MenuItem>
                            </MenuGroup>
                        </> : null
                    }
                </MenuList>
            </Menu>
        </Td>
    </Tr>;
}
