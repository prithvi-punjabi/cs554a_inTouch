const actions = {
  STORE_TOKEN: 0,
};

const storeToken = (token) => ({
  type: actions.STORE_TOKEN,
  payload: {
    token: token,
  },
});

module.exports = {
  actions,
  storeToken,
};
