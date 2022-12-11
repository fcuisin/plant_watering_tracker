import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import type { AppProps } from "next/app";

const MantineThemeProps: MantineThemeOverride = {
  fontFamily: "Greycliff CF, sans-serif",
  primaryShade: 7,
  fontSizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
  },
  headings: { fontFamily: "Gill Sans, sans-serif" },
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
