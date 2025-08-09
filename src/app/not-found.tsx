'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found-wrapper py-12 h-[80vh]">
      <div className="custom-container h-full">
        <div className="not-found-cont flex flex-col justify-center items-center h-full">
          <h4 className="text-center">Nicht gefunden</h4>
          <p className="text-center">Die angeforderte Ressource konnte nicht gefunden werden</p>
          <Link href="/" className="primary-btn btn-styles mt-6 mx-auto block">
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}
