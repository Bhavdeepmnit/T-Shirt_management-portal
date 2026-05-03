import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface-50 p-4">
    <div className="text-center animate-scale-in">
      <p className="text-8xl mb-4">🔍</p>
      <h1 className="text-4xl font-bold text-surface-900 mb-2">404</h1>
      <p className="text-surface-500 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary">Go Home</Link>
    </div>
  </div>
);

export default NotFound;
