import {
    InputGroup,
    Button,
    HStack,
    ButtonGroup,
    IconButton,
    Input,
    InputRightAddon,
    Center
} from '@chakra-ui/react';
import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';

export default function PaginationComponent(props: any) {
    const {currentPage} = props;

    const [page, setPage] = useState('');
    const [isInvalidPage, setIsInvalidPage] = useState(false);
    const navigate = useNavigate();

    const setPreviousPage = () => {
        navigate(`/problems/?page=${currentPage-1}`);
    }

    const setNextPage = () => {
        navigate(`/problems/?page=${currentPage+1}`);
    }

    const handlePageChange = (e: any) => {
        const pageInput: string = e.target.value;
        
        const nums = '0123456789';
        if(pageInput.length === 0 || 
            (nums.includes(pageInput[pageInput.length-1]) &&
            pageInput[0] != "0")) {
            setPage(e.target.value);
        }
    }

    const openPage = () => {
        navigate(`/problems/?page=${parseInt(page, 10)-1}`);
    }

    return (
        <Center>
            <HStack pt={4}>
                <ButtonGroup isAttached variant='outline'>
                    <IconButton 
                        aria-label='previous-page' 
                        icon={<BiLeftArrowAlt />} 
                        disabled={!currentPage}
                        onClick={setPreviousPage} />
                    <Button>{currentPage+1} of 35</Button>
                    <IconButton 
                        aria-label='next-page' 
                        icon={<BiRightArrowAlt />} 
                        onClick={setNextPage} />
                </ButtonGroup>

                <InputGroup>
                    <Input 
                        isInvalid={isInvalidPage}
                        value={page} 
                        placeholder='Open page'
                        onChange={handlePageChange} />
                    <InputRightAddon>
                        <Button 
                            disabled={false} 
                            variant='link'
                            onClick={openPage}>Go</Button>
                    </InputRightAddon>
                </InputGroup>
            </HStack>
        </Center>
    )
}