import { join, dirname, resolve } from "path";
import { getPlatform } from "./get-device-specs";
import isDev from "electron-is-dev";
import { app } from "electron";

/**
 * appRootDir is the resources directory inside the unpacked electron app temp directory.
 * resources contains app.asar file, that contains the main and renderer files.
 * We're putting resources/{os}/bin from project inside resources/bin of electron.
 * Same for the models directory as well.
 */
const appRootDir = app.getAppPath();
const platform = getPlatform();

// Windows: bin and models are at app root level (same level as resources/)
// Mac: bin and models are inside Resources/ (same level as app.asar)
const resourcesDir = isDev
  ? join(appRootDir, "resources", platform!, "bin")
  : platform === "win"
    ? join(dirname(dirname(appRootDir)), "bin")
    : join(dirname(appRootDir), "bin");

const binariesPath = resourcesDir;

const execFileName = platform === "win" ? "upscayl-bin.exe" : "upscayl-bin";
const execPath = resolve(join(binariesPath, execFileName));

const modelsPath = isDev
  ? resolve(join(appRootDir, "resources", "models"))
  : platform === "win"
    ? resolve(join(dirname(dirname(appRootDir)), "models"))
    : resolve(join(dirname(appRootDir), "models"));

export { execPath, modelsPath };
