exports.seed = async function(knex) {
  await knex('usuarios').del();

  await knex('usuarios').insert([
    {
      nome: 'admin',
      email: 'admin@policia.com',
      senha: '$2b$10$QeQwQwQwQwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw' 
    },
    {
      nome: 'user',
      email: 'user@policia.com',
      senha: '$2b$10$QeQwQwQwQwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw' 
    }
  ]);
};
