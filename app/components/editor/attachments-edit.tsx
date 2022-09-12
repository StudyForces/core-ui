import {
    Button,
    Image, Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spacer,
    Stack,
    Code, Input, Alert
} from "@chakra-ui/react";
import type ProblemAttachment from "~/types/ProblemAttachment";
import {useState} from "react";
import {GraphQLClient} from "@pkasila/graphql-request-fetch";

function CreateAttachmentRow({ append }: { append: (attachment: ProblemAttachment) => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const upload = async () => {
        if (file === null) {
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const client = new GraphQLClient('https://uploads-sf.pkasila.net/graphql');
            let results: any = await client.request(`mutation CreateUpload($upload: CreateUpload) {
            upload: create(upload: $upload) {
                location
                uploadURL
            }
        }`, {
                upload: {
                    contentType: file.type,
                    uploadType: 'ATTACHMENT'
                }
            });

            const res = await fetch(results.upload.uploadURL, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type
                },
                body: file
            })
            if (!res.ok) {
                throw Error('Failed uploading file');
            }

            results = await client.request(`query GetUplaod($fileName: String) {
            upload(file: $fileName) {
                fileName: location
                url: signedURL
            }
        }`, {
                fileName: results.upload.location
            });

            append(results.upload);
        } catch(e: any) {
            setError(e.message);
        }
        setLoading(false);
    }

    return <>
        {
            error && <Alert status={'error'}>
                Error: {error}
            </Alert>
        }
        <Stack direction={'row'}>
            <Input type={'file'}
                   size={'sm'}
                   onChange={(event) => setFile((event.target.files ?? [])[0] ?? null)}
                   accept="image/*"></Input>
            <Button size={'sm'} isLoading={loading} disabled={file === null} onClick={upload}>Add</Button>
        </Stack>
    </>;
}

export default function AttachmentsEdit({
                                         attachments,
                                         onChange
                                     }: { attachments: ProblemAttachment[], onChange: (attachments: ProblemAttachment[]) => void }) {
    const remove = (idx: number) => {
        const a = Array.from(attachments);
        a.splice(idx, 1);
        onChange(a);
    }

    const append = (a: ProblemAttachment) => {
        onChange([a, ...attachments]);
    }

    return <Stack
        direction={'column'}
        spacing={4}>
        <CreateAttachmentRow append={append}></CreateAttachmentRow>
        {
            attachments.map((attachment, idx) => <Stack key={attachment.fileName} direction={'row'} align={'center'}>
                <Image boxSize={'3em'}
                       fit={'cover'}
                       border='1px' borderColor='gray.300'
                       rounded="lg"
                       src={attachment.url}></Image>
                <Code>
                    {attachment.fileName}
                </Code>
                <Spacer></Spacer>
                <Menu>
                    <MenuButton as={Button} colorScheme='brand' size={'sm'}>
                        Actions
                    </MenuButton>
                    <MenuList py={0} fontSize={'sm'}>
                        <MenuItem as={'a'} target={'_blank'} href={attachment.url}>
                            View
                        </MenuItem>
                        <MenuItem onClick={() => remove(idx)}>
                            Remove
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Stack>)
        }
    </Stack>;
}
