import * as fs from "fs-extra";

export interface IJSONConfig {
  database?: string;
  url: string;
  username: string;
  password: string;
  folder?: string;
  node_label?: string;
}

export const getConfig = async (): Promise<Required<IJSONConfig>> => {
  const {
    database = "neo4j",
    folder = "./migrations",
    node_label = "Migration",
    ...config
  }: IJSONConfig = await fs.readJSON("neo4j-mig.config.json");
  return { database, folder, node_label, ...config };
};
