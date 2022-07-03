import {extendTheme} from "@chakra-ui/react"

const theme = extendTheme({
    useSystemColorMode: true,
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
