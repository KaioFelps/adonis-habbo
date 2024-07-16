import vine from '@vinejs/vine'
import { TimePolitics } from '../core/politics/time.js'

export const scheduleProgramValidator = vine.compile(
  vine.object({
    startsAt: vine.date({ formats: { format: TimePolitics.isoStringFormat } }),
    endsAt: vine.date({ formats: { format: TimePolitics.isoStringFormat } }),
    program: vine.string(),
  })
)

export const unscheduleProgramValidator = vine.compile(
  vine.object({
    id: vine.number().min(1),
  })
)
