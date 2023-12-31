import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
export function isFetchBaseQueryError(
  error: unknown
): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error;
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
export function isErrorWithMessage(
  error: unknown
): error is { message: string } {
  return (
    typeof error === "object" &&
    error != null &&
    "message" in error &&
    typeof error.message === "string"
  );
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;

  if (isFetchBaseQueryError(error)) {
    const errMsg =
      "error" in error
        ? error.error
        : typeof error.data === "string"
          ? error.data
          : "Something went wrong!";
    return errMsg;
  } else if (isErrorWithMessage(error)) return error.message;

  return "Something went wrong!";
}
