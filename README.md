# neo4j_migrations
Migrate your Neo4j constraints

## Configuring

To setup a custom config please create a `neo4j-mig.config.json` file.

In this file you need to specify:
- the db name (default is `neo4j`) 
- the url to the database
- the db username
- the db password
- where to save your migrations (default is `./migrations`)
- node label of already runned migration in `neo4j`

```ts
export interface IJSONConfig {
  database?: string;
  url: string;
  username: string;
  password: string;
  folder?: string;
  node_label?: string;
}
``` 

## Creating a migration

> npx neo4j_migrations create --name User
Or:
> npx neo4j_migrations create -n User

This will create a `.cql` file under the folder you specified in `neo4j-mig.config.json`.

This file is seperated in 2 parts: 
- Migrate
- Undo

Just write the `cypher` code you want to execute on migration under the `# -- up --`
And the code you will execute when reverting the migration under the `# -- undo --`

***Don't remove those comments***

## Running your migrations

> npx neo4j-mig run

This runs migrations that where not already executed and saves them in neo4j with the label you specified in `neo4j-mig.config.json`.

## Undo migrations

- Undo last:
    > npx neo4j-mig undo-last
- Undo all:
    > npx neo4j-mig undo-all
