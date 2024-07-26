import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'radio_presences'
  protected usersTable = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable()
      table.integer('program_id').unsigned().notNullable()
      table.timestamp('created_at')
    })

    this.schema.alterTable(this.usersTable, (table) => {
      table.integer('presences_count').unsigned().defaultTo(0).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.alterTable(this.usersTable, (table) => {
      table.dropColumn('presences_count')
    })
  }
}
