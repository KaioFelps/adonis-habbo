import { Link } from '@inertiajs/react'
import { Player } from './player'

type HeaderProps = {
  streamUrl: string
}

export function Header({ streamUrl }: HeaderProps) {
  return (
    <header>
      <div className="h-[260px] w-full">
        <div className="w-[calc(100%_-_48px)] max-w-screen-main mx-auto flex flex-row justify-between h-full">
          <img src="" alt="" />

          <Player streamUrl={streamUrl} className="self-start" />
        </div>
      </div>

      <div className="bg-blue-700">
        <div className="flex gap-6 justify-between items-center max-w-screen-main mx-auto">
          <nav
            className="
            flex
            prose-a:cursor-default prose-a:font-ubuntu prose-a:text-[22px] prose-a:p-6 prose-a:leading-none text-white prose-a:bg-white/0 prose-a:transition-all prose-a:shadow-blue-400 prose-a:shadow-[inset_0_0_0_0]
            hover:prose-a:bg-white/5 hover:prose-a:shadow-blue-400 hover:prose-a:shadow-[inset_0_-3px_0_0] active:prose-a:bg-white/10
            "
          >
            <Link href="/">Início</Link>
            <Link href="/">Acervo de notícias</Link>
            <Link href="/">Criadores de conteúdo</Link>
            <Link href="/">Sobre nós</Link>
            <Link href="/">Equipe</Link>
            <Link href="/">Eventos</Link>
          </nav>

          <div className="flex gap-3">
            <button>Criar conta</button>
            <button>Login</button>
          </div>
        </div>
      </div>
    </header>
  )
}
