export default class TerminalLogger {
  private static log(symbol: string, text: string) {
    return console.log(symbol + " " + text);
  }
  static success(text: string): void {
    TerminalLogger.log("🟩", text);
  }

  static fatal(text: string): void {
    TerminalLogger.log("🟥", text);
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
