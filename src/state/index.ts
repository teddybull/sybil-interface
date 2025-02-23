import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { save, load } from "redux-localstorage-simple";

import application from "./application/reducer";
import governance from "./governance/reducer";
import { updateVersion } from "./global/actions";
import user from "./user/reducer";
import transactions from "./transactions/reducer";
import multicall from "./multicall/reducer";
import social from "./social/reducer";
import campaigns from "./campaigns/reducer";

const PERSISTED_KEYS: string[] = [
  "user",
  "transactions",
  "governance",
  "campaigns",
];

const store = configureStore({
  reducer: {
    application,
    user,
    transactions,
    multicall,
    governance,
    social,
    campaigns,
  },
  middleware: [
    ...getDefaultMiddleware({ thunk: false }),
    save({ states: PERSISTED_KEYS }),
  ],
  preloadedState: load({ states: PERSISTED_KEYS }),
});

store.dispatch(updateVersion());

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
