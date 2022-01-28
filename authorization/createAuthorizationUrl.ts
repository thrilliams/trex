import { Scope, parseScope } from '../types/scope.ts';
import { encodeParams } from '../utility/encodeParams.ts';

/**
 * Creates a Spotify authorization URL.
 * @param {string} clientId The client ID.
 * @param {object} options The options for the authorization URL.
 * @param {string} options.redirectUri The redirect URI.
 * @param {Scope} options.scope The scope or scopes to authorize.
 * @param {boolean} options.showDialog Whether or not to force the authorization dialog.
 * @returns {object} The authorization URL and the state.
 */
export function createAuthorizationUrl(
    clientId: string,
    options: { redirectUri?: string; scope?: Scope; showDialog?: boolean; responseType?: string }
) {
    const {
        redirectUri = 'http://0.0.0.0:8000',
        scope = 0,
        showDialog = false,
        responseType = 'code'
    } = options;
    const state = crypto.randomUUID();
    return {
        authorizationUrl: `https://accounts.spotify.com/authorize?${encodeParams({
            client_id: clientId,
            response_type: responseType,
            redirect_uri: redirectUri,
            state: state,
            scope: parseScope(scope),
            show_dialog: showDialog
        })}`,
        state
    };
}
