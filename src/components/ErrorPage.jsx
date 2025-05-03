import { useRouteError } from 'react-router-dom';

interface ErrorResponse {
  data: any;
  status: number;
  statusText: string;
  message?: string;
}

const ErrorPage = () => {
  const error = useRouteError() as ErrorResponse;
  console.error(error);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Oops!</h1>
        <p className="text-lg mb-4">Sorry, an unexpected error has occurred.</p>
        <p className="text-gray-600">
          {error.statusText || error.message || "Unknown error"}
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
