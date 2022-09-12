import type {ActionFunction, LoaderFunction, MetaFunction} from "@remix-run/cloudflare";
import {json, redirect} from "@remix-run/cloudflare";
import tokenCheck from "~/services/token-check";
import {GraphQLClient} from '@pkasila/graphql-request-fetch';
import {
    Box,
    Button,
    chakra,
    Checkbox,
    Container,
    Heading,
    Radio,
    RadioGroup,
    Skeleton,
    Stack,
    Tag as ChakraTag,
    Textarea,
    useColorModeValue,
    Wrap,
    WrapItem
} from "@chakra-ui/react";
import ReactKatex from "@pkasila/react-katex";
import {useLoaderData, useSubmit, useTransition} from "@remix-run/react";
import {ClientOnly} from "remix-utils";
import type Problem from "~/types/problem";
import type Tag from "~/types/problem";
import {useCallback, useState} from "react";
import SectionCard from "~/components/problems/section-card";
import ProblemType from "~/types/problem-type";
import TagsSelector from "~/components/editor/tags-selector.client";
import EditProblemSolve from "~/components/editor/edit-problem-solve";
import type ProblemSolve from "~/types/solve/problem-solve";
import ProblemSolveType from "~/types/solve/problem-solve-type";
import EquationInserter from "~/components/equation-inserter";
import AttachmentsEdit from "~/components/editor/attachments-edit";
import ProblemAttachment from "~/types/ProblemAttachment";

export const action: ActionFunction = async ({request, params}) => {
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

    switch (request.method.toLowerCase()) {
        case 'delete':
            query = `mutation ProblemDelete($id: ID!) {
    deleteProblem(id: $id)
}`;
            break;
        case 'post':
            switch (data.get('act')) {
                case 'update':
                    const solution = data.get('solution');
                    const solverMetadata = JSON.parse(data.get('solverMetadata') as string);

                    variables["input"] = {
                        problem: data.get('problem'),
                        solution: solution === '' ? null : solution,
                        type: data.get('type'),
                        tagIds: (data.get('tags') as string).split(',').map(id => parseInt(id, 10)),
                        solverMetadata: solverMetadata,
                        attachments: {
                            files: JSON.parse(data.get('attachments') as string)
                        }
                    };
                    query = `mutation ProblemUpdate($id: ID!, $input: ProblemInput) {
    updateProblem(id: $id, input: $input) {
        id
    }
}`;
                    break;
                case 'add':
                    variables["input"] = {
                        problem: 'New problem',
                        solution: null,
                        type: ProblemType.STATIC,
                        tagIds: [],
                        solverMetadata: null
                    };
                    query = `mutation ProblemAdd($input: ProblemInput) {
    addProblem(input: $input) {
        id
    }
}`;
                    break;
                default:
                    return redirect(redirectPath);
            }
            break;
        case 'put':
            switch (data.get('act')) {
                case 'publish':
                    variables["published"] = data.get('published') === 'true';
                    query = `mutation ProblemPublish($id: ID!, $published: Boolean) {
    publishProblem(id: $id, published: $published) {
        id
    }
}`;
                    break;
                case 'own':
                    query = `mutation ProblemOwn($id: ID!) {
    takeProblem(id: $id) {
        id
    }
}`;
                    break;
                default:
                    return redirect(redirectPath);
            }
            break;
        default:
            return redirect(redirectPath);
    }

    const client = new GraphQLClient('https://coreapi-sf.pkasila.net/graphql', {headers});
    const results: any = await client.request(query, variables);

    if (params.problemId === 'new') {
        redirectPath = `/editor/problems/${results.addProblem.id}`;
    }

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
        createdBy
        attachments {
            fileName
            url: signedUrl
        }
        tags {
            id
            color
            title
        }
        solverMetadata {
            type
            variants {
                type
                number
                string
                index
            }
            correct {
                type
                number
                string
                index
            }
            formula
        }
    }
    tags {
        id
        color
        title
        parent {
            id
        }
    }
}`

    const headers: any = {};

    if (user?._token.accessToken !== null) {
        headers['Authorization'] = `Bearer ${user?._token.accessToken}`;
    }

    const client = new GraphQLClient('https://coreapi-sf.pkasila.net/graphql', {headers});
    const results = await client.request(query, {
        id: params.problemId
    });

    const url = new URL(request.url);

    return json({results, url: url.pathname + url.search});
};

export const meta: MetaFunction = ({data}) => {
    return {
        title: `Edit Problem #${data.results.problem.id}`,
        description: data.results.problem.problem,
    };
};

export default function EditorProblem() {
    const badgeVariant = useColorModeValue('solid', 'outline');

    const {results, url} = useLoaderData() as { results: { problem: Problem, tags: Tag[] }, url: string };
    const [type, setType] = useState(results.problem.type);
    const [tags, setTags] = useState(results.problem.tags ?? []);
    const [attachments, setAttachments] = useState<ProblemAttachment[] | null>(null);
    const [problem, setProblem] = useState(results.problem.problem);
    const [solution, setSolution] = useState(results.problem.solution ?? '');
    const [hasSolution, setHasSolution] = useState(results.problem.solution !== null && results.problem.solution !== '');

    // TODO: find a better solution to solver metadata object copying
    const [solverMetadata, setSolverMetadata] = useState<ProblemSolve | null>(JSON.parse(JSON.stringify(results.problem.solverMetadata ?? 'null')));

    const [hasSolverMetadata, setHasSolverMetadata] = useState(results.problem.solverMetadata?.type !== null);

    const handleProblemChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputValue = e.target.value;
        setProblem(inputValue);
    }

    const handleSolutionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputValue = e.target.value;
        setSolution(inputValue);
    }

    const handleHasSolverMetadataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHasSolverMetadata(e.target.checked);
        if (!solverMetadata?.type) {
            setSolverMetadata(e.target.checked ? {type: ProblemSolveType.FORMULA} : null);
        }
    }

    const handleAttachmentsChange = (attachments: ProblemAttachment[]) => {
        console.log(attachments);
        setAttachments(attachments);
    }

    const submit = useSubmit();
    const transition = useTransition();

    const save = () => {
        if (!hasSolution) {
            setSolution('');
        }

        if (!hasSolverMetadata) {
            setSolverMetadata(null);
        }

        submit({
            url,
            act: 'update',
            problem,
            solution: hasSolution ? solution : '',
            solverMetadata: JSON.stringify((hasSolverMetadata && solverMetadata?.type) ? solverMetadata : null),
            type,
            tags: tags.map(t => `${t.id}`).join(','),
            attachments: JSON.stringify((attachments ?? results.problem.attachments).map(a => a.fileName)),
        }, {method: "post", action: `/editor/problems/${results.problem.id}`});
    }

    const publish = (published: boolean) => {
        submit({
            url,
            act: 'publish',
            published: published ? 'true' : 'false'
        }, {method: "put", action: `/editor/problems/${results.problem.id}`});
    }

    const takeOwnership = () => {
        submit({
            url,
            act: 'own'
        }, {method: "put", action: `/editor/problems/${results.problem.id}`});
    }

    const remove = () => {
        submit({
            url: '/editor/problems'
        }, {method: "delete", action: `/editor/problems/${results.problem.id}`});
    }

    const hasChanges: boolean = problem !== results.problem.problem ||
        type !== results.problem.type ||
        JSON.stringify(tags.map(t => t.id).sort()) !== JSON.stringify(results.problem.tags?.map(t => t.id).sort() ?? []) ||
        solution !== (results.problem.solution ?? '') ||
        hasSolution !== (results.problem.solution !== null && results.problem.solution !== '') ||
        JSON.stringify(solverMetadata) !== JSON.stringify(results.problem.solverMetadata) ||
        hasSolverMetadata !== (results.problem.solverMetadata?.type !== null) ||
        (attachments ?? results.problem.attachments).map(a => a.fileName) !== results.problem.attachments.map(a => a.fileName);

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
                            <Checkbox isChecked={hasSolverMetadata} onChange={handleHasSolverMetadataChange}>
                                Add Solve
                            </Checkbox>
                            <Checkbox isChecked={hasSolution} onChange={(e) => setHasSolution(e.target.checked)}>
                                Add Solution
                            </Checkbox>
                            <Checkbox isChecked={results.problem.published}
                                      disabled={transition.state !== 'idle'}
                                      onChange={transition.state === 'idle' ? (e) => publish(e.target.checked) : undefined}>
                                {
                                    transition.state === 'idle' ? 'Published' : 'Loading...'
                                }
                            </Checkbox>
                        </Stack>
                    </Stack>
                </SectionCard>

                <SectionCard title={'Problem'}>
                    <Box fontFamily={'serif'} mb={2}>
                        <ReactKatex breakLine={true} strict={false} children={problem}></ReactKatex>
                    </Box>
                    <EquationInserter />
                    <Textarea
                        mt={1}
                        value={problem}
                        onChange={handleProblemChange}
                        placeholder='Problem...'
                    />
                </SectionCard>

                {
                    hasSolverMetadata ? <EditProblemSolve
                        solverMetadata={Object.assign({}, solverMetadata)}
                        setSolverMetadata={(_solverMetadata: ProblemSolve) => setSolverMetadata(_solverMetadata)} /> : null
                }

                {
                    hasSolution ? <SectionCard title={'Solution'}>
                        <Box fontFamily={'serif'} mb={2}>
                            <ReactKatex breakLine={true} strict={false} children={solution}></ReactKatex>
                        </Box>
                        <EquationInserter />
                        <Textarea
                            mt={1}
                            value={solution}
                            onChange={handleSolutionChange}
                            placeholder='Solution...'
                        />
                    </SectionCard> : null
                }

                <SectionCard title={'Attachments'}>
                    <AttachmentsEdit attachments={attachments ?? results.problem.attachments} onChange={handleAttachmentsChange}></AttachmentsEdit>
                </SectionCard>

                <SectionCard title={'Tags'}>
                    <Wrap spacing={1}>
                        {
                            tags.map(tag => <WrapItem key={tag.id}>
                                <ChakraTag colorScheme={tag.color} variant={badgeVariant} size={'lg'}>
                                    {tag.title}
                                </ChakraTag>
                                {' '}
                            </WrapItem>)
                        }
                    </Wrap>
                    <Box height={'200px'} style={{overflowY: 'scroll'}} mt={4}>
                        <ClientOnly fallback={<Skeleton height='200px'/>}
                                    children={() => <TagsSelector tags={results.tags} selected={tags}
                                                                  onChange={tags => setTags(tags)}></TagsSelector>}/>
                    </Box>
                </SectionCard>
            </Stack>
        </Container>

        <Box
            position={'sticky'} bottom={0}
            w={'full'}
            bg={useColorModeValue('white', 'gray.900')}
            borderTop={1}
            mt={4}
            overflow={'hidden'}>
            <Container maxW={'5xl'} py={4}>
                <Stack direction={'row'}>
                    <Button colorScheme='brand'
                            onClick={hasChanges ? save : undefined}
                            disabled={transition.state !== 'idle' || !hasChanges}
                            isLoading={transition.state !== 'idle'}>
                        Save
                    </Button>
                    <Button colorScheme='red'
                            onClick={remove}
                            disabled={transition.state !== 'idle'}
                            isLoading={transition.state !== 'idle'}>
                        Delete
                    </Button>
                    {
                        results.problem.createdBy == null ? <Button colorScheme='blue'
                                                                    onClick={takeOwnership}
                                                                    disabled={transition.state !== 'idle'}
                                                                    isLoading={transition.state !== 'idle'}>
                            Take ownership
                        </Button> : null
                    }
                </Stack>
            </Container>
        </Box>
    </>;
}
