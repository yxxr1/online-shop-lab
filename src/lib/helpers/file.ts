import fs from "fs";

export const loadJsonFile = (filePath: string) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }));
  } catch (e) {
    return undefined;
  }
}
