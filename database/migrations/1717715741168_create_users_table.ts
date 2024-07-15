import { UserRole } from '#models/enums/user_role'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('nickname').notNullable().unique()
      table.string('motto').nullable()

      table
        .enu('role', [...Object.values(UserRole)])
        .defaultTo(UserRole.USER)
        .notNullable()

      table.string('password').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
