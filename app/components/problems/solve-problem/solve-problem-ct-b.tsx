import {FormControl, FormErrorMessage, FormHelperText, Input} from "@chakra-ui/react";
import React, {useState} from "react";
import ProblemSolveVariantType from "~/types/solve/problem-solve-variant-type";
import type SolveProblemProps from "~/components/problems/solve-problem/solve-problem-props";
import type ProblemSolve from "~/types/solve/problem-solve";

export default function SolveProblemCtB({solve, setSolved, disabled}: SolveProblemProps) {
    const [error, setError] = useState(false);

    const update = (e: string) => {
        if (disabled && setSolved) {
            return;
        }

        let baseObj: ProblemSolve = {
            type: solve.type,
            correct: {
                type: ProblemSolveVariantType.STRING
            }
        };

        if (solve.correct?.type === ProblemSolveVariantType.NUMBER && !isNaN(parseFloat(e))) {
            baseObj.correct = {...baseObj.correct, type: ProblemSolveVariantType.NUMBER, number: parseFloat(e)};
        } else if (solve.correct?.type === ProblemSolveVariantType.STRING) {
            baseObj.correct = {...baseObj.correct, type: ProblemSolveVariantType.STRING, string: e};
        } else {
            setError(true);
            if (setSolved) {
                setSolved(null);
            }
            return;
        }

        setError(false);
        if (setSolved) {
            setSolved(baseObj);
        }
    };

    return <FormControl isInvalid={error}>
        <Input
            disabled={disabled || !setSolved}
            type={solve.correct?.type === ProblemSolveVariantType.NUMBER ? 'number' : undefined}
            onChange={e => update(e.target.value)}
            placeholder='Enter your answer...'/>
        {
            error ? <FormErrorMessage>
                Something is wrong with your value.
                {solve.correct?.type === ProblemSolveVariantType.NUMBER ? 'It must be a number.' : null}
            </FormErrorMessage> : (solve.correct?.type === ProblemSolveVariantType.NUMBER ? <FormHelperText>
                The answer should be a number
            </FormHelperText> : null)
        }
    </FormControl>;
}
