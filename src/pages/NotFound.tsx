import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { BiteMockup } from '../components/illustrations/BiteMockup';

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center gap-6 py-20 text-center">
      <Helmet>
        <title>Page Not Found — BetterBite</title>
      </Helmet>
      <div className="h-28 w-28 animate-float">
        <BiteMockup theme="chocolate" />
      </div>
      <h1 className="font-display text-3xl font-bold text-cocoa-700">This bite got eaten.</h1>
      <p className="max-w-sm text-cocoa-500">The page you're looking for doesn't exist anymore. Let's get you back to something sweet.</p>
      <Link to="/">
        <button className="btn-primary">Back to Home</button>
      </Link>
    </div>
  );
}
