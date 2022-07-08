import {Box, Text} from "@chakra-ui/react";
import {ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery} from '@apollo/client';
import Tree from "~/components/editor/tags-selector/tree";
import type Tag from "~/types/Tag";

const client = new ApolloClient({
    uri: 'https://coreapi-sf.pkasila.net/graphql',
    cache: new InMemoryCache(),
});

const GET_ALL_TAGS = gql`
  query GetAllTags {
    tags {
        id
        color
        title
        parent {
            id
        }
    }
  }
`;

function Selector({tags, onChange}: {tags: Tag[], onChange: (tags: Tag[]) => void}) {
    const {loading, error, data} = useQuery(GET_ALL_TAGS);
    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error :(</Text>;

    return <Tree selected={tags} tags={data.tags} onChange={onChange}></Tree>;
}

export default function TagsSelector({tags, onChange}: {tags: Tag[], onChange: (tags: Tag[]) => void}) {
    return <ApolloProvider client={client}>
        <Selector tags={tags} onChange={onChange}/>
    </ApolloProvider>;
}
