export default interface User {
    accessToken: string;
    id: string;
    displayName: string;
    name: {
        familyName: string;
        givenName: string;
    };
    emails: Array<{ value: string }>;
}
