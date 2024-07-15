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
  SCHEDULE_PROGRAM
}

export class RolePermissions {
  static Permission = Permission

  static [UserRole.USER]: Permission[] = []
  static [UserRole.EDITOR]: Permission[] = [
    ...this[UserRole.USER],
    Permission.POST_ARTICLE,
    Permission.HOUSEKEEPER_ACCESS,
  ]
  static [UserRole.SUPERVISOR]: Permission[] = [...this[UserRole.EDITOR]]
  static [UserRole.COORDENATOR]: Permission[] = [...this[UserRole.SUPERVISOR]]
  static [UserRole.ADMINISTRATOR]: Permission[] = [...this[UserRole.COORDENATOR]]
  static [UserRole.MANAGER]: Permission[] = [...this[UserRole.ADMINISTRATOR]]
  static [UserRole.CEO]: Permission[] = [...this[UserRole.MANAGER]]

  static roleHas(role: UserRole, permission: Permission): boolean {
    return this[role].includes(permission)
  }
}
