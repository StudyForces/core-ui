import type {LoaderFunction} from "@remix-run/cloudflare";
import tokenCheck from "~/services/token-check";
import {useLoaderData} from "@remix-run/react";
import {json} from "@remix-run/cloudflare";
import {request as gqlreq} from '@ninetailed/cf-worker-graphql-request'
import {Heading, SimpleGrid, Container} from "@chakra-ui/react";
import ProblemCard from "~/components/problems/problem-card";
import type Problem from "~/types/problem";

export const loader: LoaderFunction = async ({request}) => {
    const params = Object.fromEntries(new URL(request.url).searchParams.entries());
    const count = parseInt(params.size ?? "100", 10);
    const page = parseInt(params.page ?? "0", 10);
    const user = await tokenCheck(request);

    const query = `query ProblemsIndex($count: Int, $offset: Int) {
    problems(count: $count, offset: $offset, selection: PUBLISHED) {
        id
        type
        problem
    }
}`

    const headers: any = {};

    if (user?._token.accessToken !== null) {
        headers['Authorization'] = `Bearer ${user?._token.accessToken}`;
    }

    const results = await gqlreq('https://coreapi-sf.pkasila.net/graphql', query, {
        count: count, offset: page * count
    });

    return json({count, page, results});
}

export default function ProblemsIndex() {
    const {count, page, results} = useLoaderData();

    return <Container maxW={'5xl'}>
        <Heading
            mt={2}
            mb={6}
            fontSize={'4xl'}
            fontFamily={'body'}>
            Problems
        </Heading>
        <SimpleGrid
            columns={{
                base: 1,
                md: 2
            }}
            spacing={4}
        >
            {
                results.problems.map((problem: Problem) => <ProblemCard key={problem.id}
                                                                        problem={problem}></ProblemCard>)
            }
        </SimpleGrid>
    </Container>;
}
