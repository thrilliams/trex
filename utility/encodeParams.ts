/**
 * Encodes an object into URLSearchParams.
 * @param object An object to encode as a query string.
 * @returns {URLSearchParams} A query string.
 */
export function encodeParams(object: { [key: string]: any }): URLSearchParams {
    let params = new URLSearchParams();
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            params.append(key, object[key]);
        }
    }
    return params;
}
