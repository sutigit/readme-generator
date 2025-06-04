import fs from "fs";
import path from "path";

/**
 * Testing reading package.json file
 */
const packageJsonPath = path.join(__dirname, "../../package.json");
try {
  const data = fs.readFileSync(packageJsonPath, "utf8");
  console.log(JSON.stringify(JSON.parse(data), null, 2));
} catch (err) {
  console.error("Error reading file:", err);
}

/**
 * Testing reading file structure
 */
