import { ApolloProvider } from "@apollo/client";
import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import type { AppProps } from "next/app";
import "remixicon/fonts/remixicon.css";
import { PlantsProvider } from "../components/contexts/PlantsContext";
import { useApollo } from "../lib/apollo";

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
    green: ["#3FA195", "#245852"],
  },
  white: "#F6F6F6",
  black: "#1E1E1E",
};

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={MantineThemeProps}
    >
      <ApolloProvider client={apolloClient}>
        <PlantsProvider initialData={pageProps?.initialData}>
          <Component {...pageProps} />
        </PlantsProvider>
      </ApolloProvider>
    </MantineProvider>
  );
}
