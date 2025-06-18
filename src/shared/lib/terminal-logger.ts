export default class TerminalLogger {
  private static log(symbol: string, text: string) {
    return console.log(symbol + " " + text);
  }
  static success(text: string): void {
    TerminalLogger.log("🟩", text);
  }

  static fatal(text: string, err: Error | unknown): void {
    TerminalLogger.log("🟥", text);
    if (err instanceof Error) {
      TerminalLogger.log("🟥", err.message);
    }
  }

  static fail(text: string): void {
    TerminalLogger.log("🟧", text);
  }

  static warn(text: string): void {
    TerminalLogger.log("🟨", text);
  }

  static info(text: string): void {
    TerminalLogger.log("🟦", text);
  }

  static time(text: string): void {
    TerminalLogger.log("⏳", text);
  }
}
