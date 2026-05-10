import fs from "fs";

export class MemoryEngine {
  path = ".opencode/memory/project-memory.md";

  write(entry: string) {
    const time = new Date().toISOString();

    fs.appendFileSync(
      this.path,
      `\n- [${time}] ${entry}\n`
    );
  }

  read() {
    return fs.readFileSync(this.path, "utf-8");
  }

  filter(input: string) {
    const blocked = ["api key", "password", "token"];

    return !blocked.some(b =>
      input.toLowerCase().includes(b)
    );
  }
}
