exports.up = function (knex) {
  return knex.schema.createTable('orders', (table) => {
    table.increments()
    table.string('amount_in_paise').notNullable()
    table.string('transaction_id')
    table.string('status').notNullable()
    table.string('phone_number').notNullable()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('users')
}
