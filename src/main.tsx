import { ViteReactSSG } from 'vite-react-ssg'
import './assets/css/index.css'
import App from './App.tsx'

const routes = [
  {
    path: '/',
    element: <App/>,
    children: [
      {
        index: true,
        lazy: () => import('./pages/Home/Home.tsx')
          .then(m => ({ element: <m.default/> })),
      },
    ],
  },
]

export const createRoot = ViteReactSSG({ routes }, () => {})