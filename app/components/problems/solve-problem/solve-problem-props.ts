import type ProblemSolve from "~/types/solve/problem-solve";

export default interface SolveProblemProps {
    solve: ProblemSolve,
    setSolved?: (solve: ProblemSolve | null) => void,
    disabled?: boolean
}
