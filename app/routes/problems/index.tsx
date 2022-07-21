import type {LoaderFunction, MetaFunction} from "@remix-run/cloudflare";
import {useLoaderData} from "@remix-run/react";
import {json} from "@remix-run/cloudflare";
import {GraphQLClient} from '@pkasila/graphql-request-fetch';
import {Heading, SimpleGrid, Container} from "@chakra-ui/react";
import ProblemCard from "~/components/problems/problem-card";
import PaginationComponent from '~/components/pagination-component';
import type Problem from "~/types/problem";

export const loader: LoaderFunction = async ({request}) => {
    const params = Object.fromEntries(new URL(request.url).searchParams.entries());
    const size = parseInt(params.size ?? "100", 10);
    const page = parseInt(params.page ?? "0", 10);

    const query = `query ProblemsIndex($page: Int, $size: Int) {
        problems(page: $page, size: $size) {
            id
            type
            problem
            tags {
                id
                color
                title
            }
        }
    }`

    const client = new GraphQLClient('https://coreapi-sf.pkasila.net/graphql');
    const results = await client.request(query,{
        page, size
    }, {
        cache: true,
        cacheKey: request.url,
        cacheTtl: 300,
        cacheType: 'public',
        cacheOverride: true
    });

    return json({size, page, results});
}

export const meta: MetaFunction = () => {
    return {
        title: 'Problems',
        description: 'Catalog of problems',
    };
};

export default function ProblemsIndex() {
    const {size, page, results} = useLoaderData();

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
        
        <PaginationComponent currentPage={page} />
    </Container>;
}
