import type {ActionFunction, LoaderFunction, MetaFunction} from "@remix-run/cloudflare";
import tokenCheck from "~/services/token-check";
import {GraphQLClient} from "@ninetailed/cf-worker-graphql-request";
import {json, redirect} from "@remix-run/cloudflare";
import {
    Box,
    Button,
    chakra,
    Checkbox,
    Container,
    Heading,
    Image,
    Radio, RadioGroup,
    SimpleGrid,
    Stack,
    Textarea,
    useColorModeValue
} from "@chakra-ui/react";
import ReactKatex from "@pkasila/react-katex";
import {useLoaderData, useSubmit, useTransition} from "@remix-run/react";
import type Problem from "~/types/problem";
import {useState} from "react";
import SectionCard from "~/components/problems/section-card";
import ProblemType from "~/types/problem-type";

export const action: ActionFunction = async ({ request, params }) => {
    const data = await request.formData();

    const user = await tokenCheck(request);

    let query: string;
    let variables: any = {
        id: params.problemId
    };
    let redirectPath: string = data.get('url') as string || '/editor/problems';

    const headers: any = {};

    if ((user?.roles || []).includes('editor')) {
        headers['Authorization'] = `Bearer ${user?._token.accessToken}`;
    } else {
        return redirect(redirectPath);
    }

    switch(request.method.toLowerCase()) {
        case 'delete':
            query = `mutation ProblemDelete($id: ID!) {
    deleteProblem(id: $id)
}`;
            break;
        case 'post':
            const solution = data.get('solution');
            variables["input"] = {
                problem: data.get('problem'),
                solution: solution === '' ? null : solution,
                type: data.get('type'),
            };
            query = `mutation ProblemUpdate($id: ID!, $input: ProblemInput) {
    updateProblem(id: $id, input: $input) {
        id
    }
}`;
            break;
        case 'put':
            variables["published"] = data.get('published') === 'true';
            query = `mutation ProblemPublish($id: ID!, $published: Boolean) {
    publishProblem(id: $id, published: $published) {
        id
    }
}`;
            break;
        default:
            return redirect(redirectPath);
    }

    const client = new GraphQLClient('https://coreapi-sf.pkasila.net/graphql', { headers });
    await client.request(query, variables);

    return redirect(redirectPath);
}

export const loader: LoaderFunction = async ({request, params}) => {
    const user = await tokenCheck(request);

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

    const headers: any = {};

    if (user?._token.accessToken !== null) {
        headers['Authorization'] = `Bearer ${user?._token.accessToken}`;
    }

    const client = new GraphQLClient('https://coreapi-sf.pkasila.net/graphql', { headers });
    const results = await client.request(query, {
        id: params.problemId
    });

    const url = new URL(request.url);

    return json({results, url: url.pathname+url.search});
};

export const meta: MetaFunction = ({data}) => {
    return {
        title: `Edit Problem #${data.results.problem.id}`,
        description: data.results.problem.problem,
    };
};

export default function EditorProblem() {
    const {results, url} = useLoaderData() as {results: {problem: Problem}, url: string};
    const [type, setType] = useState(results.problem.type);
    const [problem, setProblem] = useState(results.problem.problem);
    const [solution, setSolution] = useState(results.problem.solution ?? '');
    const [hasSolution, setHasSolution] = useState(results.problem.solution !== null && results.problem.solution !== '');

    const handleProblemChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputValue = e.target.value;
        setProblem(inputValue);
    }

    const handleSolutionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputValue = e.target.value;
        setSolution(inputValue);
    }

    const submit = useSubmit();
    const transition = useTransition();

    const save = () => {
        if (!hasSolution) {
            setSolution('');
        }
        submit({
            url,
            problem,
            solution: hasSolution ? solution : '',
            type
        }, { method: "post", action: `/editor/problems/${results.problem.id}` });
    }

    const publish = (published: boolean) => {
        submit({
            url,
            published: published ? 'true' : 'false'
        }, { method: "put", action: `/editor/problems/${results.problem.id}` });
    }

    const remove = () => {
        submit({
            url: '/editor/problems'
        }, { method: "delete", action: `/editor/problems/${results.problem.id}` });
    }

    const hasChanges: boolean = problem !== results.problem.problem ||
                                type !== results.problem.type ||
                                solution !== (results.problem.solution ?? '') ||
                                hasSolution !== (results.problem.solution !== null && results.problem.solution !== '');

    return <>
        <Container maxW={'5xl'} as={'article'}>
            <Heading
                noOfLines={1}
                mt={2}
                mb={4}
                fontSize={'4xl'}
                fontFamily={'body'}>
                Edit Problem{' '}
                <chakra.span color={useColorModeValue('brand.500', 'brand.300')}>
                    #{results.problem.id}
                </chakra.span>
            </Heading>

            <Stack spacing={4}>
                <SectionCard title={'Settings'}>
                    <Stack spacing={2}>
                        <RadioGroup defaultValue={type} onChange={(e) => setType(e as ProblemType)}>
                            <Stack direction='row' spacing={5}>
                                <Radio value={ProblemType.STATIC}>Static</Radio>
                                <Radio value={ProblemType.DYNAMIC}>Dynamic</Radio>
                            </Stack>
                        </RadioGroup>
                        <Stack direction='row' spacing={5}>
                            <Checkbox isChecked={hasSolution} onChange={(e) => setHasSolution(e.target.checked)}>
                                Add Solution
                            </Checkbox>
                            <Checkbox isChecked={results.problem.published} disabled={hasChanges || transition.state !== 'idle'}
                                      onChange={!hasChanges ? (e) => publish(e.target.checked) : undefined}>
                                {
                                    transition.state === 'idle' ? 'Published' : 'Loading...'
                                }
                            </Checkbox>
                        </Stack>
                    </Stack>
                </SectionCard>

                <SectionCard title={'Problem'}>
                    <ReactKatex strict={false} children={problem}></ReactKatex>
                    <Textarea
                        mt={3}
                        value={problem}
                        onChange={handleProblemChange}
                        placeholder='Problem...'
                    />
                </SectionCard>

                {
                    hasSolution ? <SectionCard title={'Solution'}>
                        <ReactKatex strict={false} children={solution}></ReactKatex>
                        <Textarea
                            mt={3}
                            value={solution}
                            onChange={handleSolutionChange}
                            placeholder='Solution...'
                        />
                    </SectionCard> : null
                }

                {
                    results.problem.attachments.length > 0 ? <SectionCard title={'Attachments'}>
                        <SimpleGrid
                            columns={{
                                base: 1,
                                md: 2
                            }}
                            spacing={4}>
                            {
                                results.problem.attachments.map(attachment => <Box key={attachment.fileName}>
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

        <Box
            position={'sticky'} bottom={0}
            w={'full'}
            bg={useColorModeValue('white', 'gray.900')}
            borderTopWidth='1px'
            mt={4}
            overflow={'hidden'}>
            <Container maxW={'5xl'} py={4}>
                <Stack direction={'row'}>
                    <Button colorScheme='brand'
                            onClick={save}
                            disabled={transition.state !== 'idle'}
                            isLoading={transition.state !== 'idle'}>
                        Save
                    </Button>
                    <Button colorScheme='red'
                            onClick={remove}
                            disabled={transition.state !== 'idle'}
                            isLoading={transition.state !== 'idle'}>
                        Delete
                    </Button>
                </Stack>
            </Container>
        </Box>
    </>;
}
