import RadioProgram from '#models/radio_program'
import env from '#start/env'
import { programPromotionSchedulingValidator, scheduleProgramValidator } from '#validators/radio'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

type StreamData = {
  icestats: {
    admin: string
    banned_IPs: number
    build: number
    host: string
    location: string
    outgoing_kbitrate: number
    server_id: string
    server_start: string
    stream_kbytes_read: number
    stream_kbytes_sent: number
    source: {
      artist: string
      audio_info: string
      bitrate: number
      connected: number
      genre: string
      incoming_bitrate: number
      listener_peak: number
      listeners: number
      listenurl: string
      metadata_updated: string
      outgoing_kbitrate: number
      queue_size: number
      server_name: string
      server_type: string
      stream_start: string
      title: string
      total_mbytes_sent: number
      yp_currently_playing: string
    }
  }
}

export type RadioResponse = {
  listenersCount: number
  currentTrack: string
  announcer: string | null
  title: string | null
  streamUrl: string
}

export default class RadioController {
  async getRadioStatus({}: HttpContext) {
    const response = await fetch(env.get('KIHABBO_STREAM_DATA_URL'))
    const streamData = (await response.json()) as StreamData

    const now = DateTime.now().toSQL()

    const program = await RadioProgram.query()
      .select('*')
      .where((query) => {
        query.where('starts_at', '>=', now)
        query.where('ends_at', '<=', now)
      })
      .first()

    return {
      currentTrack: streamData.icestats.source.title,
      listenersCount: streamData.icestats.source.listeners,
      announcer: program?.announcer.nickname ?? null,
      title: program?.program ?? null,
      streamUrl: streamData.icestats.source.listenurl,
    } satisfies RadioResponse
  }

  async scheduleProgram({ request, response, auth }: HttpContext) {
    const [error, payload] = await scheduleProgramValidator.tryValidate(request.all())

    if (error) return response.badRequest(error)

    const radioProgram = await RadioProgram.create({
      ...payload,
      endsAt: DateTime.fromJSDate(payload.endsAt),
      startsAt: DateTime.fromJSDate(payload.startsAt),
    })

    await radioProgram.related('announcer').associate(auth.user!)
  }

  async unscheduleProgram({ request, response, auth }: HttpContext) {
    const [error, payload] = await scheduleProgramValidator.tryValidate(request.all())

    if (error) return response.badRequest(error)

    const radioProgram = await RadioProgram.create({
      ...payload,
      endsAt: DateTime.fromJSDate(payload.endsAt),
      startsAt: DateTime.fromJSDate(payload.startsAt),
    })

    await radioProgram.related('announcer').associate(auth.user!)
  }

  async scheduleProgramPromotion({ request, auth, response }: HttpContext) {
    const [error, payload] = await programPromotionSchedulingValidator.tryValidate(request.all())

    if (error) return response.badRequest(error)

    const radioProgram = await RadioProgram.findByOrFail('id', payload.params.programId)

    if (!radioProgram.promoter) await radioProgram.related('promoter').associate(auth.user!)
  }

  async unscheduleProgramPromotion({ request, auth, response }: HttpContext) {
    const [error, payload] = await programPromotionSchedulingValidator.tryValidate(request.all())

    if (error) return response.badRequest(error)

    const radioProgram = await RadioProgram.findByOrFail('id', payload.params.programId)

    if (radioProgram.promoter && radioProgram.promoter.id === auth.user?.id)
      await radioProgram.related('promoter').dissociate()
  }
}
