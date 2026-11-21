import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const allow = new Set(readFileSync("src/data/log-allow.txt", "utf8")
    .split(/\r?\n/)
    .map((line) => line.split("#", 1)[0].trim())
    .filter(Boolean));
const history = execFileSync("git", ["log", "--date=short", "--format=%h%x09%ad%x09%s"], { encoding: "utf8" });
const log = history.trimEnd().split("\n").flatMap((line) => {
    const [hash, date, ...message] = line.split("\t");
    return allow.has(hash) ? [{ hash, date, message: message.join("\t").trimEnd() }] : [];
});

mkdirSync("src/generated", { recursive: true });
writeFileSync("src/generated/site-log.json", JSON.stringify(log, null, 4) + "\n");
