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
    Tr,
    useColorModeValue,
    Box, useBreakpointValue, IconButton, Flex, Spacer,
} from "@chakra-ui/react";
import type Problem from "~/types/problem";
import ProblemRow from "~/components/editor/problem-row";
import PaginationComponent from "~/components/pagination-component";
import {IoPencilSharp} from "react-icons/all";

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

    return json({size, page, selection, results, url: request.url});
}

export const meta: MetaFunction = ({data}) => {
    return {
        title: `Editor/Problems/${data.selection}`,
        description: 'Catalog of problems',
    };
};

export default function EditorProblemsIndex() {
    const {size, page, selection, results, url} = useLoaderData();
    const _url = new URL(url);
    const requestingURL = _url.pathname + _url.search;
    const submit = useSubmit();

    const add = () => {
        submit({
            url: requestingURL,
            act: 'add'
        }, { method: "post", action: `/editor/problems/new` });
    }

    return <Container maxW={'5xl'}>
        <Flex align={'center'}
              mt={2}
              mb={6}>
            <Heading
                fontSize={'4xl'}
                fontFamily={'body'}
                noOfLines={1}>
                Editor/Problems/{selection}
            </Heading>
            <Spacer/>
            <IconButton
                size={'sm'}
                variant={useColorModeValue('solid', 'outline')}
                colorScheme='brand'
                aria-label='Add new problem'
                icon={<IoPencilSharp />}
                onClick={() => add()}
            />
        </Flex>
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
                            <Th>#</Th>
                            <Th textAlign={'center'}>Tags</Th>
                            <Th>Problem</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            results.problems.map((problem: Problem) => <ProblemRow key={problem.id} problem={problem}
                                                                                   url={requestingURL}></ProblemRow>)
                        }
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>

        <PaginationComponent
            url={url}
            currentPage={page}
            totalElements={results.problemsCount}
            size={size}
            />
    </Container>;
}
