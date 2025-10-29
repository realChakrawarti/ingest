import { NextResponse } from "next/server";

export type ApiError = {
  code: string;
  details: string | null;
};

export type ApiResponse<T = unknown> = {
  // The success boolean allows for quick checks on the request outcome
  success: boolean;
  // The message field provides clear, human-readable information about the result.
  message: string;
  // The data field can contain any type of response data.
  data: T | null;
  // The error object provides structured error information when things go wrong
  error: ApiError | null;
  // The meta object includes useful information like status codes and timestamps.
  meta: {
    statusCode: number;
    timestamp: string;
  };
};

class NxResponseBuilder {
  private createResponse<T>(
    success: boolean,
    message: string,
    data: T | null,
    error: ApiError | null,
    statusCode: number
  ): NextResponse<ApiResponse<T>> {
    const response: ApiResponse<T> = {
      data,
      error,
      message,
      meta: {
        statusCode,
        timestamp: new Date().toISOString(),
      },
      success,
    };

    return NextResponse.json(response, { status: statusCode });
  }

  success<T>(
    message: string,
    data: T,
    statusCode = 200
  ): NextResponse<ApiResponse<T>> {
    return this.createResponse(true, message, data, null, statusCode);
  }

  /**
   *
   * @param message
   * @param error - {code: string, details: string | null}
   * @param statusCode
   * @returns
   */
  fail(
    message: string,
    error: ApiError,
    statusCode = 400
  ): NextResponse<ApiResponse<null>> {
    return this.createResponse(false, message, null, error, statusCode);
  }
}

export const NxResponse = new NxResponseBuilder();
