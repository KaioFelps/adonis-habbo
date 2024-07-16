import { InferPageProps } from '@adonisjs/inertia/types'
import { useForm } from '@inertiajs/react'
import { FormEvent, useCallback } from 'react'
import type SiteController from '@/app/controllers/site_controller'

type LoginForm = {
  password: string
  nickname: string
  rememberMe: boolean
}

export default function Home(props: InferPageProps<SiteController, 'home'>) {
  const loginForm = useForm<LoginForm>({ nickname: '', password: '', rememberMe: false })

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      console.log(loginForm.data)
      loginForm.post('/login', {})
    },
    [loginForm.data]
  )

  return (
    <main>
      <h1>home</h1>
      <strong>{props.version}</strong>

      {!props.user ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="nick">nickname</label>
          <input
            type="text"
            id="nick"
            name="nickname"
            onInput={(event) => {
              loginForm.setData({ ...loginForm.data, nickname: event.currentTarget.value })
            }}
          />
          <br />
          <br />
          <label htmlFor="senha">senha</label>
          <input
            type="text"
            id="senha"
            name="password"
            onInput={(e) => {
              loginForm.setData({ ...loginForm.data, password: e.currentTarget.value })
            }}
          />
          <br />
          <br />
          <label htmlFor="remember">lembrar login</label>
          <input
            type="checkbox"
            id="remember"
            name="rememberMe"
            onInput={(e) => {
              loginForm.setData({
                ...loginForm.data,
                rememberMe: e.currentTarget.value === 'on' ? true : false,
              })
            }}
          />
          <br />

          <button type="submit" className="btn">
            enviar
          </button>
        </form>
      ) : (
        `você está logado como ${props.user.nickname}`
      )}
    </main>
  )
}
