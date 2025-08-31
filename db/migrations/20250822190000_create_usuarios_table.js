/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
	await knex.schema.createTable("usuarios", function (table) {
		table.increments("id").primary();
		table.string("nome").notNullable();
		table.string("email").notNullable().unique();
		table.string("senha").notNullable();
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
	await knex.schema.dropTableIfExists("usuarios");
};
