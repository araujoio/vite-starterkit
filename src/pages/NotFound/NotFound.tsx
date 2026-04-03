import { Head } from "vite-react-ssg"

export default function NotFound() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
        <meta name="description" content="404 - Page Not Found" />
        <link rel="canonical" href={`${import.meta.env.SITE_URL}/404`} />
        <meta property="og:title" content="404 - Page Not Found" />
        <meta property="og:description" content="404 - Page Not Found" />
        <meta property="og:url" content={`${import.meta.env.SITE_URL}/404`} />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main>
        <h1 className="font-bold text-2xl">404 - Page Not Found</h1>
      </main>
    </>
  )
}