import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import type { AppProps } from "next/app";
import "remixicon/fonts/remixicon.css";

const MantineThemeProps: MantineThemeOverride = {
  fontFamily: "Greycliff CF, sans-serif",
  primaryShade: 7,
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
  },
  headings: { fontFamily: "Gill Sans, sans-serif", fontWeight: 600 },
  cursorType: "pointer",
  colors: {
    green: [
      "#DAE2B6",
      "#8FCFB2",
      "#9AE6B4",
      "#EAEAEA",
      "#47BB78",
      "#37A169",
      "#2F8559",
      "#276748",
      "#21543D",
      "#1C4531",
    ],
  },
  white: "#F6F6F6",
  black: "#1E1E1E",
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={MantineThemeProps}
    >
      <Component {...pageProps} />
    </MantineProvider>
  );
}
