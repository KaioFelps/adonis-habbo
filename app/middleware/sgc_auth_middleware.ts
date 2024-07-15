import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'
import { RolePermissions } from '../core/politics/role_permissions.js'

export default class SgcAuthMiddleware {
  redirectTo = '/'

  async handle(ctx: HttpContext, next: NextFn) {
    const role = ctx.auth.user?.role

    if (!role || !RolePermissions.roleHas(role, RolePermissions.Permission.HOUSEKEEPER_ACCESS)) {
      return ctx.response.redirect(this.redirectTo)
    }

    return next()
  }
}
