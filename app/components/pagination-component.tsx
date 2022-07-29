import {
    InputGroup,
    Button,
    ButtonGroup,
    IconButton,
    Input,
    InputRightAddon,
    ScaleFade,
    Stack
} from '@chakra-ui/react';
import {BiLeftArrowAlt, BiRightArrowAlt} from 'react-icons/bi';
import {useNavigate} from '@remix-run/react';
import {FormEvent, useState} from 'react';

export default function PaginationComponent(props: any) {
    const {url, currentPage, totalElements, size} = props;

    const [page, setPage] = useState('');
    const [isOpenPageSercher, setIsOpenPageSercher] = useState(false);
    const navigate = useNavigate();
    const pagesCount = Math.ceil(totalElements / size) === 0 ? 1 : Math.ceil(totalElements / size);

    const navigatePage = (pageNum: number) => {
        let params = new URLSearchParams(url.search);
        params.set('page', pageNum.toString());
        navigate(`?${params.toString()}`);
    }

    const pageSearcher = () => {
        const enabled = !isNaN(parseInt(page)) && parseInt(page) <= pagesCount && parseInt(page) > 0;

        const navigate = (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            navigatePage(page.length ? (parseInt(page, 10) - 1) : 0)
        };

        return (
            <form onSubmit={enabled ? navigate : (event) => {event.preventDefault()}}>
                <InputGroup>
                    <Input
                        name={'page'}
                        value={page}
                        placeholder='Page number...'
                        onChange={(e) => setPage(e.target.value)}/>
                    <InputRightAddon p={0}>
                        <Button type={'submit'}
                                colorScheme={'brand'}
                                disabled={!enabled}
                                borderLeftRadius={0}>Go</Button>
                    </InputRightAddon>
                </InputGroup>
            </form>
        )
    }

    return (
        <Stack direction={['column', 'row']} pt={4}>
            <ButtonGroup isAttached variant='outline' alignItems={'center'}>
                {
                    currentPage ? <IconButton
                        aria-label='previous-page'
                        icon={<BiLeftArrowAlt/>}
                        onClick={() => navigatePage(currentPage - 1)} /> : null
                }

                <Button
                    title={'Search page'}
                    onClick={() => setIsOpenPageSercher(!isOpenPageSercher)}>
                    {currentPage + 1} of {pagesCount}
                </Button>

                {
                    currentPage + 1 !== pagesCount ? <IconButton
                        aria-label='next-page'
                        icon={<BiRightArrowAlt/>}
                        onClick={() => navigatePage(currentPage + 1)} /> : null
                }
            </ButtonGroup>

            <ScaleFade initialScale={0.9} in={isOpenPageSercher}>
                {pageSearcher()}
            </ScaleFade>
        </Stack>
    )
}
