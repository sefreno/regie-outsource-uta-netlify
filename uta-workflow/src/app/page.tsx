import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">UTA Rénovation Énergétique</h1>
        <p className="mb-6">Plateforme de gestion des dossiers</p>
        <Link
          href="/login/"
          className="inline-block px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Accéder à l'application
        </Link>
      </div>
    </div>
  );
}
