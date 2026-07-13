import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ArtGallerySection from '../components/ArtGallerySection';

const ArtGallery: React.FC = () => {
  const { artGallery } = useApp();

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-rose-900 py-16 text-white">
        <div className="container mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-rose-200 hover:text-white mb-6 transition-colors text-sm">
            <ArrowLeft size={16} /> Bosh sahifa
          </Link>
          <span className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-2 block">San'at</span>
          <h1 className="text-4xl md:text-5xl font-black">Art Galereya</h1>
          <p className="mt-4 text-lg text-rose-200 max-w-2xl">Ijodiy asarlar va badiiy ko'rgazmalar</p>
        </div>
      </div>
      
      <section className="py-16">
        <ArtGallerySection items={artGallery} />
      </section>
    </div>
  );
};

export default ArtGallery;
