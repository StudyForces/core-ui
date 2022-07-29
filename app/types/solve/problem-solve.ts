import type ProblemSolveType from "./problem-solve-type";
import type ProblemSolveVariant from "./problem-solve-variant";

export default interface ProblemSolve {
    type?: ProblemSolveType,
    variants?: ProblemSolveVariant[],
    correct?: ProblemSolveVariant,
    formula?: string
}
