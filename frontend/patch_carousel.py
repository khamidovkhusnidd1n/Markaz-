import re

file_path = r'C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\frontend\pages\Portfolio.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

replacement1 = '''const ImageCarousel = ({ images, containerClassName = "h-64 bg-gray-100 rounded-t-xl" }: { images: any[], containerClassName?: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={`w-full flex items-center justify-center ${containerClassName}`}>
        <Briefcase size={48} className="text-gray-300" />
      </div>
    );
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={`relative w-full group overflow-hidden ${containerClassName}`}>'''

content = content.replace(
    '''const ImageCarousel = ({ images }: { images: any[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-t-xl">
        <Briefcase size={48} className="text-gray-300" />
      </div>
    );
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-64 group bg-black rounded-t-xl overflow-hidden">''',
    replacement1
)


# Replace modal usage
modal_target = '''            <div className="p-0">
              {/* Reuse ImageCarousel but make it larger */}
              {selectedProject.images && selectedProject.images.length > 0 ? (
                <div className="h-96 w-full relative bg-black">
                  <ImageCarousel images={selectedProject.images} />
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                  <Briefcase size={64} className="text-gray-300" />
                </div>
              )}
            </div>'''

modal_replace = '''            <div className="p-0 bg-slate-50 border-b border-gray-100">
              {selectedProject.images && selectedProject.images.length > 0 ? (
                <ImageCarousel 
                  images={selectedProject.images} 
                  containerClassName="h-[500px] w-full bg-slate-50"
                />
              ) : (
                <div className="w-full h-[500px] bg-slate-50 flex items-center justify-center">
                  <Briefcase size={64} className="text-gray-300" />
                </div>
              )}
            </div>'''

content = content.replace(modal_target, modal_replace)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Carousel patched")
