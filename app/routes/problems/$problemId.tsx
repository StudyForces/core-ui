import type {LoaderFunction, MetaFunction} from "@remix-run/cloudflare";
import tokenCheck from "~/services/token-check";
import {useLoaderData} from "@remix-run/react";
import {json} from "@remix-run/cloudflare";
import {request as gqlreq} from '@ninetailed/cf-worker-graphql-request'
import {Heading, Container, chakra, Stack, useColorModeValue, Badge, Image, Box, SimpleGrid} from "@chakra-ui/react";
import type Problem from "~/types/problem";
import SectionCard from "~/components/problems/section-card";
import ReactKatex from "@pkasila/react-katex";

export const loader: LoaderFunction = async ({request, params}) => {
    const query = `query ProblemView($id: ID!) {
    problem: problemById(id: $id) {
        id
        type
        problem
        solution
        sourcesId
        published
        attachments {
            fileName
            url: signedUrl
        }
    }
}`

    const results = await gqlreq('https://coreapi-sf.pkasila.net/graphql', query,{
        id: params.problemId
    });

    return json(results);
}

export const meta: MetaFunction = ({data}) => {
    let title = `#${data.problem.id} ${data.problem.problem}`;
    title = title.replace(/\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\]/g, '');
    title = title.replace(/\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\]|\\\([\s\S]+?\\\)|\$[^$\\]*(?:\\.[^$\\]*)*\$/g, '');
    return {
        title,
        description: data.problem.problem,
    };
};

export default function ProblemView() {
    const {problem} = useLoaderData() as { problem: Problem };
    const badgeVariant = useColorModeValue('solid', 'outline');

    return <>
        <Container maxW={'5xl'} as={'article'}>
            <Heading
                noOfLines={1}
                mt={2}
                mb={4}
                fontSize={'4xl'}
                fontFamily={'body'}>
                <chakra.span color={useColorModeValue('brand.500', 'brand.300')}>
                    #{problem.id}
                </chakra.span>
                {' '}
                <ReactKatex strict={false} children={problem.problem}></ReactKatex>
            </Heading>

            <Stack my={4} direction={'row'} spacing={1} fontSize={'sm'} aria-hidden={true}>
                {
                    !problem.published ? <Badge colorScheme='red' variant={badgeVariant}>
                        Not Published
                    </Badge> : null
                }
            </Stack>

            <Stack spacing={4}>
                <SectionCard title={'Problem'}>
                    <ReactKatex strict={false} children={problem.problem}></ReactKatex>
                </SectionCard>

                {
                    problem.solution != null ? <SectionCard title={'Solution'}>
                        <ReactKatex strict={'ignore'} children={problem.solution}></ReactKatex>
                    </SectionCard> : null
                }

                {
                    problem.attachments.length > 0 ? <SectionCard title={'Attachments'}>
                        <SimpleGrid
                            columns={{
                                base: 1,
                                md: 2
                            }}
                            spacing={4}>
                            {
                                problem.attachments.map(attachment => <Box key={attachment.fileName}>
                                    <Image w="full"
                                           rounded="lg"
                                           src={attachment.url}></Image>
                                </Box>)
                            }
                        </SimpleGrid>
                    </SectionCard> : null
                }
            </Stack>
        </Container>
    </>;
}
