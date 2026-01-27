type Metadata = {
  timestamp: string;
  [key: string]: any;
};

type SuccessResponse<T> = {
  success: true;
  data: T;
  metadata: Metadata;
};

type ErrorResponse = {
  success: false;
  error: string;
  metadata: Metadata;
};

/**
 * Generic JSON response builder.
 * - Use .success(data) for successes.
 * - Use .error(error) for errors.
 * - Use .metadata(key, value) to add metadata.
 * - .return() yields the final response object.
 */
class json<T = unknown> {
  private isSuccess = false;
  private response: Partial<SuccessResponse<T>> & Partial<ErrorResponse> = {
    metadata: { timestamp: new Date().toISOString() },
  };

  success(this: json<T>, data: any) {
    this.isSuccess = true;
    (this.response as SuccessResponse<T>).success = true;
    (this.response as SuccessResponse<T>).data = data;
    delete this.response.error;
    return this;
  }

  error(this: json<T>, error: string) {
    this.isSuccess = false;
    (this.response as ErrorResponse).success = false;
    (this.response as ErrorResponse).error = error;
    delete this.response.data;
    return this;
  }

  metadata(key: string, value: any) {
    if (!this.response.metadata) {
      this.response.metadata = { timestamp: new Date().toISOString() };
    }
    this.response.metadata[key] = value;
    return this;
  }

  return(): SuccessResponse<T> | ErrorResponse {
    if (this.isSuccess) {
      // Type assertion ensures TS knows it's SuccessResponse<T>
      return this.response as SuccessResponse<T>;
    }
    return this.response as ErrorResponse;
  }
}

export const jsonResult = new json<any>();
