import { v4 as uuid } from "uuid";
import { actions } from "../actions";
const initalState = {};

const userReducer = (state = initalState, action) => {
  const { type, payload } = action;

  console.log(state);
  switch (type) {
    case actions.STORE_TOKEN:
      console.log(payload.token);
      state.token = payload.token;
      return state;
    default:
      return state;
  }
};

export default userReducer;
