import type {LoaderFunction, MetaFunction} from "@remix-run/cloudflare";
import tokenCheck from "~/services/token-check";
import {useLoaderData, useSubmit} from "@remix-run/react";
import {json} from "@remix-run/cloudflare";
import {GraphQLClient} from '@pkasila/graphql-request-fetch';
import {
    Heading,
    Container,
    TableContainer,
    Table,
    Thead,
    Th,
    Tbody,
    Tfoot,
    Tr,
    useColorModeValue,
    Box, useBreakpointValue
} from "@chakra-ui/react";
import type Problem from "~/types/problem";
import ProblemRow from "~/components/editor/problem-row";
import { AddIcon } from "@chakra-ui/icons";
import PaginationComponent from "~/components/pagination-component";

export const loader: LoaderFunction = async ({request}) => {
    const params = Object.fromEntries(new URL(request.url).searchParams.entries());
    const size = parseInt(params.size ?? "100", 10);
    const page = parseInt(params.page ?? "0", 10);
    const selection = (params.selection ?? 'all').toUpperCase();
    const user = await tokenCheck(request);

    const query = `query EditorProblemsIndex($page: Int, $size: Int, $selection: ProblemSelection) {
    problems: myProblems(page: $page, size: $size, selection: $selection) {
        id
        problem
        published
        sourcesId
        createdBy
        tags {
            id
            title
            color
        }
    }
    problemsCount: myProblemsCount(selection: $selection)
}`

    const headers: any = {};

    if (user?._token.accessToken !== null) {
        headers['Authorization'] = `Bearer ${user?._token.accessToken}`;
    }

    const client = new GraphQLClient('https://coreapi-sf.pkasila.net/graphql', { headers });
    const results = await client.request(query, {
        page, size, selection
    });

    const url = new URL(request.url);

    return json({size, page, selection, results, url: url.pathname+url.search});
}

export const meta: MetaFunction = ({data}) => {
    return {
        title: `Editor/Problems/${data.selection}`,
        description: 'Catalog of problems',
    };
};

export default function EditorProblemsIndex() {
    const {size, page, selection, results, url} = useLoaderData();
    console.log(selection);
    const submit = useSubmit();

    const add = () => {
        submit({
            url,
            act: 'add'
        }, { method: "post", action: `/editor/problems/new` });
    }

    return <Container maxW={'5xl'}>
        <Heading
            mt={2}
            mb={6}
            fontSize={'4xl'}
            fontFamily={'body'}>
            Editor/Problems/{selection}
        </Heading>
        <Box w={'full'}
             bg={useColorModeValue('white', 'gray.900')}
             borderWidth='1px' borderRadius='lg'
             rounded={'md'}
             py={6}
             overflow={'hidden'}>
            <TableContainer style={{whiteSpace: useBreakpointValue({base: 'nowrap', md: 'break-spaces'})}}>
                <Table size='sm'>
                    <Thead>
                        <Tr>
                            <Th>
                                {
                                    selection !== 'PUBLISHED' ?
                                    <AddIcon 
                                        boxSize={'1.3em'}
                                        cursor={'pointer'} 
                                        onClick={() => add()} /> : <span>#</span>
                                }
                            </Th>
                            <Th textAlign={'center'}>Tags</Th>
                            <Th>Problem</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            results.problems.map((problem: Problem) => <ProblemRow key={problem.id} problem={problem}
                                                                                   url={url}></ProblemRow>)
                        }
                    </Tbody>
                    <Tfoot>
                    </Tfoot>
                </Table>
            </TableContainer>
        </Box>

        <PaginationComponent 
            url={`/editor/problems?selection=${selection.toLowerCase()}`}
            currentPage={page}
            totalElements={400}
            size={size}
            />
    </Container>;
}
