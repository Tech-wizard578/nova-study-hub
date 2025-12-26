import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, Search, Eye, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { getMaterials, incrementDownloads, getDownloadUrl } from '@/services/materialsService';
import { downloadFile } from '@/utils/downloadHelper';

const StudyMaterialsSection = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch materials on component mount
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const data = await getMaterials();
        setMaterials(data);
      } catch (error) {
        console.error('Failed to fetch materials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  // Extract unique categories from materials
  const categories = ['All', ...Array.from(new Set(materials.map(m => m.category)))];

  const filteredMaterials = materials.filter(
    (material) =>
      (activeCategory === 'All' || material.category === activeCategory) &&
      material.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredMaterials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredMaterials.length) % filteredMaterials.length);
  };

  const handleDownload = async (material: any) => {
    try {
      await incrementDownloads(material.id);
      const url = await getDownloadUrl(material.file_path, material.file_url);

      // Extract file extension from the URL or file_path
      const fileExt = material.file_path?.split('.').pop() || 'pdf';
      const filename = `${material.title}.${fileExt}`;

      // Download the file using the helper
      await downloadFile(url, filename);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  // Color palette for cards
  const colorPalette = [
    'from-primary to-primary/50',
    'from-secondary to-secondary/50',
    'from-accent to-accent/50',
    'from-primary via-accent to-secondary',
    'from-secondary to-primary',
  ];

  return (
    <section id="materials" className="relative py-24 px-4" data-tour="study-materials">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <FileText className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">Resource Library</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Study{' '}
            <span className="gradient-text">Materials</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access our extensive library of study materials, curated and verified
            by top educators and students.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-card/60 backdrop-blur-xl border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${activeCategory === category
                  ? 'bg-gradient-primary text-primary-foreground'
                  : 'bg-card/60 text-muted-foreground hover:text-foreground border border-white/10'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading materials...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredMaterials.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[400px] glass-card rounded-xl p-12">
            <FileText className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">No materials found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {searchQuery || activeCategory !== 'All'
                ? 'Try adjusting your search or filters'
                : 'No study materials have been uploaded yet. Check back soon!'}
            </p>
          </div>
        )}

        {/* 3D Card Carousel */}
        {!loading && filteredMaterials.length > 0 && (
          <div className="relative">
            {/* Navigation Buttons */}
            {filteredMaterials.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 glass-card flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 glass-card flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Cards Container */}
            <div className="flex justify-center items-center min-h-[400px] perspective-1000">
              {filteredMaterials.map((material, index) => {
                const offset = index - currentIndex;
                const isActive = offset === 0;
                const isPrev = offset === -1 || (currentIndex === 0 && index === filteredMaterials.length - 1);
                const isNext = offset === 1 || (currentIndex === filteredMaterials.length - 1 && index === 0);
                const isVisible = isActive || isPrev || isNext;

                if (!isVisible) return null;

                const color = colorPalette[index % colorPalette.length];

                return (
                  <div
                    key={material.id}
                    className={`absolute transition-all duration-500 ${isActive
                      ? 'z-20 scale-100 opacity-100'
                      : 'z-10 scale-90 opacity-60'
                      }`}
                    style={{
                      transform: `
                        translateX(${offset * 280}px) 
                        rotateY(${offset * -15}deg)
                        ${isActive ? '' : 'translateZ(-100px)'}
                      `,
                    }}
                  >
                    <div className="glass-card w-72 p-6 card-3d">
                      {/* Document Preview */}
                      <div className={`h-40 rounded-xl bg-gradient-to-br ${color} mb-6 flex items-center justify-center relative overflow-hidden`}>
                        <FileText className="w-16 h-16 text-primary-foreground/80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />

                        {/* Decorative lines */}
                        <div className="absolute bottom-4 left-4 right-4 space-y-2">
                          <div className="h-2 bg-primary-foreground/30 rounded w-3/4" />
                          <div className="h-2 bg-primary-foreground/20 rounded w-1/2" />
                          <div className="h-2 bg-primary-foreground/10 rounded w-2/3" />
                        </div>
                      </div>

                      {/* Content */}
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary mb-3 inline-block">
                        {material.category}
                      </span>
                      <h3 className="font-display font-bold text-lg mb-4 line-clamp-2">
                        {material.title}
                      </h3>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          {material.downloads?.toLocaleString() || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {material.views?.toLocaleString() || 0}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="glow"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleDownload(material)}
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dots Indicator */}
            {filteredMaterials.length > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {filteredMaterials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                      ? 'w-8 bg-gradient-primary'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                      }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default StudyMaterialsSection;

