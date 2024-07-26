import { UserRole } from '#models/enums/user_role'

enum Permission {
  // ARTICLES
  POST_ARTICLE,
  TOGGLE_ARTICLE_ACTIVE,
  VIEW_UNPUBLISHED_ARTICLE,
  EDIT_ARTICLES,
  SEE_ALL_ARTICLES,

  // USERS
  EDIT_USER,
  TOGGLE_USER_ACTIVE,
  SEE_ALL_USERS,

  // COMMENTS
  TOGGLE_COMMENT_ACTIVE,
  EDIT_COMMENT,
  SEE_ALL_COMMENTS,

  // OTHERS
  HOUSEKEEPER_ACCESS,

  // RADIO
  SCHEDULE_PROGRAM,
  UNSCHEDULE_ANY_PROGRAM,

  // PROMOTERS
  SCHEDULE_PROGRAM_PROMOTION,
  UNSCHEDULE_ANY_PROGRAM_PROMOTION,

  // RÁDIO PRESENCES
  SEE_ALL_PRESENCES,
  CLEAN_PRESENCES,
}

export class RolePermissions {
  static Permission = Permission

  static [UserRole.USER]: Permission[] = []
  static [UserRole.EDITOR]: Permission[] = [
    ...this[UserRole.USER],
    Permission.POST_ARTICLE,
    Permission.HOUSEKEEPER_ACCESS,
  ]
  static [UserRole.PROMOTER]: Permission[] = [Permission.SCHEDULE_PROGRAM_PROMOTION]

  static [UserRole.BROADCASTER]: Permission[] = [Permission.SCHEDULE_PROGRAM]

  static [UserRole.SUPERVISOR]: Permission[] = [
    ...this[UserRole.EDITOR],
    ...this[UserRole.BROADCASTER],
    ...this[UserRole.PROMOTER],
    Permission.SEE_ALL_PRESENCES,
  ]

  static [UserRole.COORDENATOR]: Permission[] = [
    ...this[UserRole.SUPERVISOR],
    Permission.UNSCHEDULE_ANY_PROGRAM,
    Permission.UNSCHEDULE_ANY_PROGRAM_PROMOTION,
  ]

  static [UserRole.ADMINISTRATOR]: Permission[] = [
    ...this[UserRole.COORDENATOR],
    Permission.CLEAN_PRESENCES,
  ]

  static [UserRole.MANAGER]: Permission[] = [...this[UserRole.ADMINISTRATOR]]
  static [UserRole.CEO]: Permission[] = [...this[UserRole.MANAGER]]

  static roleHas(role: UserRole, permission: Permission): boolean {
    return this[role].includes(permission)
  }
}
