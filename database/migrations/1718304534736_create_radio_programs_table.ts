import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'radio_programs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('announcer_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
      table
        .integer('promoter_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
        .nullable()
      table.string('name')
      table.timestamp('starts_at')
      table.timestamp('ends_at')
      table.timestamp('created_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
