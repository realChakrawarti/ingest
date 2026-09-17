const Invalid = {
  INVALID_FEED_ID: "INVALID_FEED_ID",
  INVALID_DATA_PROVIDED: "INVALID_DATA_PROVIDED",
  INVALID_METADATA_UPDATE: "INVALID_METADATA_UPDATE",
} as const;

const Unauthorized = {
  AUTHENTICATION_FAILED: "AUTHENTICATION_FAILED",
} as const;

const Get = {
  GET_PICK_BY_ID_FAILED: "GET_PICK_BY_ID_FAILED",
  GET_FEED_BY_ID_FAILED: "GET_FEED_BY_ID_FAILED",
  GET_USER_PICK_FAILED: "GET_USER_PICK_FAILED",
  GET_USER_FEED_FAILED: "GET_USER_FEED_FAILED",
} as const;

// type Invalid = (typeof Invalid)[keyof typeof Invalid];

const AppErrorCodes = {
  ...Invalid,
  ...Get,
  ...Unauthorized,
};

export default AppErrorCodes;