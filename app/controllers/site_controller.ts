import type { HttpContext } from '@adonisjs/core/http'

export default class SiteController {
  home({ inertia }: HttpContext) {
    return inertia.render('home', { version: 400 })
  }
}
