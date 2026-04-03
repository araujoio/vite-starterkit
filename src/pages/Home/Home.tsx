import { Head } from 'vite-react-ssg'

export default function Home() {
  return (
    <>
      <Head>
        <title>{import.meta.env.APP_TITLE}</title>
        <meta name="description" content={import.meta.env.APP_DESCRIPTION} />
        <link rel="canonical" href={import.meta.env.SITE_URL} />
        <meta property="og:title" content={import.meta.env.APP_TITLE} />
        <meta property="og:description" content={import.meta.env.APP_DESCRIPTION} />
        <meta property="og:url" content={import.meta.env.SITE_URL} />
      </Head>

      <main>
        <h1 className="font-bold text-2xl">Home</h1>
      </main>
    </>
  )
}
