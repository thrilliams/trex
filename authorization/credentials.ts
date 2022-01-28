import { CredentialsToken } from '../types/token.ts';
import { Scope } from '../types/scope.ts';
import { encodeParams } from '../utility/encodeParams.ts';
import { encode } from '../deps.ts';

/**
 * Requests an access token.
 * @param clientId The client ID.
 * @param {object} options The options for the authorization URL.
 * @param {string} options.redirectUri The redirect URI.
 * @param {Scope} options.scope The scope or scopes to authorize.
 * @param {boolean} options.showDialog Whether or not to force the authorization dialog.
 * @returns The access token.
 */
async function requestToken(clientId: string, clientSecret: string): Promise<CredentialsToken> {
    const tokenReq = await fetch(
        `https://accounts.spotify.com/api/token?${encodeParams({
            grant_type: 'client_credentials'
        })}`,
        {
            method: 'POST',
            headers: {
                Authorization: `Basic ${encode(`${clientId}:${clientSecret}`)}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );

    const json = await tokenReq.json();
    if (json.error !== undefined) throw new Error(`${json.error}: ${json.error_description}`);

    return {
        accessToken: json.access_token,
        expiry: new Date(Date.now() + json.expires_in * 1000),
        type: 'credentials'
    };
}

/**
 * Authorizes the app with the Client Credentials Flow.
 * @param clientId The client ID.
 * @param clientSecret The client secret.
 * @param scope The scope or scopes to authorize. (Unused in the Client Credentials Flow)
 * @returns An access token.
 */
export async function authorizeCredentials(
    clientId: string,
    clientSecret: string,
    token?: CredentialsToken
): Promise<CredentialsToken> {
    if (token === undefined || token.expiry.getTime() >= Date.now()) {
        return await requestToken(clientId, clientSecret);
    }

    return token;
}
