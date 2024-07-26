import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import RadioPresence from './radio_presence.js'

export default class RadioProgram extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare announcerId: number

  @column()
  declare promoterId?: number

  @column()
  declare name: string

  @column.dateTime()
  declare startsAt: DateTime

  @column.dateTime()
  declare endsAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => User, { foreignKey: 'announcerId' })
  declare announcer: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'promoterId' })
  declare promoter: BelongsTo<typeof User>

  @hasMany(() => RadioPresence, { foreignKey: 'programId' })
  declare presences: HasMany<typeof RadioPresence>
}
