import RadioProgram from '#models/radio_program'
import env from '#start/env'
import { scheduleProgramValidator, unscheduleProgramValidator } from '#validators/radio'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { IErrorResponse } from '../core/types/spec/Error.js'

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
  promoter: string | null
  title: string | null
  streamUrl: string
}

export default class RadioController {
  async getRadioStatus({}: HttpContext) {
    const response = await fetch(env.get('KIHABBO_STREAM_DATA_URL'))
    const streamData = (await response.json()) as StreamData

    const now = DateTime.now().toUTC().toSQL()

    const program = await RadioProgram.query()
      .select('*')
      .where((query) => {
        query.where('starts_at', '<=', now)
        query.where('ends_at', '>=', now)
      })
      .preload('announcer')
      .preload('promoter')
      .first()

    return {
      currentTrack: streamData.icestats.source.title,
      listenersCount: streamData.icestats.source.listeners,
      announcer: program?.announcer.nickname ?? null,
      promoter: program?.promoter?.nickname ?? null,
      title: program?.name ?? null,
      streamUrl: streamData.icestats.source.listenurl,
    } satisfies RadioResponse
  }

  async scheduleProgram({ request, response, auth, bouncer }: HttpContext) {
    const user = await auth.authenticate()
    const [error, payload] = await scheduleProgramValidator.tryValidate(request.all())

    if (error) return response.badRequest(error)

    if (await bouncer.with('RadioPolicy').denies('scheduleProgram')) {
      return response.forbidden({
        code: 403,
        message: 'Você não pode agendar programas de rádio.',
      } satisfies IErrorResponse)
    }

    let radioProgram = new RadioProgram()
    radioProgram.name = payload.program
    radioProgram.endsAt = DateTime.fromJSDate(payload.endsAt)
    radioProgram.startsAt = DateTime.fromJSDate(payload.startsAt)

    radioProgram = await user.related('radioPrograms').create(radioProgram)

    return { program: radioProgram }
  }

  async unscheduleProgram({ request, response, bouncer }: HttpContext) {
    const [error, params] = await unscheduleProgramValidator.tryValidate(request.params())

    const notFoundResponse = response.notFound({
      code: 404,
      message: 'Programa não encontrado.',
    } satisfies IErrorResponse)

    if (error) return notFoundResponse

    const program = await RadioProgram.find(params.id)

    if (!program) return notFoundResponse

    if (await bouncer.with('RadioPolicy').denies('unscheduleProgram', program))
      return response.forbidden({
        code: 403,
        message: 'Você não pode agendar programas de rádio.',
      } satisfies IErrorResponse)

    await program.delete()

    return response.noContent()
  }
}
