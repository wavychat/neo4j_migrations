import { Command, flags } from "@oclif/command";
import * as fs from "fs-extra";
import * as path from "path";
import chalk = require("chalk");
import { getConfig } from "../helpers/getConfig";

const data = `// -- up --
// -- down --`;

export default class Create extends Command {
  static description = "Creates a migration";

  static examples = ["$ create --name=User"];

  static flags = {
    help: flags.help({ char: "h" }),
    name: flags.string({
      char: "n",
      description: "migration name",
      required: true,
    }),
  };

  async run() {
    const { flags } = this.parse(Create);

    try {
      const { folder } = await getConfig();
      const timestamp = Date.now();
      const filename = `${timestamp}-${flags.name}.cql`;
      if (!fs.existsSync(folder)) await fs.mkdir(folder, { recursive: true });
      await fs.writeFile(path.join(folder, filename), data);
      console.log(chalk.green(`✅ Migration ${filename} generated `));
    } catch (e) {
      console.error(chalk.red(e.toString()));
    }
  }
}
