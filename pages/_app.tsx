import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import type { AppProps } from "next/app";

const MantineThemeProps: MantineThemeOverride = {
  fontFamily: "Gill Sans, sans-serif",
  colorScheme: "light",
  fontSizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
  },
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
