import { UserRole } from '#models/enums/user_role'
import User from '#models/user'
import vine from '@vinejs/vine'

/**
 * Validates the user creation data-object
 */
export const createUserValidator = vine.compile(
  vine.object({
    nickname: vine
      .string()
      .trim()
      .regex(User.nickname_regex)
      .unique(async (db, value) => {
        const user = await db.from('users').where('nickname', value).first()
        return !user
      }),
    motto: vine.string().escape().trim().maxLength(255).optional().nullable(),
    password: vine.string().minLength(6),
  })
)

export const editUserValidator = vine.compile(
  vine.object({
    nickname: vine
      .string()
      .trim()
      .regex(User.nickname_regex)
      .unique(async (db, value) => {
        const user = await db.from('users').where('nickname', value).first()
        return !user
      })
      .optional(),
    motto: vine.string().escape().trim().maxLength(255).optional().nullable(),
    role: vine.enum(Object.values(UserRole)).optional(),
    password: vine.string().minLength(6).optional(),

    params: vine.object({
      id: vine.number().positive().withoutDecimals(),
    }),
  })
)

export const toggleUserActiveValidator = vine.compile(
  vine.object({
    params: vine.object({
      id: vine.number().positive().withoutDecimals(),
    }),
  })
)
