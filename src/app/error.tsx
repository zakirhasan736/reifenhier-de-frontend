'use client'; 

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    const reporting = window as Window & {
      reifexaErrorReporting?: boolean;
      Sentry?: { captureException: (error: Error) => void };
    };
    if (reporting.reifexaErrorReporting) reporting.Sentry?.captureException(error);
    console.error('Error occurred:', error);
  }, [error]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Etwas ist schiefgelaufen!</h2>
      <p>{error.message || 'Ein unerwarteter Fehler ist aufgetreten.'}</p>
      <p>{error.digest && `Fehler-Digest: ${error.digest}`}</p>

      <button
        onClick={() => {
          // Attempt to recover by trying to re-render the segment
          reset();
        }}
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '5px',
        }}
      >
        Erneut versuchen
      </button>
    </div>
  );
}
