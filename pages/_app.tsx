import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import type { AppProps } from "next/app";
import "remixicon/fonts/remixicon.css";
import { PlantsProvider } from "../components/contexts/PlantsContext";
import Layout from "../components/Layout";

const MantineThemeProps: MantineThemeOverride = {
  fontFamily: "Gill Sans, sans-serif",
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
    green: ["#9AD56B", "#116149"],
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
      <PlantsProvider initialData={pageProps?.initialData}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PlantsProvider>
    </MantineProvider>
  );
}
