/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const RadioController = () => import('#controllers/radio_controller')
const UsersController = () => import('#controllers/users_controller')

router.get('/', ({ inertia }) => inertia.render('home', { version: 500 }))

router
  .group(() => {
    router.post('/users/store', [UsersController, 'store'])

    router
      .group(() => {
        router.patch('/users/:id/update', [UsersController, 'update'])
        router.put('/users/:id/toggleactive', [UsersController, 'toggleActive'])
        router.get('/', ({ inertia }) => inertia.render('home', { version: 900 }))
      })
      .middleware([middleware.auth(), middleware.sgc_auth()])
  })
  .prefix('sgc')

router
  .group(() => {
    router.get('/', [RadioController, 'getRadioStatus'])

    router.post('/schedule', [RadioController, 'scheduleProgram'])
  })
  .prefix('/radio')
