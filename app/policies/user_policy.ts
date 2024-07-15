import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import { RolePermissions } from '../core/politics/role_permissions.js'

export default class UserPolicy extends BasePolicy {
  index(user: User) {
    return RolePermissions.roleHas(user.role, RolePermissions.Permission.SEE_ALL_USERS)
  }

  edit(user: User): AuthorizerResponse {
    return RolePermissions.roleHas(user.role, RolePermissions.Permission.EDIT_USER)
  }

  update(user: User, model: User): AuthorizerResponse {
    if (
      user.id !== model.id &&
      !RolePermissions.roleHas(user.role, RolePermissions.Permission.EDIT_USER)
    )
      return false

    return true
  }

  toggleActive(user: User, model: User): AuthorizerResponse {
    if (
      !(user.id === model.id && user.active === false) &&
      !RolePermissions.roleHas(user.role, RolePermissions.Permission.TOGGLE_USER_ACTIVE)
    )
      return false

    return true
  }
}
