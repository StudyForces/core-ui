import type {ActionFunction, LoaderFunction, MetaFunction} from "@remix-run/cloudflare";
import {json} from "@remix-run/cloudflare";
import {useLoaderData} from "@remix-run/react";
import {GraphQLClient} from '@pkasila/graphql-request-fetch';
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    chakra,
    Container,
    Heading,
    Image,
    SimpleGrid,
    Stack,
    Tag,
    useColorModeValue,
    Wrap,
    WrapItem
} from "@chakra-ui/react";
import type Problem from "~/types/problem";
import ReactKatex from "@pkasila/react-katex";
import Footer from "~/components/layout/footer";
import SolveProblem from "~/components/problems/solve-problem";
import ProblemSolveType from "~/types/solve/problem-solve-type";
import ProblemSolve from "~/types/solve/problem-solve";
import ProblemSolveVariantType from "~/types/solve/problem-solve-variant-type";

export const action: ActionFunction = async ({request, params}) => {
    const query = `query ProblemSolve($id: ID!) {
    problem: problemById(id: $id) {
        solution
        solverMetadata {
            type
            correct {
                type
                string
                number
                index
            }
            formula
        }
    }
}`
    const client = new GraphQLClient('https://coreapi-sf.pkasila.net/graphql');
    const results: {problem: Problem} = await client.request(query, {
        id: params.problemId
    }, { cache: false });

    const data: ProblemSolve = JSON.parse((await request.formData()).get('solved') as (string | null) ?? '{}' as string);

    switch(results.problem.solverMetadata?.type) {
        case ProblemSolveType.CT_A:
            return json({
                correct: data.correct?.index === results.problem.solverMetadata.correct?.index
            });
        case ProblemSolveType.CT_B:
            switch(results.problem.solverMetadata?.correct?.type) {
                case ProblemSolveVariantType.STRING:
                    return json({
                        correct: data.correct?.string === results.problem.solverMetadata.correct?.string
                    });
                case ProblemSolveVariantType.NUMBER:
                    return json({
                        correct: data.correct?.number === results.problem.solverMetadata.correct?.number
                    });
            }
            break;
        case ProblemSolveType.FORMULA:
            // TODO: needs to be implemented
            return json({
                correct: false
            });
    }

    return json({
        correct: false
    });
}

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
        solverMetadata {
            type
            variants {
                type
                string
                number
            }
            correct {
                type
            }
        }
    }
}`
    const client = new GraphQLClient('https://coreapi-sf.pkasila.net/graphql');
    const results = await client.request(query, {
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
                fontSize={'3xl'}>
                Problem{' '}
                <chakra.span color={useColorModeValue('brand.500', 'brand.300')}>
                    #{problem.id}
                </chakra.span>
            </Heading>

            <Wrap my={4} spacing={1} fontSize={'sm'} aria-hidden={true}>
                {
                    !problem.published ? <WrapItem>
                        <Tag colorScheme='red' variant={badgeVariant} size={'md'}>
                            Private
                        </Tag>
                    </WrapItem> : null
                }
                {' '}
                {
                    problem.tags?.map(tag => <WrapItem key={tag.id}>
                        <Tag colorScheme={tag.color} variant={badgeVariant} size={'md'}>
                            {tag.title}
                        </Tag>
                        {' '}
                    </WrapItem>)
                }
            </Wrap>

            <Stack spacing={4}>
                <Box fontFamily={'serif'}>
                    <ReactKatex breakLine={true} strict={false} children={problem.problem}></ReactKatex>
                </Box>

                {
                    problem.attachments.length > 0 ? <Accordion allowToggle>
                        <AccordionItem>
                            <h2>
                                <AccordionButton>
                                    <Box flex='1' textAlign='left'>
                                        Attachments
                                    </Box>
                                    <AccordionIcon/>
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                <SimpleGrid
                                    columns={{
                                        base: 1,
                                        md: 2,
                                        lg: 3
                                    }}
                                    spacing={4}>
                                    {
                                        problem.attachments.map((attachment, idx) => <Box key={attachment.fileName}>
                                            <Image w="full"
                                                   loading={'lazy'}
                                                   rounded="lg"
                                                   src={attachment.url}
                                                   alt={`Attachment #${idx + 1}`}></Image>
                                        </Box>)
                                    }
                                </SimpleGrid>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion> : null
                }

                {
                    problem.solverMetadata?.type ? <SolveProblem problem={problem}></SolveProblem> : null
                }

                {
                    problem.solution != null ? <Accordion allowToggle>
                        <AccordionItem>
                            <AccordionButton>
                                <Box flex='1' textAlign='left' fontFamily={'heading'}>
                                    Solution
                                </Box>
                                <AccordionIcon/>
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                <Box fontFamily={'serif'}>
                                    <ReactKatex breakLine={true} strict={'ignore'}
                                                children={problem.solution}></ReactKatex>
                                </Box>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion> : null
                }
            </Stack>

            <Footer></Footer>
        </Container>
    </>;
}
