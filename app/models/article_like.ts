import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Article from './article.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class ArticleLike extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @belongsTo(() => Article, {})
  declare article: BelongsTo<typeof Article>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
