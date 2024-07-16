import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'radio_programs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name')

      table
        .integer('announcer_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
        .notNullable()

      table
        .integer('promoter_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
        .nullable()

      table.timestamp('starts_at').unique()
      table.timestamp('ends_at').unique()
      table.timestamp('created_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
