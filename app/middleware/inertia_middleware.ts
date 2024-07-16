import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class InertiaMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    ctx.inertia.share({
      user: (ctx: HttpContext) => ctx.auth?.user ?? null,
    })

    /**
     * Call next method in the pipeline and return its output
     */
    return await next()
  }
}
