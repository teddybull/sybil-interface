import { createWeb3ReactRoot, Web3ReactProvider } from "@web3-react/core";
import "inter-ui";
import React, { StrictMode } from "react";
import { isMobile } from "react-device-detect";
import ReactDOM from "react-dom";
import ReactGA from "react-ga";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import { NetworkContextName } from "./constants";
import "./i18n";
import App from "./pages/App";
import store from "./state";
import ApplicationUpdater from "./state/application/updater";
import MulticallUpdater from "./state/multicall/updater";
import TransactionUpdater from "./state/transactions/updater";
import UserUpdater from "./state/user/updater";
import GovernanceUpdater from "./state/governance/updater";
import SocialUpdater from "./state/social/updater";
import CampaignsUpdater from "./state/campaigns/updater";

import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from "./theme";
import getLibrary from "./utils/getLibrary";

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

if ("ethereum" in window) {
  (window.ethereum as any).autoRefreshOnNetworkChange = false;
}
// @todo  make sure this is working in our GA
const GOOGLE_ANALYTICS_ID: string | undefined =
  process.env.REACT_APP_GOOGLE_ANALYTICS_ID;
if (typeof GOOGLE_ANALYTICS_ID === "string") {
  ReactGA.initialize(GOOGLE_ANALYTICS_ID, {
    gaOptions: {
      storage: "none",
      storeGac: false,
    },
  });
  // console.log("ga checker: ", GOOGLE_ANALYTICS_ID);
  ReactGA.set({
    anonymizeIp: true,
    customBrowserType: !isMobile
      ? "desktop"
      : "web3" in window || "ethereum" in window
      ? "mobileWeb3"
      : "mobileRegular",
  });
} else {
  ReactGA.initialize("test", { testMode: true, debug: true });
}

window.addEventListener("error", (error) => {
  ReactGA.exception({
    description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
    fatal: true,
  });
});

function Updaters() {
  return (
    <>
      <GovernanceUpdater />
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
      <SocialUpdater />
      <CampaignsUpdater />
    </>
  );
}

ReactDOM.render(
  <StrictMode>
    <FixedGlobalStyle />
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Provider store={store}>
          <Updaters />
          <ThemeProvider>
            <ThemedGlobalStyle />
            <HashRouter>
              <App />
            </HashRouter>
          </ThemeProvider>
        </Provider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </StrictMode>,
  document.getElementById("root")
);
