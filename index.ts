import { getToken } from './authorization/authorize.ts';
import { Scope } from './types/scope.ts';
import keys from './keys.json' assert { type: 'json' };

const token = await getToken('standard', keys, Scope.APP_REMOTE_CONTROL);

const req = await fetch('https://api.spotify.com/v1/tracks/5q2KGgJV5l4MAnnGIrvKSK', {
    headers: {
        Authorization: `Bearer ${token.accessToken}`
    }
});

console.log(await req.json());
