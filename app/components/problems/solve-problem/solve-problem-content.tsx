import type SolveProblemProps from "~/components/problems/solve-problem/solve-problem-props";
import ProblemSolveType from "~/types/solve/problem-solve-type";
import SolveProblemCtA from "~/components/problems/solve-problem/solve-problem-ct-a";
import SolveProblemCtB from "~/components/problems/solve-problem/solve-problem-ct-b";
import SolveProblemFormula from "~/components/problems/solve-problem/solve-problem-formula";

export default function SolveProblemContent({solve, setSolved}: SolveProblemProps) {
    switch(solve.type) {
        case ProblemSolveType.CT_A:
            return <SolveProblemCtA solve={solve} setSolved={setSolved}></SolveProblemCtA>;
        case ProblemSolveType.CT_B:
            return <SolveProblemCtB solve={solve} setSolved={setSolved}></SolveProblemCtB>;
        case ProblemSolveType.FORMULA:
            // TODO: add formula UI
            return <SolveProblemFormula solve={solve} setSolved={setSolved}></SolveProblemFormula>;
    }
    return <>Unknown type</>;
}
