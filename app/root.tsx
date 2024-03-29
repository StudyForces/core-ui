// root.tsx
import React, {useContext, useEffect} from 'react'
import {withEmotionCache} from '@emotion/react'
import {ChakraProvider} from '@chakra-ui/react'
import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from '@remix-run/react'
import {MetaFunction, LinksFunction} from '@remix-run/cloudflare' // Depends on the runtime you choose

import {ServerStyleContext, ClientStyleContext} from './context'
import theme from "~/theme";

export const meta: MetaFunction = () => ({
    charset: 'utf-8',
    title: 'StudyForces',
    viewport: 'width=device-width,initial-scale=1',
});

export let links: LinksFunction = () => {
    return [
        {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
        {rel: 'preconnect', href: 'https://fonts.gstatic.com'},
        {rel: 'preconnect', href: 'https://unpkg.com'},
        {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;500;600;700;800&display=swap'
        },
        {
            rel: 'stylesheet',
            href: 'https://unpkg.com/katex@0.16.0/dist/katex.min.css'
        },
    ]
}

interface DocumentProps {
    children: React.ReactNode;
}

const Document = withEmotionCache(
    ({children}: DocumentProps, emotionCache) => {
        const serverStyleData = useContext(ServerStyleContext);
        const clientStyleData = useContext(ClientStyleContext);

        // Only executed on client
        useEffect(() => {
            // re-link sheet container
            emotionCache.sheet.container = document.head;
            // re-inject tags
            const tags = emotionCache.sheet.tags;
            emotionCache.sheet.flush();
            tags.forEach((tag) => {
                (emotionCache.sheet as any)._insertTag(tag);
            });
            // reset cache to reapply global styles
            clientStyleData?.reset();
        }, []);

        return (
            <html lang="en">
            <head>
                <Meta/>
                <Links/>
                {serverStyleData?.map(({key, ids, css}) => (
                    <style
                        key={key}
                        data-emotion={`${key} ${ids.join(' ')}`}
                        dangerouslySetInnerHTML={{__html: css}}
                    />
                ))}
            </head>
            <body>
            {children}
            <ScrollRestoration/>
            <Scripts/>
            <LiveReload/>
            </body>
            </html>
        );
    }
);

export default function App() {
    return (
        <Document>
            <ChakraProvider theme={theme}>
                <Outlet/>
            </ChakraProvider>
        </Document>
    )
}
