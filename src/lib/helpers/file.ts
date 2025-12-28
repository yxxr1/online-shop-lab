import fs from "fs";

export const loadJsonFile = (filePath: string) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }));
  } catch (e) {
    return undefined;
  }
}

export const writeFileSyncDebounced = (filePath: string, delay = 1000) => {
  let timer: NodeJS.Timeout;

  return (data: object) => {
    clearTimeout(timer);

    timer = setTimeout(() => fs.writeFileSync(filePath, JSON.stringify(data)), delay);
  };
}
