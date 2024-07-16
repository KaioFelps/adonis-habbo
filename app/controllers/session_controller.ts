import User from '#models/user'
import { LoginValidator } from '#validators/session'
import type { HttpContext } from '@adonisjs/core/http'
import { IErrorResponse } from '../core/types/spec/Error.js'
import hash from '@adonisjs/core/services/hash'

export default class SessionController {
  async login({ request, response, auth }: HttpContext) {
    const [error, payload] = await LoginValidator.tryValidate(request.all())

    if (error) {
      return response.badRequest(error)
    }

    const query = User.query()
    const [user] = await query.whereRaw('nickname ilike ? limit 1', [payload.nickname])

    const invalidCredentialsError: IErrorResponse = {
      message: 'Credenciais inválidas.',
      code: 400,
    }

    if (!user) return response.badRequest(invalidCredentialsError)

    const passwordMatches = await hash.use('argon').verify(user.password, payload.password)

    if (!passwordMatches) return response.badRequest(invalidCredentialsError)

    await auth.use('web').login(user, payload.remembeMe ?? false)
    response.redirect('/')
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    response.redirect().back()
  }
}
