import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

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
}
