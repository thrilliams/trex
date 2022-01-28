/**
 * Opens a webpage in the default browser.
 * @param {string | URL} page The page to open.
 */
export function openPage(page: string | URL) {
    if (page instanceof URL) page = page.href;
    let process =
        Deno.build.os === 'darwin' ? 'open' : Deno.build.os === 'windows' ? 'start' : 'xdg-open';
    return Deno.run({
        cmd: [process, page],
        stdout: 'piped'
    }).output();
}
