import { Command } from "@oclif/command";
import chalk = require("chalk");
import neo4j, { Driver } from "neo4j-driver";
import * as fs from "fs-extra";
import * as path from "path";
import { getConfig } from "../helpers/getConfig";
const readdirSorted = require("readdir-sorted");

export default class Run extends Command {
  static description = "Runs all migrations";

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

      // select all migrated files
      const res = await session.run(`MATCH (n:${config.node_label}) RETURN n`);

      // check if files were already migrated
      let alreadyMigrated: any[] = [];
      res.records.forEach((record) => {
        if (!record) return;
        const data = record.get("n").properties;
        if (!data?.file) return;
        alreadyMigrated.push(data.file);
      });

      const files = await readdirSorted(config.folder);

      if (
        JSON.stringify(files.sort()) === JSON.stringify(alreadyMigrated.sort())
      ) {
        driver.close();
        return console.log(chalk.yellow(`⚠️ No migration to run`));
      }
      // if a file is not migrated, migrate it
      for (let file of files) {
        if (alreadyMigrated.includes(file)) continue;

        const data = await fs.promises.readFile(
          path.join(config.folder, file),
          "utf8"
        );

        // get functions
        let [up_queries] = data.split("// -- up --");
        let queries = up_queries.split(";");

        for (let query of queries) {
          if (query.trim()) await session.run(query.trim());
        }

        await session.run(
          `CREATE (:${config.node_label} {
          file: $file,
          createdAt: TIMESTAMP()
        })`,
          { file }
        );
        console.log(chalk.green(`✅ Migration ${file} executed and saved `));
      }

      driver.close();
      return console.log(
        chalk.green(`✅ All migrations were executed and saved `)
      );
    } catch (e) {
      driver?.close();
      return console.error(chalk.red(e));
    }
  }
}
