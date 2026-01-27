interface Window {
  electron: {
    send: <T = any>(channel: string, payload?: T) => void;
    invoke: <T = any>(channel: string, payload?: T) => Promise<any>;
    on: (channel: string, callback: (...args: any[]) => void) => void;
    off: (channel: string, callback: (...args: any[]) => void) => void;
    platform: "linux" | "mac" | "win" | undefined;
    getSystemInfo: () => Promise<{
      platform: "linux" | "mac" | "win" | undefined;
      release: string;
      arch: "x64" | "x86" | "arm" | "arm64" | undefined;
      model: string;
      cpuCount: number;
      gpu?: any;
    }>;
    getAppVersion: () => Promise<string | undefined>;
  };
}
