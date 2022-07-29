import { DeleteIcon } from "@chakra-ui/icons";
import {
    Button,
    HStack,
    IconButton,
    Input,
    Radio,
    RadioGroup, Select,
    Textarea,
    useColorModeValue
} from "@chakra-ui/react"
import ReactKatex from "@pkasila/react-katex"
import { IoPencilSharp } from "react-icons/io5";
import ProblemSolveType from "~/types/solve/problem-solve-type";
import ProblemSolveVariantType from "~/types/solve/problem-solve-variant-type";
import SectionCard from "../problems/section-card"

export default function ProblemSolveSection(props: any) {
    const buttonVariant = useColorModeValue('solid', 'outline');

    const {solverMetadata, setSolverMetadata} = props;
    const emptySolverMetadata = {
        type: ProblemSolveType.FORMULA,
        variants: [],
        correct: null,
        formula: null
    };

    const setType = (type: any) => {
        const _solverMetadata = {...emptySolverMetadata, type};

        setSolverMetadata(_solverMetadata);
    }

    const handleFormulaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const _solverMetadata = {...solverMetadata, formula: e.target.value};

        setSolverMetadata(_solverMetadata);
    }

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const _solverMetadata = {
            ...solverMetadata,
            correct: {
                type: ProblemSolveVariantType.NUMBER,
                number: input ? parseInt(e.target.value) : null,
                string: null,
                index: null
            }
        };

        setSolverMetadata(_solverMetadata);
    }

    const handleVariantChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        let _solverMetadata = {...solverMetadata};
        let variantToChange = solverMetadata.variants[index];
        variantToChange.string = e.target.value;
        _solverMetadata.variants[index] = variantToChange;

        setSolverMetadata(_solverMetadata);
    }

    const setCorrectVariant = (variant: any) => {
        let _solverMetadata = {...solverMetadata};
        _solverMetadata.correct.index = parseInt(variant);

        setSolverMetadata(_solverMetadata);
    }

    const addVariant = () => {
        let _solverMetadata = {...solverMetadata};
        if(_solverMetadata.variants.length === 0) {
            _solverMetadata.correct = {
                type: ProblemSolveVariantType.INDEX,
                number: null,
                string: null,
                index: 0
            }
        }

        _solverMetadata.variants.push({
            type: ProblemSolveVariantType.STRING,
            number: null,
            string: "",
            index: null
        });

        setSolverMetadata(_solverMetadata);
    }

    const removeVariant = (index: number) => {
        let _solverMetadata = {...solverMetadata};
        _solverMetadata.variants.splice(index);
        if(_solverMetadata.variants.length === 0) {
            _solverMetadata.correct = null;
        } else {
            _solverMetadata.correct = {
                type: ProblemSolveVariantType.INDEX,
                number: null,
                string: null,
                index: 0
            }
        }

        setSolverMetadata(_solverMetadata);
    }

    const solveContent = () => {
        switch (solverMetadata.type) {
            case ProblemSolveType.FORMULA:
                return <div>
                    <ReactKatex breakLine={true} strict={false} children={`$${solverMetadata.formula ?? ''}$`}></ReactKatex>
                    <Textarea
                        mt={3}
                        onChange={handleFormulaChange}
                        placeholder='Formula...'
                    />
                </div>;
            case ProblemSolveType.CT_A:
                const variants = solverMetadata?.variants ?? [];

                return <>
                    <RadioGroup
                        onChange={setCorrectVariant}
                        value={solverMetadata.correct ? solverMetadata.correct.index : 0}>
                        {
                            variants.map((variant: any, index: number) =>
                                <HStack key={index} mt={2}>
                                    <Radio value={index} />
                                    <Input
                                        maxW={300}
                                        defaultValue={variant.string}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleVariantChange(e, index)}
                                        placeholder='Variant...' />
                                    <IconButton
                                        mt={3}
                                        size={'sm'}
                                        variant={buttonVariant}
                                        colorScheme='red'
                                        aria-label='Delete variant'
                                        icon={<DeleteIcon />}
                                        onClick={() => removeVariant(index)}
                                    />
                                </HStack>
                            )
                        }
                    </RadioGroup>
                    <Button
                        mt={3}
                        size={'sm'}
                        variant={buttonVariant}
                        colorScheme='brand'
                        aria-label='Add new variant'
                        leftIcon={<IoPencilSharp />}
                        disabled={!(variants.slice(-1)[0]?.string?.length > 0 || variants.length === 0)}
                        onClick={() => addVariant()}
                    >
                        Add new option
                    </Button>
                </>;
            case ProblemSolveType.CT_B:
                return <Input
                    maxW={300}
                    defaultValue={solverMetadata.correct?.number}
                    mt={3}
                    type='number'
                    onChange={handleNumberChange}
                    placeholder='Number...' />;
            default:
                return <>Unknown type</>;
        }
    }

    return (
        <SectionCard title={'Solve'}>
            <Select onChange={(e) => setType(e.target.value)} value={solverMetadata.type}>
                <option value={ProblemSolveType.FORMULA}>Formula</option>
                <option value={ProblemSolveType.CT_A}>ЦТ (часть A)</option>
                <option value={ProblemSolveType.CT_B}>ЦТ (часть B)</option>
            </Select>

            {solveContent()}
        </SectionCard>
    )
}
