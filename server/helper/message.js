class MyError extends Error {
  constructor(status, msg) {
    super();
    super.code = status;
    super.message = msg;
  }
}
module.exports = {
  MyError,
  ErrorMessage(msg) {
    return {
      status: "Error",
      message: msg,
    };
  },
  SuccessMessage(msg) {
    return {
      status: "Success",
      message: msg,
    };
  },
};
