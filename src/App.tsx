import { Outlet } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Header from '@components/layout/Header/Header.tsx'
import Footer from '@components/layout/Footer/Footer.tsx'

export default function App() {
  return (
    <HelmetProvider>
      <Header/>
      <main>
        <Outlet/>
      </main>
      <Footer/>
    </HelmetProvider>
  )
}