import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from './components/Navbar';
import MainContent from "./MainPage";
import Profiles from './components/Profiles'
import Compare from "./components/Compare";
import Analytics from './components/Analytics'
import Login from './pages/MainLoginPage';

const route = createBrowserRouter([
  {
    path: '/',
    element: <MainContent/>,
  },
  {
    path: '/profiles',
    element: <Profiles/>
  },
  {
    path: '/compare',
    element: <Compare key={'new'}/>
  },
  {
    path: '/analytics',
    element: <Analytics></Analytics>
  },
  {
    path: '/login',
    element: <Login></Login>
  }
])

const App = () => {
  return (
    <div>
      <RouterProvider router={route}></RouterProvider>
    </div>
  )
}

export default App
