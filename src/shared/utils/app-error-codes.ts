const Invalid = {
  INVALID_CATALOG_ID: "INVALID_CATALOG_ID",
  INVALID_DATA_PROVIDED: "INVALID_DATA_PROVIDED",
  INVALID_METADATA_UPDATE: "INVALID_METADATA_UPDATE",
} as const;

const Unauthorized = {
  AUTHENTICATION_FAILED: "AUTHENTICATION_FAILED",
} as const;

const Get = {
  GET_ARCHIVE_BY_ID_FAILED: "GET_ARCHIVE_BY_ID_FAILED",
  GET_CATALOG_BY_ID_FAILED: "GET_CATALOG_BY_ID_FAILED",
  GET_USER_ARCHIVE_FAILED: "GET_USER_ARCHIVE_FAILED",
  GET_USER_CATALOG_FAILED: "GET_USER_CATALOG_FAILED",
} as const;

// type Invalid = (typeof Invalid)[keyof typeof Invalid];

const AppErrorCodes = {
  ...Invalid,
  ...Get,
  ...Unauthorized,
};

export default AppErrorCodes;
