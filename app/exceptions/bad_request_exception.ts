import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class BadRequestException extends Exception {
  static status = 400
  static code = 'E_BADREQUEST'

  constructor(message?: string) {
    super(message)
  }

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({ error: error.message })
  }
}
