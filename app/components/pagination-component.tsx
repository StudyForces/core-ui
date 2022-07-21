import {
    InputGroup,
    Button,
    HStack,
    ButtonGroup,
    IconButton,
    Input,
    InputRightAddon,
    Center,
    Popover,
    PopoverTrigger,
    PopoverContent
} from '@chakra-ui/react';
import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';

export default function PaginationComponent(props: any) {
    const {url, currentPage, totalElements, size} = props;

    const [page, setPage] = useState('');
    const navigate = useNavigate();
    const pagesCount = Math.ceil(totalElements/size);

    const setPreviousPage = () => {
        navigate(`${url}?page=${currentPage-1}`);
    }

    const setNextPage = () => {
        navigate(`${url}?page=${currentPage+1}`);
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
        navigate(`${url}?page=${page.length ? (parseInt(page, 10)-1) : 0}`);
    }

    const pageSearcher = () => {
        return(
            <InputGroup>
                <Input 
                    value={page} 
                    placeholder='Open page'
                    onChange={handlePageChange} />
                <InputRightAddon>
                    <Button 
                        disabled={parseInt(page)>pagesCount} 
                        variant='link'
                        onClick={openPage}>Go</Button>
                </InputRightAddon>
            </InputGroup>
        )
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

                    <Popover placement='top'>
                        <PopoverTrigger>
                            <Button 
                                title={'Search page'}>
                                    {currentPage+1} of {pagesCount}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            {pageSearcher()}
                        </PopoverContent>
                    </Popover>
                    
                    <IconButton 
                        aria-label='next-page' 
                        disabled={currentPage+1 === pagesCount}
                        icon={<BiRightArrowAlt />} 
                        onClick={setNextPage} />
                </ButtonGroup>            
                    
            </HStack>
        </Center>
    )
}