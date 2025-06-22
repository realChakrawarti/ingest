/**
 * @fileoverview A robust console logging utility for various log levels.
 */

export default class Log {
  // Controls whether debug logs are enabled. Can be overridden at runtime.
  private static _isDebugEnabled: boolean =
    process.env.NODE_ENV !== "production";

  /**
   * Initializes the Log utility.
   * @param {object} [options] - Configuration options.
   * @param {boolean} [options.debug] - Explicitly enables or disables debug logging.
   */
  static initialize(options?: { debug?: boolean }): void {
    if (options && typeof options.debug === "boolean") {
      Log._isDebugEnabled = options.debug;
    }
  }

  /**
   * Logs a success message.
   * @param {string} message - The message to log.
   */
  static success(message: string): void {
    console.log(`🟩 ${message}`);
  }

  /**
   * Logs a fatal error message and its underlying reason.
   * Provides detailed error information for Error objects.
   * Output is grouped for clarity.
   * @param {string} message - The main error message.
   * @param {Error | unknown} reason - The reason for the fatal error.
   */
  static fatal(message: string, reason: Error | unknown): void {
    console.groupCollapsed(`🟥 ${message}`);
    if (reason instanceof Error) {
      console.error(`Name: ${reason.name}`);
      Log._logErrorDetails(reason);
    } else {
      console.error(reason);
    }
    console.groupEnd();
  }

  /**
   * Logs a failure message or error.
   * Provides detailed error information for Error objects.
   * Output is grouped for clarity when an Error object is provided.
   * @param {string | Error | unknown} reason - The reason for the failure.
   */
  static fail(reason: string | Error | unknown): void {
    if (reason instanceof Error) {
      console.groupCollapsed(`🟧 ${reason.name}`);
      Log._logErrorDetails(reason);
      console.groupEnd();
    } else {
      console.error(`🟧 ${reason}`);
    }
  }

  /**
   * Logs a warning message.
   * @param {string} message - The warning message.
   */
  static warn(message: string): void {
    console.warn(`🟨 ${message}`);
  }

  /**
   * Logs an informational message.
   * @param {string} message - The informational message.
   */
  static info(message: string): void {
    console.info(`🟦 ${message}`);
  }

  /**
   * Logs a message for time-consuming operations.
   * @param {string} message - The message related to the timed operation.
   */
  static time(message: string): void {
    console.log(`⏳ ${message}`);
  }

  /**
   * Logs a debug message, enabled only if debug mode is active.
   * @param {string} message - The debug message.
   */
  static debug(message: string): void {
    if (Log._isDebugEnabled) {
      console.debug(`⬛ ${message}`);
    }
  }

  /**
   * Helper to log detailed properties of an Error object.
   * @private
   * @param {Error} error - The Error object.
   */
  private static _logErrorDetails(error: Error): void {
    console.error(`Message: ${error.message}`);
    if (error.cause) {
      console.error(`Cause: ${error.cause}`);
    }
    if (error.stack) {
      console.error(`Stack:\n${error.stack}`);
    }
  }
}
