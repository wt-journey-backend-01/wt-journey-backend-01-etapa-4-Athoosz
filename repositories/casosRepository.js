const db = require("../db/db");

async function findAll() {
   return await db("casos").select("*");
}

async function findById(id) {
   return await db("casos").where({ id }).first();
}

async function addCaso(caso) {
   const inserted = await db("casos").insert(caso).returning("id");
   const id = Array.isArray(inserted)
      ? (typeof inserted[0] === "object" ? inserted[0].id : inserted[0])
      : inserted;
   return await db("casos").where({ id }).first();
}

async function updateCaso(id, updatedCaso) {
   const { id: _, ...rest } = updatedCaso;
   const novo = {
      titulo: rest.titulo,
      descricao: rest.descricao,
      status: rest.status,
      agente_id: rest.agente_id
   };
   await db("casos").where({ id }).update(novo);
   return await db("casos").where({ id }).first();
}

async function patchCaso(id, updatedFields) {
   await db("casos").where({ id }).update(updatedFields);
   return await db("casos").where({ id }).first();
}

async function deleteCaso(id) {
   return await db("casos").where({ id }).del();
}

async function findByAgenteId(agenteId) {
   return await db("casos").where({ agente_id: agenteId });
}

async function findByStatus(status) {
   return await db("casos").whereRaw("LOWER(status) = ?", [
      status.toLowerCase(),
   ]);
}

async function findByTituloOrDescricao(query) {
   const q = `%${query.toLowerCase()}%`;
   return await db("casos")
      .whereRaw("LOWER(titulo) LIKE ?", [q])
      .orWhereRaw("LOWER(descricao) LIKE ?", [q]);
}

module.exports = {
   findAll,
   findById,
   findByAgenteId,
   addCaso,
   updateCaso,
   patchCaso,
   deleteCaso,
   findByStatus,
   findByTituloOrDescricao,
};
