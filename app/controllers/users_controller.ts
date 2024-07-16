import BadRequestException from '#exceptions/bad_request_exception'
import User from '#models/user'
import { createUserValidator, toggleUserActiveValidator, editUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  /**
   * Return list of all users or paginate through
   * them
   */
  async index({ bouncer, response }: HttpContext) {
    if (await bouncer.with('UserPolicy').denies('index')) {
      return response.forbidden('Não pode visualizar todos os usuários.')
    }
  }

  /**
   * Handle form submission to create a new user
   */
  async store({ request, auth, response }: HttpContext) {
    const [error, payload] = await createUserValidator.tryValidate(request.all())

    if (error) {
      return response.badRequest(error)
    }

    const user = await User.create(payload)

    await auth.use('web').login(user, true)

    response.redirect('/')
  }

  /**
   * Display a single user by id.
   */
  async show({}: HttpContext) {}

  /**
   * Render the form to edit an existing user by its id.
   *
   * Not needed if you are creating an API server.
   */
  async edit({ bouncer, response }: HttpContext) {
    if (await bouncer.with('UserPolicy').denies('edit')) {
      return response.forbidden('Não pode editar os dados deste usuário.')
    }
  }

  /**
   * Handle the form submission to update a specific user by id
   */
  async update({ request, bouncer, response }: HttpContext) {
    const { params, ...payload } = await request.validateUsing(editUserValidator)
    const user = await User.findBy('id', params.id)

    if (!user) throw new BadRequestException('Usuário não encontrado.')

    if (await bouncer.with('UserPolicy').denies('update', user)) {
      return response.forbidden('Não pode visualizar todos os usuários.')
    }

    user.nickname = payload.nickname ?? user.nickname
    user.motto = payload.motto ?? user.motto
    user.role = payload.role ?? user.role
    if (payload.password) user.password = payload.password

    await user.save()

    return { user }
  }

  /**
   * Handle the form submission to desactivate or activate a specific user by id.
   */
  async toggleActive({ request, response, bouncer }: HttpContext) {
    const { params } = await request.validateUsing(toggleUserActiveValidator)
    const { id: userId } = params

    const user = await User.findBy('id', userId)

    if (!user) throw new BadRequestException('Usuário não encontrado.')

    if (await bouncer.with('UserPolicy').denies('toggleActive', user)) {
      return response.unauthorized('Não está autorizado a ativar ou desativar um usuário.')
    }

    user.active = !user.active
    await user.save()

    return response.noContent()
  }
}
