import RadioProgram from '#models/radio_program'
import { programPromotionSchedulingValidator } from '#validators/radio_program'
import type { HttpContext } from '@adonisjs/core/http'
import { IErrorResponse } from '../core/types/spec/Error.js'

export default class RadioPromotionsController {
  async scheduleProgramPromotion({ request, auth, response, bouncer }: HttpContext) {
    const [error, payload] = await programPromotionSchedulingValidator.tryValidate(request.params())

    if (error) return response.badRequest(error)

    if (await bouncer.with('RadioPromotionPolicy').denies('schedulePromotion')) {
      return response.forbidden({
        code: 403,
        message: 'Você não pode promover um programa de rádio.',
      } satisfies IErrorResponse)
    }

    const radioProgram = await RadioProgram.findByOrFail('id', payload.programId)

    if (!radioProgram.promoter) await radioProgram.related('promoter').associate(auth.user!)
  }

  async unscheduleProgramPromotion({ request, response, bouncer }: HttpContext) {
    const [error, payload] = await programPromotionSchedulingValidator.tryValidate(request.params())

    if (error) return response.badRequest(error)

    const radioProgram = await RadioProgram.findByOrFail('id', payload.programId)

    if (await bouncer.with('RadioPromotionPolicy').denies('unschedulePromotion', radioProgram)) {
      return response.forbidden({
        code: 403,
        message: 'Você não pode desagendar este horário de promotoria.',
      } satisfies IErrorResponse)
    }

    if (!radioProgram.promoterId)
      return response.badRequest({
        code: 400,
        message: 'O horário informado não tem nenhum agendamento de promotoria.',
      } satisfies IErrorResponse)

    await radioProgram.related('promoter').dissociate()
  }
}
