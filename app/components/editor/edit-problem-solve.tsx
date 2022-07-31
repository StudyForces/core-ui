import {DeleteIcon} from "@chakra-ui/icons";
import {
    Box,
    Button,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputLeftAddon,
    Radio,
    RadioGroup,
    Select,
    Stack,
    Textarea,
    useColorModeValue
} from "@chakra-ui/react"
import ReactKatex from "@pkasila/react-katex"
import {IoPencilSharp} from "react-icons/io5";
import ProblemSolveType from "~/types/solve/problem-solve-type";
import ProblemSolveVariantType from "~/types/solve/problem-solve-variant-type";
import SectionCard from "../problems/section-card"
import SolveProblemContent from "~/components/problems/solve-problem/solve-problem-content";
import type {ChangeEvent} from "react";

export default function EditProblemSolve(props: any) {
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

    const handleOpenAnswerTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const input = e.target.value as ProblemSolveVariantType;

        if (input === solverMetadata.correct.type) {
            return;
        }

        const _solverMetadata = {
            ...solverMetadata,
            correct: {
                type: input,
            }
        };

        switch (input) {
            case ProblemSolveVariantType.STRING:
                _solverMetadata.correct.string = solverMetadata.correct.number.toString();
                break;
            case ProblemSolveVariantType.NUMBER:
                _solverMetadata.correct.number = !isNaN(parseFloat(solverMetadata.correct.string)) ? parseFloat(solverMetadata.correct.string) : null;
                break;
        }

        setSolverMetadata(_solverMetadata);
    }

    const handleOpenAnswerChange = (e: ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const _solverMetadata = {
            ...solverMetadata,
            correct: {
                type: solverMetadata.correct.type ?? ProblemSolveVariantType.NUMBER
            }
        };

        if (_solverMetadata.correct.type === ProblemSolveVariantType.NUMBER) {
            _solverMetadata.correct.number = input ? parseFloat(e.target.value) : null
        } else {
            _solverMetadata.correct.string = input;
        }

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
                return <>
                    <ReactKatex breakLine={true} strict={false} children={`$${solverMetadata.formula ?? ''}$`}></ReactKatex>
                    <Textarea
                        onChange={handleFormulaChange}
                        placeholder='Formula...'
                    />
                </>;
            case ProblemSolveType.CT_A:
                const variants = solverMetadata?.variants ?? [];

                return <>
                    <RadioGroup
                        onChange={setCorrectVariant}
                        value={solverMetadata.correct ? solverMetadata.correct.index : 0}>
                        <Stack direction={'column'}>
                            {
                                variants.map((variant: any, index: number) =>
                                    <Stack direction={'row'} key={index} align={'center'}>
                                        <Radio value={index} />
                                        <Input
                                            defaultValue={variant.string}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleVariantChange(e, index)}
                                            placeholder='Variant...' />
                                        <IconButton
                                            size={'sm'}
                                            variant={buttonVariant}
                                            colorScheme='red'
                                            aria-label='Delete variant'
                                            icon={<DeleteIcon />}
                                            onClick={() => removeVariant(index)}
                                        />
                                    </Stack>
                                )
                            }
                        </Stack>
                    </RadioGroup>
                    <Box>
                        <Button
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
                    </Box>
                </>;
            case ProblemSolveType.CT_B:
                return <InputGroup>
                    <InputLeftAddon p={0}>
                        <Select variant='outline' borderRightRadius={0}
                                value={solverMetadata.correct?.type} onChange={handleOpenAnswerTypeChange}>
                            <option value={ProblemSolveVariantType.NUMBER}>Number</option>
                            <option value={ProblemSolveVariantType.STRING}>String</option>
                        </Select>
                    </InputLeftAddon>
                    <Input
                        value={solverMetadata.correct?.type === ProblemSolveVariantType.NUMBER ? solverMetadata.correct?.number : (solverMetadata?.correct?.string ?? '')}
                        type={solverMetadata.correct?.type === ProblemSolveVariantType.NUMBER ? 'number' : undefined}
                        onChange={handleOpenAnswerChange}
                        placeholder='Value...' />
                </InputGroup>;
            default:
                return <>Unknown type</>;
        }
    }

    return (
        <SectionCard title={'Solve'}>
            <Stack direction={'row'} spacing={4}>
                <Stack spacing={3} flex={1}>
                    <Select onChange={(e) => setType(e.target.value)} value={solverMetadata.type}>
                        <option value={ProblemSolveType.FORMULA}>Formula</option>
                        <option value={ProblemSolveType.CT_A}>ЦТ (часть A)</option>
                        <option value={ProblemSolveType.CT_B}>ЦТ (часть B)</option>
                    </Select>

                    {solveContent()}
                </Stack>
                <Box flex={1}>
                    <Heading
                        fontSize={'xl'}
                        mb={2}
                        fontFamily={'body'}>
                        Preview
                    </Heading>
                    <SolveProblemContent solve={solverMetadata}></SolveProblemContent>
                </Box>
            </Stack>
        </SectionCard>
    )
}
