export interface ILogger {
    info: (...args: unknown[]) => void;
    trace: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
}
