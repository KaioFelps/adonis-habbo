import User from '#models/user'
import RadioProgram from '#models/radio_program'
import { BasePolicy } from '@adonisjs/bouncer'
import { RolePermissions } from '../core/politics/role_permissions.js'

export default class RadioPolicy extends BasePolicy {
  async scheduleProgram(user: User) {
    return RolePermissions.roleHas(user.role, RolePermissions.Permission.SCHEDULE_PROGRAM)
  }

  async unscheduleProgram(user: User, program: RadioProgram) {
    if (program.announcerId === user.id) return true

    return RolePermissions.roleHas(user.role, RolePermissions.Permission.UNSCHEDULE_ANY_PROGRAM)
  }
}
