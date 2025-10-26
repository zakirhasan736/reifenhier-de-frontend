'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') || ''; // optional chaining prevents TS warning
  const [message, setMessage] = useState('Wird verarbeitet...');

  useEffect(() => {
    const handleUnsubscribe = async () => {
      if (!token) {
        setMessage('Ungültiger oder fehlender Link.');
        return;
      }

      try {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'
          }/api/newsletter/unsubscribe`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          }
        );

        const data = await res.json();
        setMessage(data.message || 'Fehler beim Abmelden.');
      } catch (err) {
        console.error(err);
        setMessage('Serverfehler. Bitte versuchen Sie es später erneut.');
      }
    };

    handleUnsubscribe();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Newsletter Abmeldung</h1>
      <p className="text-gray-700">{message}</p>
    </div>
  );
}
