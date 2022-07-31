import {extendTheme} from "@chakra-ui/react"

const appleSystem = "-apple-system, BlinkMacSystemFont, Roboto, Open Sans, Helvetica Neue, sans-serif";

const theme = extendTheme({
    useSystemColorMode: true,
    fonts: {
        body: appleSystem,
        heading: "'Roboto Slab', serif",
        mono: "Menlo, monospace",
        serif: "'Roboto Slab', serif",
    },
    colors: {
        brand: {
            50: "#f0f6fc",
            100: "#CDE6FD",
            200: "#9BCBFB",
            300: "#68A9F5",
            400: "#4389EC",
            500: "#0A5BE0",
            600: "#0746C0",
            700: "#0534A1",
            800: "#032481",
            900: "#01196B",
        },
    },
});

export default theme;
