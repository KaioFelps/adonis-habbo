import { useCallback, useEffect, useRef, useState } from 'react'
import { ImagerURL, type ImagerParamsArguments } from '~/infra/imager'
import { Play } from '@phosphor-icons/react/dist/ssr/Play'
import { Pause } from '@phosphor-icons/react/dist/ssr/Pause'
import { CheckFat } from '@phosphor-icons/react/dist/ssr/CheckFat'
import { SpeakerLow } from '@phosphor-icons/react/dist/ssr/SpeakerLow'
import { SpeakerHigh } from '@phosphor-icons/react/dist/ssr/SpeakerHigh'
import { Headphones } from '@phosphor-icons/react/dist/ssr/Headphones'
import { MicrophoneStage } from '@phosphor-icons/react/dist/ssr/MicrophoneStage'
import { RadioResponse } from '@/app/controllers/radio_controller'
import { clsx } from 'clsx'

type PlayerProps = {
  className?: string
  streamUrl: string
}

export function Player({ className }: PlayerProps) {
  const [announcerImage, setAnnouncerImage] = useState<string>('')
  const [listenersCount, setListenersCount] = useState(0)
  const [currentTrack, setCurrentTrack] = useState('')
  const [announcer, setAnnouncer] = useState('')
  const [programTitle, setProgramTitle] = useState<string | null>(null)
  const [radioIsPlaying, setRadioIsPlaying] = useState(false)
  const [streamUrl, setStreamUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const kihabboRadioLocalStorageKey = 'kihabbo_radio_playing_state'

  useEffect(() => {
    const newUrl = new URL(ImagerURL)
    const imagerParams = {
      direction: '2',
      head_direction: '3',
      img_format: 'png',
      size: 'm',
      user: announcer,
    } as ImagerParamsArguments

    newUrl.search = new URLSearchParams(imagerParams as Record<string, string>).toString()

    setAnnouncerImage(newUrl.toString())
  }, [announcer])

  const fetchRadioData = useCallback(async () => {
    const response = await fetch('/radio')

    if (response.ok) {
      const data: RadioResponse = await response.json()

      setCurrentTrack(data.currentTrack)
      setListenersCount(data.listenersCount)
      setAnnouncer(data.announcer ?? 'KihabboVirus')
      setProgramTitle(data.title ?? null)

      if (!streamUrl) {
        setStreamUrl(data.streamUrl)
        audioRef.current!.volume = 0.05
      }
    }
  }, [])

  useEffect(() => {
    fetchRadioData()

    const fetchInterval = setInterval(fetchRadioData, 5000)

    return () => {
      clearInterval(fetchInterval)
    }
  }, [])

  function handleToggleRadioPlayState() {
    localStorage.setItem(kihabboRadioLocalStorageKey, String(Number(!radioIsPlaying)))
    setRadioIsPlaying(!radioIsPlaying)

    if (radioIsPlaying) {
      audioRef.current?.pause()
    } else {
      audioRef.current?.play()
    }
  }

  return (
    <div
      className={clsx(
        'bg-black/25 backdrop-blur-md rounded-es-md rounded-ee-md p-6 flex flex-row gap-3 w-fit',
        className && className
      )}
    >
      <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-1000 relative">
        <img className="-mt-3" src={announcerImage} alt={announcer} />
        <div
          className="absolute inset-0 rounded-full shadow-blue-200 shadow-[inset_0_0_0_4px]"
          title={announcer}
        />
      </div>

      <div>
        <span
          title="Hit tocando no momento"
          className="block mb-2 leading-none font-ubuntu text-xl text-white"
        >
          Tocando: {programTitle ?? currentTrack}
        </span>

        <div className="flex gap-2">
          <div className="flex gap-2">
            <button
              title="Pausar/despausar a rádio"
              className="cursor-default text-white bg-white/10 border border-white/20 rounded-lg p-[7px] hover:bg-white/15 active:bg-white/20 transition-all"
              onClick={handleToggleRadioPlayState}
            >
              {radioIsPlaying ? (
                <Pause size={20} weight="fill" />
              ) : (
                <Play size={20} weight="fill" />
              )}
            </button>
            <button
              title="Marcar presença"
              className="cursor-default text-white bg-white/10 border border-white/20 rounded-lg p-[7px] hover:bg-white/15 active:bg-white/20 transition-all"
            >
              <CheckFat size={20} weight="fill" />
            </button>
            <div className="flex text-white bg-white/10 border-white/20 border rounded-lg">
              <button
                onClick={() => {
                  const newVolume = audioRef.current!.volume - 0.05
                  if (newVolume < 0) {
                    audioRef.current!.volume = 0
                  } else {
                    audioRef.current!.volume = newVolume
                  }
                }}
                title="Diminuir o volume"
                className="cursor-default p-[7px] border-white/20 hover:bg-white/15 active:bg-white/20 transition-all border-r rounded-ss-lg rounded-es-lg last:border-0"
              >
                <SpeakerLow size={20} weight="fill" />
              </button>
              <button
                onClick={() => {
                  const newVolume = audioRef.current!.volume + 0.05
                  if (newVolume > 1) {
                    audioRef.current!.volume = 1
                  } else {
                    audioRef.current!.volume = newVolume
                  }
                }}
                title="Aumentar o volume"
                className="cursor-default p-[7px] border-white/20 hover:bg-white/15 active:bg-white/20 transition-all border-r  last:border-0 rounded-se-lg rounded-ee-lg"
              >
                <SpeakerHigh size={20} weight="fill" />
              </button>
            </div>
          </div>

          <span className="cursor-default flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 text-white/70 font-ubuntu text-lg leading-none align-middle">
            <Headphones size={18} weight="fill" /> {listenersCount}{' '}
            {listenersCount === 0 ? 'ouvinte' : 'ouvintes'}
          </span>
          <span
            title="Locutor"
            className="cursor-default flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 text-white/70 font-ubuntu text-lg leading-none align-middle"
          >
            <MicrophoneStage size={18} weight="fill" /> {announcer}
          </span>
        </div>
      </div>

      <audio className="w-0 h-0 absolute" src={streamUrl ?? undefined} ref={audioRef}></audio>
    </div>
  )
}
