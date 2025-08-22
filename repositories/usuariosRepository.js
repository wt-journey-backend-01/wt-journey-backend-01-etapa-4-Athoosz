const db = require('../db/db');

async function findById(id) {
  return db('usuarios').where({ id }).first();
}

async function findByEmail(email) {
  return db('usuarios').where({ email }).first();
}

async function createUsuario({ nome, email, senha }) {
  const [id] = await db('usuarios').insert({ nome, email, senha }).returning('id');
  return { id, nome, email };
}

async function deleteUsuario(id) {
  return db('usuarios').where({ id }).del();
}

module.exports = {
  findById,
  findByEmail,
  createUsuario,
  deleteUsuario,
};
