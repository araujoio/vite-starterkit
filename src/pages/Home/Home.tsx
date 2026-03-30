import { Head } from 'vite-react-ssg'

export default function Home() {
  return (
    <>
      <Head>
        <title>{import.meta.env.VITE_APP_TITLE}</title>
        <meta name="description" content={import.meta.env.VITE_APP_DESCRIPTION} />
        <link rel="canonical" href={import.meta.env.VITE_SITE_URL} />
        <meta property="og:title" content={import.meta.env.VITE_APP_TITLE} />
        <meta property="og:description" content={import.meta.env.VITE_APP_DESCRIPTION} />
        <meta property="og:url" content={import.meta.env.VITE_SITE_URL} />
      </Head>

      <main>
        <h1>Home</h1>
      </main>
    </>
  )
}
