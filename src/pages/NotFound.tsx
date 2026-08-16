import { useLocation, Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-2">Oops! Page not found</p>
        <p className="text-sm text-gray-400 mb-4">{location.pathname}</p>
        <Link to="/" className="text-green-600 hover:text-green-700 underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
