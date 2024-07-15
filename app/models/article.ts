import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import ArticleLike from './article_like.js'
import ArticleComment from './article_comment.js'

export default class Article extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare topstory: string

  @column()
  declare content: string

  @column()
  declare preview: string

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  declare publishedAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare author: BelongsTo<typeof User>

  @hasMany(() => ArticleLike)
  declare likes: HasMany<typeof ArticleLike>

  @hasMany(() => ArticleComment)
  declare comments: HasMany<typeof ArticleComment>
}
