import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class RadioProgram extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @belongsTo(() => User)
  declare announcer: BelongsTo<typeof User>

  @column()
  declare program: string

  @belongsTo(() => User)
  declare promoter: BelongsTo<typeof User>

  @column.dateTime()
  declare startsAt: DateTime

  @column.dateTime()
  declare endsAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
