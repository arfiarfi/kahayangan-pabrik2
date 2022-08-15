import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: window.localStorage.getItem("factory-user")
    ? JSON.parse(window.localStorage.getItem("factory-user"))
    : null,
  token: window.localStorage.getItem("factory-token") ?? null,
  instances: [],
};

export const counterSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload.login.user;
      state.token = payload.login.token;

      window.localStorage.setItem(
        "factory-user",
        JSON.stringify(payload.login.user)
      );
      window.localStorage.setItem("factory-token", payload.login.token);
    },
    removeUser: (state) => {
      state.user = null;
      window.localStorage.removeItem("factory-user");
      window.localStorage.removeItem("factory-token");
    },
    setTitle: (state, { payload }) => {
      state.title = payload.title;
    },
    setDataTable: (state, { payload }) => {
      state.instances = payload.instances;
    },
  },
});

export const { setUser, removeUser, setTitle } = counterSlice.actions;

export default counterSlice.reducer;
