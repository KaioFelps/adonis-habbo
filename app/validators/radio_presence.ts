import vine from '@vinejs/vine'

export const markPresenceParametersValidator = vine.compile(
  vine.object({
    programId: vine.number(),
  })
)
