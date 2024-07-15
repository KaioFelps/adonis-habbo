import vine from '@vinejs/vine'

export const scheduleProgramValidator = vine.compile(
  vine.object({
    startsAt: vine.date(),
    endsAt: vine.date(),
    announcerId: vine.number(),
    program: vine.string(),
  })
)

export const programPromotionSchedulingValidator = vine.compile(
  vine.object({
    params: vine.object({
      programId: vine.number(),
    }),
  })
)
