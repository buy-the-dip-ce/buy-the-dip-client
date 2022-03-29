import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";

import AsideWrapper from "../components/AsideWrapper";
import "../styles/index.css";
import "../styles/palette.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
    },
  },
});

const App = ({ Component, pageProps }) => {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <AsideWrapper>
          <Component {...pageProps} />
        </AsideWrapper>
        <div id="root-modal" />
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export default App;
