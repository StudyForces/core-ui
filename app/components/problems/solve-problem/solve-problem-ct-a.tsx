import {Radio, RadioGroup, Stack} from "@chakra-ui/react";
import React from "react";
import ProblemSolveVariantType from "~/types/solve/problem-solve-variant-type";
import type SolveProblemProps from "~/components/problems/solve-problem/solve-problem-props";
import ReactKatex from "@pkasila/react-katex";

export default function SolveProblemCtA({solve, setSolved, disabled}: SolveProblemProps) {
    const update = (e: string) => {
        const idx = parseInt(e, 10);

        if (!isNaN(idx) && setSolved && !disabled) {
            setSolved({
                type: solve.type,
                correct: {
                    type: ProblemSolveVariantType.INDEX,
                    index: parseInt(e, 10)
                }
            });
        }
    };

    return <RadioGroup onChange={update} isDisabled={disabled || !setSolved}>
        <Stack direction='column'>
            {
                (solve.variants ?? []).map((variant, idx) => <Radio key={idx} value={idx.toString()}>
                    {variant.string ? <ReactKatex children={variant.string}></ReactKatex> : variant.number}
                </Radio>)
            }
        </Stack>
    </RadioGroup>;
}
