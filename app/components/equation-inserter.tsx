import { 
    Button, 
    Center, 
    Checkbox, 
    HStack, 
    Input,
    Popover, 
    PopoverBody, 
    PopoverContent, 
    PopoverHeader, 
    PopoverTrigger, 
    Text, 
    useColorModeValue, 
    useToast, 
    VStack
} from "@chakra-ui/react";
import ReactKatex from "@pkasila/react-katex";
import { useEffect, useState } from "react";
import { equations } from "./equations";

export default function EquationInserter() {
    const [search, setSearch] = useState("");
    const [caseSensitive, setCaseSensitive] = useState(false);
    const [equationsShow, setEquationsShow] = useState(equations);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);

    }

    const handleCaseSensitiveChange = (event: any) => {
        setCaseSensitive(event.target.checked);
    }

    const onCopyEquationClick = (equation: string) => {
        navigator.clipboard.writeText(equation);
    }

    useEffect(() => {
        setEquationsShow([]);
        const equationsShow: any = [];
        equations.forEach((equation: string) => {
            const subEquation: string = caseSensitive ?
            equation : equation.toLowerCase();
            const subSearch: string = caseSensitive ?
            search : search.toLowerCase();
            if(subEquation.includes(subSearch)) {
                equationsShow.push(equation);
            }
        });

        setEquationsShow(equationsShow);
    }, [search, caseSensitive]);
    
    return (
        <Popover placement="bottom-start" isLazy>
            <PopoverTrigger>
                <Button variant={useColorModeValue('solid', 'outline')} size='sm' w='min-content'>Equations</Button>
            </PopoverTrigger>
            <PopoverContent w={'250px'}>
                <PopoverHeader>
                    <Input onChange={handleSearchChange} placeholder='Equation...' />
                    <Checkbox mt={1} onChange={handleCaseSensitiveChange}>Case sensitive</Checkbox>
                </PopoverHeader>
                <PopoverBody>
                    <VStack height={'200px'} style={{overflowY: 'scroll'}}>
                        {
                            equationsShow.length !== 0 ? 
                                equationsShow.map((equation: string) => 
                                    <HStack
                                        key={equation}
                                        onClick={() => onCopyEquationClick(equation)}
                                        w={'100%'} 
                                        p={1} 
                                        borderRadius='8px' 
                                        cursor={'pointer'} 
                                        _hover={{bgColor: useColorModeValue('gray.300', 'gray.600')}}>
                                        <ReactKatex breakLine={true} strict={false} children={`$${equation}$`} />
                                        <Text color={'gray.500'} fontSize={'md'} noOfLines={1}>{equation}</Text>
                                    </HStack>
                                ) : 
                                <Center>
                                    <Text fontSize={'md'}>Nothing was found</Text>
                                </Center>
                        }
                    </VStack>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}