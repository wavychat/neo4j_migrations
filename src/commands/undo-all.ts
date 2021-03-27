import { Command } from "@oclif/command";
import chalk = require("chalk");
import neo4j, { Driver } from "neo4j-driver";
import * as fs from "fs-extra";
import * as path from "path";
import { getConfig } from "../helpers/getConfig";

export default class UndoAll extends Command {
  static description = "Revert all executed migration";

  async run() {
    let driver: Driver | null = null;
    try {
      const config = await getConfig();
      driver = neo4j.driver(
        config.url,
        neo4j.auth.basic(config.username, config.password),
        { disableLosslessIntegers: true }
      );

      // create session to db
      const session = driver.session({
        database: config.database,
      });

      const query = await session.run(
        `MATCH (n:${config.node_label})        
        RETURN n ORDER BY n.createdAt DESC`
      );

      if (!query.records[0]) throw new Error("Couldn't find any migration");

      for (let record of query.records) {
        const { file } = record.get("n").properties;

        const data = await fs.promises.readFile(
          path.join(config.folder, file),
          "utf8"
        );

        // get functions
        let [_, down] = data.split("// -- down --");

        await session.run(down);
        await session.run(
          `MATCH (n:${config.node_label} { 
            file: $file 
          }) DETACH DELETE n`,
          { file }
        );
        console.log(chalk.green(`✅ Migration ${file} was reverted`));
      }
      driver.close();
      return console.log(chalk.green(`✅ All migrations were reverted`));
    } catch (e) {
      driver?.close();
      return console.error(chalk.red(e));
    }
  }
}
