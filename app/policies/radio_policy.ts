import User from '#models/user'
import RadioProgram from '#models/radio_program'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import { RolePermissions } from '../core/politics/role_permissions.js'

export default class RadioPolicy extends BasePolicy {
  async scheduleProgram(user: User) {
    return RolePermissions.roleHas(user.role, RolePermissions.Permission.SEE_ALL_USERS)
  }

  async unscheduleProgram(user: User) {}

  async scheduleProgramPromotion(user: User) {}

  async unscheduleProgramPromotion(user: User) {}
}
