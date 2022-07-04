export default interface User {
    id: string;
    displayName: string;
    name: {
        familyName: string;
        givenName: string;
    };
    emails: Array<{ value: string }>;
    roles: string[];
    expiration: number;
    _token: {
        accessToken: string;
        refreshToken: string;
    }
}
