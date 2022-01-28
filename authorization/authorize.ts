import { authorize } from './standard.ts';
import { authorizeImplicit } from './implicit.ts';
import { authorizeCredentials } from './credentials.ts';
import { Scope } from '../types/scope.ts';
import { Token, StandardToken, ImplicitToken, CredentialsToken } from '../types/token.ts';

let token: Token;

export async function getToken(
    mode: 'standard' | 'implicit' | 'credentials',
    { clientId, clientSecret }: { clientId: string; clientSecret: string },
    scope: Scope = 0
): Promise<Token> {
    if (token !== undefined && token.type === mode && Date.now() < token.expiry.getTime())
        return token;

    switch (mode) {
        case 'standard':
            token = await authorize(clientId, clientSecret, scope, token as StandardToken);
            break;
        case 'implicit':
            token = await authorizeImplicit(clientId, scope, token as ImplicitToken);
            break;
        case 'credentials':
            token = await authorizeCredentials(clientId, clientSecret, token as CredentialsToken);
            break;
    }

    return token;
}
