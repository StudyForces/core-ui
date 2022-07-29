import { DeleteIcon } from "@chakra-ui/icons";
import { 
    HStack,
    IconButton, 
    Input, 
    Radio, 
    RadioGroup, 
    Stack, 
    Textarea,
    useColorModeValue
} from "@chakra-ui/react"
import ReactKatex from "@pkasila/react-katex"
import { IoPencilSharp } from "react-icons/io5";
import ProblemSolveType from "~/types/solve/problem-solve-type";
import ProblemSolveVariantType from "~/types/solve/problem-solve-variant-type";
import SectionCard from "../problems/section-card"

export default function ProblemSolveSection(props: any) {
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
        if(solverMetadata.type === ProblemSolveType.FORMULA) {
            return (
                <div>
                    <ReactKatex breakLine={true} strict={false} children={`$${solverMetadata.formula ?? ''}$`}></ReactKatex>
                    <Textarea
                        mt={3}
                        onChange={handleFormulaChange}
                        placeholder='Formula...'
                    />
                </div>
            )
        } else if(solverMetadata.type === ProblemSolveType.CT_A) {
            return (
                <div>
                    <IconButton
                        mt={3}
                        size={'sm'}
                        variant={useColorModeValue('solid', 'outline')}
                        colorScheme='brand'
                        aria-label='Add new variant'
                        icon={<IoPencilSharp />}
                        onClick={() => addVariant()}
                    />

                    <RadioGroup 
                        onChange={setCorrectVariant} 
                        value={solverMetadata.correct ? solverMetadata.correct.index : 0}>
                        {
                            solverMetadata.variants.map((variant: any, index: number) => 
                                <HStack key={index} mt={2}>
                                    <Radio value={index} />
                                    <Input 
                                        maxW='35%'
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleVariantChange(e, index)} 
                                        placeholder='Variant...' />
                                    <IconButton
                                        mt={3}
                                        size={'sm'}
                                        variant={useColorModeValue('solid', 'outline')}
                                        colorScheme='brand'
                                        aria-label='Delete variant'
                                        icon={<DeleteIcon />}
                                        onClick={() => removeVariant(index)}
                                    />
                                </HStack>
                            )
                        }
                    </RadioGroup>
                </div>
            )
        } else if(solverMetadata.type === ProblemSolveType.CT_B) {
            return (
                <div>
                    <Input
                        mt={3} 
                        type='number' 
                        onChange={handleNumberChange} 
                        placeholder='Number...' />
                </div>
            )
        }
    }

    return (
        <SectionCard title={'Solve'}>
            <RadioGroup onChange={setType} value={solverMetadata.type}>
                <Stack direction='row'>
                    <Radio value={ProblemSolveType.FORMULA}>Formula</Radio>
                    <Radio value={ProblemSolveType.CT_A}>CT-A</Radio>
                    <Radio value={ProblemSolveType.CT_B}>CT-B</Radio>
                </Stack>
            </RadioGroup>

            {solveContent()}
        </SectionCard>
    )
}