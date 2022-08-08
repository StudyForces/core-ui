import type SolveProblemProps from "~/components/problems/solve-problem/solve-problem-props";
import AegoliusFormulaInput from "~/components/aegolius-formula-input";

export default function SolveProblemFormula({solve, setSolved, disabled}: SolveProblemProps) {
    const update = (formula: string) => {
        if (setSolved && !disabled) {
            setSolved({
                type: solve.type,
                formula: formula,
            });
        }
    };

    return !disabled ? <AegoliusFormulaInput formula={solve.formula ?? ''} setFormula={update} /> : 'Preview is not available';
}
