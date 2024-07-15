import { defineConfig } from '@adonisjs/shield'
import type { ShieldConfig } from '@adonisjs/shield/types'
import { minimatch } from 'minimatch'

/**
 * Define glob patterns of routes that will be ignoring by
 * the csrf protection
 */
const exceptCsrfRoutes: string[] = []

const shieldConfig = {
  /**
   * Configure CSP policies for your app. Refer documentation
   * to learn more
   */
  csp: {
    enabled: false,
    directives: {},
    reportOnly: false,
  },

  /**
   * Configure CSRF protection options. Refer documentation
   * to learn more
   */
  csrf: {
    enabled: false,
    exceptRoutes: (ctx) => {
      let matchedAnyPattern = false

      exceptCsrfRoutes.forEach((pattern) => {
        const matches = minimatch(ctx.request.url(false), pattern)

        if (matches) {
          matchedAnyPattern = true
        }
      })

      return matchedAnyPattern
    },
    enableXsrfCookie: true,
    methods: ['POST', 'PUT', 'PATCH', 'DELETE'],
  },

  /**
   * Control how your website should be embedded inside
   * iFrames
   */
  xFrame: {
    enabled: true,
    action: 'DENY',
  },

  /**
   * Force browser to always use HTTPS
   */
  hsts: {
    enabled: true,
    maxAge: '180 days',
  },

  /**
   * Disable browsers from sniffing the content type of a
   * response and always rely on the "content-type" header.
   */
  contentTypeSniffing: {
    enabled: true,
  },
} satisfies Partial<ShieldConfig>

export default defineConfig(shieldConfig)
