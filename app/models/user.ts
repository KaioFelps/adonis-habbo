import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import Article from './article.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import ArticleLike from './article_like.js'
import ArticleComment from './article_comment.js'
import { UserRole } from './enums/user_role.js'
import RadioProgram from './radio_program.js'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'

const AuthFinder = withAuthFinder(() => hash.use('argon'), {
  uids: ['nickname'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)

  static nickname_regex = /^[a-zA-Z0-9\_\-\=\?\!\@\:\;\.\,]+$/

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nickname: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare motto: string | null

  @column()
  declare role: UserRole

  @column()
  declare active: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Article)
  declare articles: HasMany<typeof Article>

  @hasMany(() => ArticleLike)
  declare articlesLikes: HasMany<typeof ArticleLike>

  @hasMany(() => ArticleComment)
  declare articlesComments: HasMany<typeof ArticleComment>

  @hasMany(() => RadioProgram, { foreignKey: 'announcer_id' })
  declare radioPrograms: HasMany<typeof RadioProgram>

  @hasMany(() => RadioProgram, { foreignKey: 'promoter_id' })
  declare promotedRadioProgramas: HasMany<typeof RadioProgram>
}
