import RadioPresence from '#models/radio_presence'
import { markPresenceParametersValidator } from '#validators/radio_presence'
import type { HttpContext } from '@adonisjs/core/http'
import { IErrorResponse } from '../core/types/spec/Error.js'
import RadioProgram from '#models/radio_program'
import { DateTime } from 'luxon'
import dayjs from 'dayjs'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'

export default class RadioPresencesController {
  async markPresence({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()

    const [error, payload] = await markPresenceParametersValidator.tryValidate(request.params())

    if (error)
      return response.badRequest({
        code: 400,
        message: 'Id de programa inválido.',
      } satisfies IErrorResponse)

    const program = await RadioProgram.findBy({ id: payload.programId })

    if (!program)
      return response.badRequest({
        code: 400,
        message: 'Programa de rádio não encontrado.',
      } satisfies IErrorResponse)

    if (!this.isOnAir(program))
      return response.badRequest({
        code: 400,
        message: 'Não é possível marcar presença no programa informado.',
      } satisfies IErrorResponse)

    const [presenceAlreadyExists] = await RadioPresence.query()
      .where('programId', program.id)
      .andWhere('userId', user.id)
      .exec()

    if (presenceAlreadyExists)
      return response.forbidden({
        code: 403,
        message: 'Você só pode marcar presença uma vez por programa de rádio.',
      } satisfies IErrorResponse)

    const presence = new RadioPresence()
    presence.userId = user.id

    await program.related('presences').create(presence)
    user.presencesCount++
    await user.save()

    return response.created()
  }

  async getRankedPresencesUsers(ctx: HttpContext) {
    const users = await User.query().orderBy('presences_count', 'desc').limit(10).exec()
    return ctx.response.status(200).json({ data: users })
  }

  async resetUsersPresences(ctx: HttpContext) {
    await db.from('users').update({ presencesCount: 0 })
    return ctx.response.noContent()
  }

  private isOnAir(program: RadioProgram) {
    const now = dayjs(DateTime.now().toUTC().toJSDate())
    const programStartDate = dayjs(program.startsAt.toJSDate())
    const programEndDate = dayjs(program.endsAt.toJSDate())

    if (now.isAfter(programStartDate) && now.isBefore(programEndDate)) return true
    return false
  }
}
