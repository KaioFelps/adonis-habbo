import vine from '@vinejs/vine'

export const LoginValidator = vine.compile(
  vine.object({
    nickname: vine.string(),
    password: vine.string(),
    remembeMe: vine.boolean().optional(),
  })
)
