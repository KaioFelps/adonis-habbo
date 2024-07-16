import vine from '@vinejs/vine'

export const programPromotionSchedulingValidator = vine.compile(
  vine.object({
    programId: vine.number(),
  })
)
