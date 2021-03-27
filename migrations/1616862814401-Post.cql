// -- up --
CREATE (p:post)
// -- down --
MATCH (p:post) DETACH DELETE (p)