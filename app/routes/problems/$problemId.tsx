import type {LoaderFunction, MetaFunction} from "@remix-run/cloudflare";
import {useLoaderData} from "@remix-run/react";
import {json} from "@remix-run/cloudflare";
import {GraphQLClient} from '@pkasila/graphql-request-fetch';
import {Heading, Container, chakra, Stack, useColorModeValue, Image, Box, SimpleGrid, Tag, Wrap, WrapItem} from "@chakra-ui/react";
import type Problem from "~/types/problem";
import SectionCard from "~/components/problems/section-card";
import ReactKatex from "@pkasila/react-katex";
import Footer from "~/components/layout/footer";

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
        tags {
            id
            title
            color
        }
    }
}`
    const client = new GraphQLClient('https://coreapi-sf.pkasila.net/graphql');
    const results = await client.request(query,{
        id: params.problemId
    }, {
        cache: true,
        cacheKey: request.url,
        cacheTtl: 300,
        cacheType: 'public',
        cacheOverride: true
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
                Problem{' '}
                <chakra.span color={useColorModeValue('brand.500', 'brand.300')}>
                    #{problem.id}
                </chakra.span>
            </Heading>

            <Wrap my={4} spacing={1} fontSize={'sm'} aria-hidden={true}>
                {
                    !problem.published ? <WrapItem>
                        <Tag colorScheme='red' variant={badgeVariant} size={'lg'}>
                            Private
                        </Tag>
                    </WrapItem> : null
                }
                {' '}
                {
                    problem.tags?.map(tag => <WrapItem key={tag.id}>
                        <Tag colorScheme={tag.color} variant={badgeVariant} size={'lg'}>
                            {tag.title}
                        </Tag>
                        {' '}
                    </WrapItem>)
                }
            </Wrap>

            <Stack spacing={4}>
                <SectionCard title={'Problem'}>
                    <ReactKatex breakLine={true} strict={false} children={problem.problem}></ReactKatex>
                </SectionCard>

                {
                    problem.solution != null ? <SectionCard title={'Solution'}>
                        <ReactKatex breakLine={true} strict={'ignore'} children={problem.solution}></ReactKatex>
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
                                problem.attachments.map((attachment, idx) => <Box key={attachment.fileName}>
                                    <Image w="full"
                                           loading={'lazy'}
                                           rounded="lg"
                                           src={attachment.url}
                                           alt={`Attachment #${idx+1}`}></Image>
                                </Box>)
                            }
                        </SimpleGrid>
                    </SectionCard> : null
                }
            </Stack>

            <Footer></Footer>
        </Container>
    </>;
}
