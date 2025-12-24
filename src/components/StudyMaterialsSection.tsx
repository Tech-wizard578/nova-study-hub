import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

const categories = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];

const materials = [
  {
    id: 1,
    title: 'Calculus Complete Guide',
    category: 'Mathematics',
    downloads: 2340,
    views: 8920,
    color: 'from-primary to-primary/50',
  },
  {
    id: 2,
    title: 'Quantum Physics Simplified',
    category: 'Physics',
    downloads: 1890,
    views: 6540,
    color: 'from-secondary to-secondary/50',
  },
  {
    id: 3,
    title: 'Organic Chemistry Notes',
    category: 'Chemistry',
    downloads: 3120,
    views: 11200,
    color: 'from-accent to-accent/50',
  },
  {
    id: 4,
    title: 'Data Structures & Algorithms',
    category: 'Computer Science',
    downloads: 4560,
    views: 15800,
    color: 'from-primary via-accent to-secondary',
  },
  {
    id: 5,
    title: 'Cell Biology Handbook',
    category: 'Biology',
    downloads: 1670,
    views: 5230,
    color: 'from-secondary to-primary',
  },
];

const StudyMaterialsSection = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
    <section id="materials" className="relative py-24 px-4">
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
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-gradient-primary text-primary-foreground'
                    : 'bg-card/60 text-muted-foreground hover:text-foreground border border-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Card Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
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

          {/* Cards Container */}
          <div className="flex justify-center items-center min-h-[400px] perspective-1000">
            {filteredMaterials.map((material, index) => {
              const offset = index - currentIndex;
              const isActive = offset === 0;
              const isPrev = offset === -1 || (currentIndex === 0 && index === filteredMaterials.length - 1);
              const isNext = offset === 1 || (currentIndex === filteredMaterials.length - 1 && index === 0);
              const isVisible = isActive || isPrev || isNext;

              if (!isVisible) return null;

              return (
                <div
                  key={material.id}
                  className={`absolute transition-all duration-500 ${
                    isActive
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
                    <div className={`h-40 rounded-xl bg-gradient-to-br ${material.color} mb-6 flex items-center justify-center relative overflow-hidden`}>
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
                    <h3 className="font-display font-bold text-lg mb-4">
                      {material.title}
                    </h3>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {material.downloads.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {material.views.toLocaleString()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="glow" size="sm" className="flex-1">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                      <Button variant="glass" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {filteredMaterials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-gradient-primary'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudyMaterialsSection;
