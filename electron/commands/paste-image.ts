import { ipcMain, IpcMainEvent, BrowserWindow } from "electron";
import fs from "fs";
import path from "path";
import logit from "../utils/logit";
import { ELECTRON_COMMANDS } from "../../common/electron-commands";

interface PasteImagePayload {
  name: string;
  path: string;
  extension: string;
  size: number;
  type: string;
  encodedBuffer: string;
}

export default function pasteImage(event: IpcMainEvent, payload: PasteImagePayload) {
  const { name, path: outputPath, encodedBuffer } = payload;

  logit("📋 Received paste image request:", { name, outputPath });

  try {
    const filePath = path.join(outputPath, name);
    const buffer = Buffer.from(encodedBuffer, "base64");

    fs.writeFileSync(filePath, buffer);

    logit("✅ Image saved successfully:", filePath);

    const mainWindow = BrowserWindow.getAllWindows()[0];
    if (mainWindow) {
      mainWindow.webContents.send(ELECTRON_COMMANDS.PASTE_IMAGE_SAVE_SUCCESS, filePath);
    }
  } catch (error: any) {
    logit("❌ Failed to save image:", error);

    const mainWindow = BrowserWindow.getAllWindows()[0];
    if (mainWindow) {
      mainWindow.webContents.send(ELECTRON_COMMANDS.PASTE_IMAGE_SAVE_ERROR, error?.message || "Failed to save image");
    }
  }
}
