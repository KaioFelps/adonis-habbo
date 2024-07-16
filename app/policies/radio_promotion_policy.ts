import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import RadioProgram from '#models/radio_program'
import { RolePermissions } from '../core/politics/role_permissions.js'

export default class RadioPromotionPolicy extends BasePolicy {
  async schedulePromotion(user: User) {
    return RolePermissions.roleHas(user.role, RolePermissions.Permission.SCHEDULE_PROGRAM_PROMOTION)
  }

  async unschedulePromotion(user: User, program: RadioProgram) {
    if (program.promoterId === user.id) return true

    return RolePermissions.roleHas(
      user.role,
      RolePermissions.Permission.UNSCHEDULE_ANY_PROGRAM_PROMOTION
    )
  }
}
