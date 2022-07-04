import {Authenticator} from "remix-auth";
import {sessionStorage} from "~/services/session.server";
import type User from "~/services/user";
import {KeycloakStrategy} from "~/services/keycloak-strategy";

let authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
    new KeycloakStrategy(
        {
            domain: 'keycloak.pkasila.net',
            realm: 'StudyForces',
            clientID: CLIENT_ID ?? 'core',
            clientSecret: CLIENT_SECRET ?? '',
            callbackURL: `${KC_CB_BASE ?? 'https://coreui-sf.pkasila.net'}/auth/keycloak/callback`,
        },
        async ({accessToken, refreshToken, extraParams, profile, context}) => {
            // here you can use the params above to get the user and return it
            // what you do inside this and how you find the user is up to you

            let user: User = {
                displayName: profile.displayName,
                emails: profile.emails,
                id: profile.id,
                name: {
                    familyName: profile.name.familyName,
                    givenName: profile.name.givenName
                },
                _token: {
                    accessToken,
                    refreshToken,
                }
            };

            return user;
        }
    ),
    "sf-keycloak"
);

export default authenticator;
