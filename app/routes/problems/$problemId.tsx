import type {LoaderFunction} from "@remix-run/cloudflare";
import tokenCheck from "~/services/token-check";
import {useLoaderData} from "@remix-run/react";
import {json} from "@remix-run/cloudflare";
import {request as gqlreq} from '@ninetailed/cf-worker-graphql-request'
import {Heading, Container, chakra, Stack, useColorModeValue} from "@chakra-ui/react";
import type Problem from "~/types/problem";
import SectionCard from "~/components/problems/section-card";
import ReactKatex from "@pkasila/react-katex";

export const loader: LoaderFunction = async ({request, params}) => {
    const user = await tokenCheck(request);

    const query = `query ProblemView($id: ID!) {
    problem: problemById(id: $id) {
        id
        type
        problem
        solution
        attachments {
            fileName
            signedUrl
        }
    }
}`

    const headers: any = {};

    if (user?._token.accessToken !== null) {
        headers['Authorization'] = `Bearer ${user?._token.accessToken}`;
    }

    const results = await gqlreq('https://coreapi-sf.pkasila.net/graphql', query, {
        id: params.problemId
    });

    return json(results);
}

export default function ProblemView() {
    const {problem} = useLoaderData() as {problem: Problem};

    return <>
        <Container maxW={'5xl'} as={'article'}>
            <Heading
                noOfLines={1}
                mt={2}
                mb={6}
                fontSize={'4xl'}
                fontFamily={'body'}>
                <chakra.span color={useColorModeValue('brand.500', 'brand.300')}>
                    #{problem.id}
                </chakra.span>{' '}
                <ReactKatex output={'mathml'} children={problem.problem}></ReactKatex>
            </Heading>

            <Stack spacing={4}>
                <SectionCard title={'Problem'}>
                    <ReactKatex output={'mathml'} children={problem.problem}></ReactKatex>
                </SectionCard>

                {
                    problem.solution != null ? <SectionCard title={'Solution'}>
                        <ReactKatex output={'mathml'} children={problem.solution}></ReactKatex>
                    </SectionCard> : null
                }
            </Stack>
        </Container>
    </>;
}
