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
const RadioPromotionsController = () => import('#controllers/radio_promotions_controller')

const SiteController = () => import('#controllers/site_controller')
const SessionController = () => import('#controllers/session_controller')
const RadioController = () => import('#controllers/radio_controller')
const UsersController = () => import('#controllers/users_controller')

// SITE ROUTES
router
  .group(function () {
    router.get('/', [SiteController, 'home']).as('home')
    router.post('/login', [SessionController, 'login']).use(middleware.guest()).as('login')
    router.post('/logout', [SessionController, 'logout']).use(middleware.auth()).as('logout')
    router.post('/users/store', [UsersController, 'store']).as('users.store')
  })
  .use(middleware.initiate_auth_user())

// RADIO STATUS
router.get('/radio', [RadioController, 'getRadioStatus']).as('radio.status')

// SGC ROUTES
router
  .group(() => {
    router.get('/', ({ inertia }) => inertia.render('home', { version: 900 })).as('sgc.home')

    // USERS
    router.patch('/users/:id/update', [UsersController, 'update']).as('sgc.users.update')
    router
      .put('/users/:id/toggleactive', [UsersController, 'toggleActive'])
      .as('sgc.users.toggle_active')

    // RADIO
    router.post('/radio/schedule', [RadioController, 'scheduleProgram']).as('radio.schedule')
    router
      .delete('/radio/:id/unschedule', [RadioController, 'unscheduleProgram'])
      .as('radio.unschedule')

    // RADIO PROMOTIONS
    router
      .post('/radio/:programId/promote', [RadioPromotionsController, 'scheduleProgramPromotion'])
      .as('radio.promotion.schedule')
    router
      .delete('/radio/:programId/promote', [
        RadioPromotionsController,
        'unscheduleProgramPromotion',
      ])
      .as('radio.promotion.unschedule')
  })
  .prefix('sgc')
  .middleware([middleware.auth(), middleware.sgc_auth()])
