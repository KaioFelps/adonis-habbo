export default function Home(props: { version: number }) {
  return (
    <main>
      <h1>home</h1>
      <strong>{props.version}</strong>
    </main>
  )
}
