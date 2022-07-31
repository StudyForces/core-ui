import type Problem from "~/types/problem";
import {Button, Box, Heading, Alert, AlertIcon, Stack} from "@chakra-ui/react";
import {useFetcher} from "@remix-run/react";
import type ProblemSolve from "~/types/solve/problem-solve";
import {useState} from "react";
import SolveProblemContent from "./solve-problem/solve-problem-content";

export default function SolveProblem({problem}: {problem: Problem}) {
    const [solved, setSolved] = useState<ProblemSolve | null>();

    const fetcher = useFetcher();

    const checkSolution = () => {
        fetcher.submit({
            solved: JSON.stringify(solved)
        }, {
            method: "post",
            action: `/problems/${problem.id}`
        });
    }

    return <Stack direction={'column'} spacing={4}>
        <Heading
            noOfLines={1}
            fontSize={'xl'}>
            Solve
        </Heading>
        <SolveProblemContent solve={problem.solverMetadata!}
                             setSolved={setSolved}></SolveProblemContent>
        {
            fetcher.data !== undefined ? <Alert status={fetcher.data.correct ? 'success' : 'error'}
                                                borderRadius={'md'}>
                <AlertIcon />
                {
                    fetcher.data.correct ? 'Congratulations! You\'ve solved this problem correctly.' :
                        'Oops! Seems like you\'ve made a mistake, try again.'
                }
            </Alert> : null
        }
        <Box>
            <Button onClick={checkSolution} colorScheme={'brand'} disabled={!solved?.type}
                    size={'sm'} isLoading={fetcher.state !== 'idle'}>
                Submit
            </Button>
        </Box>
    </Stack>;
}
