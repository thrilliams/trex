/**
 * Scope represents the Spotify application scopes numerically. Scopes can be combined with a boolean OR operation: |
 * @enum {number}
 */
export enum Scope {
    /**
     * Write access to user-provided images.
     */
    UGC_IMAGE_UPLOAD = 1 << 0,

    /**
     * Read access to a user’s player state.
     */
    USER_READ_PLAYBACK_STATE = 1 << 1,
    /**
     * Write access to a user’s playback state.
     */
    USER_MODIFY_PLAYBACK_STATE = 1 << 2,
    /**
     * Read access to a user’s currently playing content.
     */
    USER_READ_CURRENTLY_PLAYING = 1 << 3,

    /**
     * Read access to user’s subscription details (type of user account).
     */
    USER_READ_PRIVATE = 1 << 4,
    /**
     * Read access to user’s email address.
     */
    USER_READ_EMAIL = 1 << 5,

    /**
     * Write/delete access to the list of artists and other users that the user follows.
     */
    USER_FOLLOW_MODIFY = 1 << 6,
    /**
     * Read access to the list of artists and other users that the user follows.
     */
    USER_FOLLOW_READ = 1 << 7,

    /**
     * Write/delete access to a user's "Your Music" library.
     */
    USER_LIBRARY_MODIFY = 1 << 8,
    /**
     * Read access to a user's library.
     */
    USER_LIBRARY_READ = 1 << 9,

    /**
     * Control playback of a Spotify track. This scope is currently available to the Web Playback SDK. The user must have a Spotify Premium account.
     */
    STREAMING = 1 << 10,
    /**
     * Remote control playback of Spotify. This scope is currently available to Spotify iOS and Android SDKs.
     */
    APP_REMOTE_CONTROL = 1 << 11,

    /**
     * Read access to a user’s playback position in a content.
     */
    USER_READ_PLAYBACK_POSITION = 1 << 12,
    /**
     * Read access to a user's top artists and tracks.
     */
    USER_TOP_READ = 1 << 13,
    /**
     * Read access to a user’s recently played tracks.
     */
    USER_READ_RECENTLY_PLAYED = 1 << 14,

    /**
     * Write access to a user's private playlists.
     */
    PLAYLIST_MODIFY_PRIVATE = 1 << 15,
    /**
     * Include collaborative playlists when requesting a user's playlists.
     */
    PLAYLIST_READ_COLLABORATIVE = 1 << 16,
    /**
     * Read access to user's private playlists.
     */
    PLAYLIST_READ_PRIVATE = 1 << 17,
    /**
     * Write access to a user's public playlists.
     */
    PLAYLIST_MODIFY_PUBLIC = 1 << 18
}

/**
 * Parses numeric scopes into string scopes.
 * @param {Scope} scope The scope or scopes to be parsed.
 * @returns {string[]} The parsed scopes, in a format Spotify can accept.
 */
export function parseScope(scope: Scope): string[] {
    const entries = Object.entries(Scope)
        .filter(([_, value]) => typeof value === 'number')
        .reverse() as [string, number][];

    const scopes: string[] = [];
    for (const [name, value] of entries) {
        if (scope >= value) {
            scopes.push(name.toLowerCase().split('_').join('-'));
            scope -= value;
        }
    }

    return scopes.reverse();
}
