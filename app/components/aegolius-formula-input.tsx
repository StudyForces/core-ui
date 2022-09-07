import ReactKatex from "@pkasila/react-katex";
import {Skeleton, Textarea} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import useDebounce from "~/utils/useDebounce";
import aegoliusConfig from "~/aegolius-config.json";

export default function AegoliusFormulaInput({formula, setFormula}: {formula: string, setFormula: (f: string) => void}) {
    const [currentFormula, setCurrentFormula] = useState(formula ?? '');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState({output: formula});
    const debouncedFormula = useDebounce(currentFormula, 500);

    useEffect(() => {
        if (debouncedFormula.length === 0) {
            setResult({output: '\\text{empty}'});
            return;
        }

        setLoading(true);
        fetch(`https://aegolius.pkasila.net/api/formulas/evaluate`, {
            method: 'POST',
            headers: {
                'Authorization': `Aegolius ${aegoliusConfig.auth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({input: debouncedFormula})
        })
            .then(r => {
                if (r.ok) {
                    return r.json();
                }
                return {output: '\\text{syntax error}', unset: true};
            })
            .then((r) => {
                const res: {output: string; unset?: boolean;} = r as any;
                setResult(res);
                !res.unset && setFormula(debouncedFormula);
                setLoading(false);
            });
    }, [debouncedFormula]);

    return <>
        <Skeleton isLoaded={!loading}>
            <ReactKatex breakLine={true} strict={false} children={`$$${result.output ?? formula ?? ''}$$`}></ReactKatex>
        </Skeleton>
        <Textarea
            value={currentFormula}
            onChange={(e) => setCurrentFormula(e.target.value)}
            placeholder='Formula...'
        />
    </>;
}
