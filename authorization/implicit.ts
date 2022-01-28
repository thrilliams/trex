import { openPage } from '../utility/openPage.ts';
import { handleCallback } from '../utility/handleCallback.ts';
import { ImplicitToken } from '../types/token.ts';
import { Scope } from '../types/scope.ts';
import { createAuthorizationUrl } from './createAuthorizationUrl.ts';

/**
 * Requests an access token.
 * @param clientId The client ID.
 * @param {object} options The options for the authorization URL.
 * @param {string} options.redirectUri The redirect URI.
 * @param {Scope} options.scope The scope or scopes to authorize.
 * @param {boolean} options.showDialog Whether or not to force the authorization dialog.
 * @returns The access token.
 */
async function requestToken(
    clientId: string,
    options: { redirectUri?: string; scope?: Scope; showDialog?: boolean }
): Promise<ImplicitToken> {
    const { redirectUri = 'http://0.0.0.0:8000', scope = 0, showDialog = false } = options;
    const { authorizationUrl, state } = createAuthorizationUrl(clientId, {
        redirectUri,
        scope,
        showDialog,
        responseType: 'token'
    });

    openPage(authorizationUrl);
    const codeReq = await handleCallback(redirectUri + '/callback');
    const params = new URL(codeReq.url).searchParams;
    if (state !== params.get('state')) throw new Error('State mismatch!');
    if (params.get('error')) throw new Error(params.get('error') || 'Unknown error');

    return {
        type: 'implicit',
        accessToken: params.get('access_token')!,
        expiry: new Date(Date.now() + parseInt(params.get('expires_in')!) * 1000)
    };
}

/**
 * Authorizes the app with the Implicit Grant Flow.
 * @param clientId The client ID.
 * @param clientSecret The client secret. (Unused in Implicit Grant Flow)
 * @param scope The scope or scopes to authorize.
 * @returns An access token.
 */
export async function authorizeImplicit(
    clientId: string,
    scope: Scope = 0,
    token?: ImplicitToken
): Promise<ImplicitToken> {
    if (token === undefined || token.expiry.getTime() >= Date.now()) {
        return await requestToken(clientId, { scope });
    }

    return token;
}
