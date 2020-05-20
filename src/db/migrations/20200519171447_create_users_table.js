exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments()
    table.string('phone_number').notNullable().unique()
    table.string('salt').notNullable()
    table.string('hash').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('users')
}
