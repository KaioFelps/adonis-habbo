import { ReactNode } from 'react'
import { Header } from '~/ui/header'

type LoggedLayoutProps = {
  children: ReactNode
}

export function LoggedLayout({ children }: LoggedLayoutProps) {
  return (
    <>
      <Header />
      {children}
      <footer>footer</footer>
    </>
  )
}
