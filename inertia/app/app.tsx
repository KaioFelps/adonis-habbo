/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import { hydrateRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { ReactNode } from 'react'
import { LoggedLayout } from '~/layouts/logged'

const appName = import.meta.env.VITE_APP_NAME || 'KikiCMS'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => (title ? `${appName} - ${title}` : title),

  resolve: async (name) => {
    const page: any = await resolvePageComponent(
      `../pages/${name}.tsx`,
      import.meta.glob('../pages/**/*.tsx')
    )
    page['default'].layout =
      page['default'].layout || ((page: ReactNode) => <LoggedLayout>{page}</LoggedLayout>)

    return page
  },

  setup({ el, App, props }) {
    hydrateRoot(el, <App {...props} />)
  },
})
