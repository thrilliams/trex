import { encodeParams } from '../utility/encodeParams.ts';
import { openPage } from '../utility/openPage.ts';
import { handleCallback } from '../utility/handleCallback.ts';
import { encode } from '../deps.ts';
import { StandardToken } from '../types/token.ts';
import { Scope } from '../types/scope.ts';
import { createAuthorizationUrl } from './createAuthorizationUrl.ts';

/**
 * Creates a Spotify authorization code.
 * @param clientId The client ID.
 * @param {object} options The options for the authorization URL.
 * @param {string} options.redirectUri The redirect URI.
 * @param {Scope} options.scope The scope or scopes to authorize.
 * @param {boolean} options.showDialog Whether or not to force the authorization dialog.
 * @returns The access code used to obtain a token.
 */
async function requestUserAuthorization(
    clientId: string,
    options: { redirectUri?: string; scope?: Scope; showDialog?: boolean }
): Promise<string> {
    const { redirectUri = 'http://0.0.0.0:8000', scope = 0, showDialog = false } = options;
    const { authorizationUrl, state } = createAuthorizationUrl(clientId, {
        redirectUri,
        scope,
        showDialog
    });

    openPage(authorizationUrl);
    const codeReq = await handleCallback(redirectUri);
    const params = new URL(codeReq.url).searchParams;
    if (state !== params.get('state')) throw new Error('State mismatch!');
    if (params.get('error')) throw new Error(params.get('error') || 'Unknown error');

    return params.get('code')!;
}

/**
 * Transforms an access code into an access token.
 * @param clientId The client ID.
 * @param clientSecret The client secret.
 * @param code The access code obtained from user authentication.
 * @returns An access token.
 */
async function requestToken(
    clientId: string,
    clientSecret: string,
    code: string
): Promise<StandardToken> {
    const tokenReq = await fetch(
        `https://accounts.spotify.com/api/token?${encodeParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'http://0.0.0.0:8000'
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
        type: 'standard',
        refreshToken: json.refresh_token
    };
}

/**
 * Refreshes an access token.
 * @param clientId The client ID.
 * @param clientSecret The client secret.
 * @param token The refresh token obtained from user authentication.
 * @returns A new access token.
 */
async function refreshToken(
    clientId: string,
    clientSecret: string,
    token: string
): Promise<StandardToken> {
    const tokenReq = await fetch(
        `https://accounts.spotify.com:443/api/token?${encodeParams({
            grant_type: 'refresh_token',
            refresh_token: token
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
        type: 'standard',
        refreshToken: json.refresh_token
    };
}

/**
 * Authorizes the app with the Authorization Code Flow.
 * @param clientId The client ID.
 * @param clientSecret The client secret.
 * @param scope The scope or scopes to authorize.
 * @returns An access token.
 */
export async function authorize(
    clientId: string,
    clientSecret: string,
    scope: Scope = 0,
    token?: StandardToken
): Promise<StandardToken> {
    if (token === undefined) {
        const code = await requestUserAuthorization(clientId, { scope });
        return await requestToken(clientId, clientSecret, code);
    }

    if (token.expiry.getTime() >= Date.now()) {
        return await refreshToken(clientId, clientSecret, token.refreshToken);
    }

    return token;
}
