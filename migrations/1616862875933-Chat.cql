// -- up --
CREATE (p:chat)
// -- down --
MATCH (p:chat) DETACH DELETE (p)