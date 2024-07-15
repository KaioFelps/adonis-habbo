import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected articles_table = 'articles'
  protected article_likes_table = 'article_likes'
  protected article_comments_table = 'article_comments'

  async up() {
    this.schema.createTable(this.articles_table, (table) => {
      table.increments('id')
      table.string('topstory', 255).nullable()
      table.string('title', 255).notNullable()
      table.string('preview', 255).notNullable()
      table.text('content', 'longtext').nullable()
      table
        .integer('author_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
        .nullable()
      table.timestamp('published_at').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at').nullable()
    })

    this.schema.createTable(this.article_likes_table, (table) => {
      table.increments('id')

      table
        .integer('article_id')
        .unsigned()
        .references('id')
        .inTable(this.articles_table)
        .onDelete('CASCADE')

      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
    })

    this.schema.createTable(this.article_comments_table, (table) => {
      table.increments('id')
      table.text('content', 'mediumText').notNullable()
      table.integer('author_id').unsigned().references('id').inTable('users').onDelete('NO ACTION')
      table
        .integer('article_id')
        .unsigned()
        .references('id')
        .inTable(this.articles_table)
        .onDelete('NO ACTION')
      table.boolean('active').defaultTo(true)
      table.timestamp('created_at')
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.raw(`DROP TABLE IF EXISTS ${this.articles_table} CASCADE`)
    this.schema.dropTableIfExists(this.article_likes_table)
    this.schema.dropTableIfExists(this.article_comments_table)
  }
}
