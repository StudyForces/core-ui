import type {ActionFunction} from "@remix-run/cloudflare";
import tokenCheck from "~/services/token-check";
import {GraphQLClient} from "@ninetailed/cf-worker-graphql-request";
import {redirect} from "@remix-run/cloudflare";

export const action: ActionFunction = async ({ request, params }) => {
    const data = await request.formData();

    const user = await tokenCheck(request);

    let query: string;
    let variables: any = {
        id: params.problemId
    };
    let redirectPath: string = data.get('url') as string || '/editor/problems';

    const headers: any = {};

    if ((user?.roles || []).includes('editor')) {
        headers['Authorization'] = `Bearer ${user?._token.accessToken}`;
    } else {
        return redirect('');
    }

    switch(request.method.toLowerCase()) {
        case 'delete':
            query = `mutation ProblemDelete($id: ID!) {
    deleteProblem(id: $id)
}`;
            break;
        case 'post':
            query = `mutation ProblemUpdate($id: ID!, $input: ProblemInput) {
    updateProblem(id: $id, input: $input) {
        id
    }
}`;
            break;
        case 'put':
            variables["published"] = data.get('published') === 'true';
            query = `mutation ProblemPublish($id: ID!, $published: Boolean) {
    publishProblem(id: $id, published: $published) {
        id
    }
}`;
            break;
        default:
            return redirect('');
    }

    const client = new GraphQLClient('https://coreapi-sf.pkasila.net/graphql', { headers });
    await client.request(query, variables);

    return redirect(redirectPath);
}
