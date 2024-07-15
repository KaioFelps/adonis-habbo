import '../css/app.css'

import ReactDOMServer from 'react-dom/server'
import { createInertiaApp } from '@inertiajs/react'
import { ReactNode } from 'react'
import { LoggedLayout } from '~/layouts/logged'

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      const pages = import.meta.glob('../pages/**/*.tsx', { eager: true })
      const page: any = pages[`../pages/${name}.tsx`]

      page['default'].layout =
        page['default'].layout || ((page: ReactNode) => <LoggedLayout>{page}</LoggedLayout>)

      return page
    },
    setup: ({ App, props }) => <App {...props} />,
  })
}
