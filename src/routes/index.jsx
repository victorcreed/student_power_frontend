import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import ErrorPage from '../components/ErrorPage';

// Import your page components here
// For example:
// import HomePage from '../pages/HomePage';
// import AboutPage from '../pages/AboutPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      // Define child routes here
      // { path: 'about', element: <AboutPage /> },
      // { path: 'profile', element: <ProfilePage /> },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
