import { Server } from '../deps.ts';

export function handleCallback(
    url: string | URL,
    response?: Response,
    transformHashFragment: boolean = true
): Promise<Request> {
    if (typeof url === 'string') url = new URL(url);

    return new Promise((resolve) => {
        const s = new Server({
            port: parseInt((url as URL).port) || 8000,
            hostname: (url as URL).hostname || '0.0.0.0',

            handler: (req) => {
                if (new URL(req.url).pathname === (url as URL).pathname) {
                    resolve(req);
                    setTimeout(() => s.close(), 0);
                } else if (transformHashFragment) {
                    return new Response(
                        `<script>window.location = '${
                            (url as URL).href
                        }?' + window.location.hash.slice(1);</script>`,
                        {
                            headers: {
                                'Content-Type': 'text/html'
                            }
                        }
                    );
                }

                return (
                    response ||
                    new Response(
                        `<h2>Request received, closing page...</h2>
                        <script>setTimeout(() => window.close(), 1500)</script>`,
                        {
                            headers: {
                                'Content-Type': 'text/html'
                            }
                        }
                    )
                );
            }
        });

        s.listenAndServe();
    });
}
