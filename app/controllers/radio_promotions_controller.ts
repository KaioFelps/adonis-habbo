import RadioProgram from '#models/radio_program'
import { programPromotionSchedulingValidator } from '#validators/radio_program'
import type { HttpContext } from '@adonisjs/core/http'

export default class RadioPromotionsController {
  async scheduleProgramPromotion({ request, auth, response }: HttpContext) {
    const [error, payload] = await programPromotionSchedulingValidator.tryValidate(request.all())

    if (error) return response.badRequest(error)

    const radioProgram = await RadioProgram.findByOrFail('id', payload.params.programId)

    if (!radioProgram.promoter) await radioProgram.related('promoter').associate(auth.user!)
  }

  async unscheduleProgramPromotion({ request, auth, response }: HttpContext) {
    const [error, payload] = await programPromotionSchedulingValidator.tryValidate(request.all())

    if (error) return response.badRequest(error)

    const radioProgram = await RadioProgram.findByOrFail('id', payload.params.programId)

    if (radioProgram.promoter && radioProgram.promoter.id === auth.user?.id)
      await radioProgram.related('promoter').dissociate()
  }
}
