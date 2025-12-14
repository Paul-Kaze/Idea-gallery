import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { ImageGallery } from './components/ImageGallery';
import { AuthButton } from './components/AuthButton';
import { ImageDetailModal } from './components/ImageDetailModal';

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  thumbnailUrl: string;
  fullUrl: string; // For video, this is the video URL. For image, this is the high-res image.
  model: string;
  prompt: string;
  width: number;
  height: number;
  duration?: string; // Duration for video (e.g., "0:15")
}

// Mock AI-generated images data
const mockItems: MediaItem[] = [
  {
    id: '1',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800',
    fullUrl: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwY2l0eXNjYXBlfGVufDF8fHx8MTc2NDM5NDAzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    model: 'Gemini 3 Pro',
    prompt: 'A futuristic cityscape at night with towering skyscrapers, neon lights reflecting on wet streets, flying cars in the sky, cyberpunk aesthetic, highly detailed, 8k resolution',
    width: 1200,
    height: 1600,
  },
  {
    id: '2',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1705254613735-1abb457f8a60?w=800',
    fullUrl: 'https://images.unsplash.com/photo-1705254613735-1abb457f8a60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGFydCUyMGNvbG9yZnVsfGVufDF8fHx8MTc2NDMzOTM5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    model: 'DALL-E 4',
    prompt: 'Abstract colorful swirls and patterns, vibrant gradients of pink, blue, orange and purple, fluid dynamics, digital art, mesmerizing composition',
    width: 1200,
    height: 800,
  },
  {
    id: 'v1',
    type: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1535016120720-40c6874c3b13?w=800',
    fullUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    model: 'Sora v1',
    prompt: 'Cinematic drone shot of a volcanic landscape with active lava flows, smoke rising, dramatic lighting, 4k video',
    width: 1920,
    height: 1080,
    duration: '0:15',
  },
  {
    id: '3',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800',
    fullUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwbGFuZHNjYXBlfGVufDF8fHx8MTc2NDI5NzI1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    model: 'Midjourney v7',
    prompt: 'Fantasy landscape with mystical mountains, glowing crystal formations, ethereal mist, magical aurora in the sky, enchanted forest in the foreground, epic composition',
    width: 1400,
    height: 900,
  },
  {
    id: '4',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1704098712141-5fc42b69a39f?w=800',
    fullUrl: 'https://images.unsplash.com/photo-1704098712141-5fc42b69a39f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY0MzEzNDM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    model: 'Stable Diffusion XL',
    prompt: 'Digital art portrait of a person with glowing geometric patterns, holographic effects, futuristic fashion, neon accents, cinematic lighting, photorealistic details',
    width: 1000,
    height: 1400,
  },
  {
    id: '5',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1615511676712-df98fcc708d5?w=800',
    fullUrl: 'https://images.unsplash.com/photo-1615511676712-df98fcc708d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBuZW9ufGVufDF8fHx8MTc2NDMxOTAyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    model: 'Gemini 3 Pro',
    prompt: 'Cyberpunk street scene with bright neon signs, rain-soaked pavement, holographic advertisements, people with umbrellas, moody atmosphere, blade runner inspired',
    width: 1200,
    height: 1800,
  },
  {
    id: 'v2',
    type: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800',
    fullUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    model: 'Runway Gen-2',
    prompt: 'Abstract animation of fluid shapes morphing in a dreamlike environment, surreal, colorful, 60fps',
    width: 1280,
    height: 720,
    duration: '0:10',
  },
  {
    id: '6',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1566103867526-08b0ca2aefcc?w=800',
    fullUrl: 'https://images.unsplash.com/photo-1566103867526-08b0ca2aefcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXJyZWFsJTIwZHJlYW1zY2FwZXxlbnwxfHx8fDE3NjQzMzA3NTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    model: 'Midjourney v7',
    prompt: 'Surreal dreamscape with floating islands, impossible architecture, Salvador Dali inspired, melting clocks, vibrant sky with multiple moons, artistic masterpiece',
    width: 1300,
    height: 950,
  },
  {
    id: '7',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1521999959675-c72dceffc51b?w=800',
    fullUrl: 'https://images.unsplash.com/photo-1521999959675-c72dceffc51b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtaWMlMjB1bml2ZXJzZXxlbnwxfHx8fDE3NjQ0MDI1MDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    model: 'DALL-E 4',
    prompt: 'Cosmic universe scene with swirling galaxies, nebula clouds in vibrant colors, stars and planets, deep space exploration, astronomical wonder, NASA inspired photography',
    width: 1600,
    height: 900,
  },
  {
    id: '8',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1498855926480-d98e83099315?w=800',
    fullUrl: 'https://images.unsplash.com/photo-1498855926480-d98e83099315?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzY0MzE5MzQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    model: 'Stable Diffusion XL',
    prompt: 'Majestic mountain landscape at sunset, dramatic peaks, golden hour lighting, pristine lake reflection, clouds rolling over mountains, nature photography, epic vista',
    width: 1400,
    height: 1000,
  },
  {
    id: '9',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?w=800',
    fullUrl: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmRlcndhdGVyJTIwb2NlYW58ZW58MXx8fHwxNzY0MzE2NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    model: 'Gemini 3 Pro',
    prompt: 'Underwater ocean scene with coral reefs, tropical fish swimming, sun rays penetrating water surface, marine life, crystal clear water, peaceful underwater world',
    width: 1200,
    height: 1500,
  },
  {
    id: '10',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=800',
    fullUrl: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3J0aGVybiUyMGxpZ2h0c3xlbnwxfHx8fDE3NjQzMzI1Njd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    model: 'Midjourney v7',
    prompt: 'Northern lights aurora borealis dancing in the night sky, vibrant green and purple colors, snowy landscape, starry sky, magical atmosphere, Iceland inspired',
    width: 1500,
    height: 1000,
  },
  {
    id: '11',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1614935981447-893ce3858657?w=800',
    fullUrl: 'https://images.unsplash.com/photo-1614935981447-893ce3858657?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjBzdW5zZXR8ZW58MXx8fHwxNzY0Mzk5NzE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    model: 'DALL-E 4',
    prompt: 'Desert sunset with sand dunes, warm orange and pink sky, long shadows, solitary traveler silhouette, peaceful isolation, minimalist composition, cinematic mood',
    width: 1300,
    height: 900,
  },
  {
    id: '12',
    type: 'image',
    thumbnailUrl: 'https://images.unsplash.com/photo-1662118535698-40b06d9d2481?w=800',
    fullUrl: 'https://images.unsplash.com/photo-1662118535698-40b06d9d2481?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjBteXN0aWNhbHxlbnwxfHx8fDE3NjQ0MDI1MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    model: 'Stable Diffusion XL',
    prompt: 'Mystical forest with ancient trees, fog rolling through, soft diffused light, magical atmosphere, fairy tale setting, moss covered ground, enchanted woodland',
    width: 1100,
    height: 1400,
  },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const handleLogin = () => {
    // Simulate Google login
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleItemClick = (item: MediaItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="max-w-[1920px] mx-auto px-8 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-gray-900" />
            <span className="text-lg text-gray-900">AI Image Gallery</span>
          </div>

          {/* Auth Button */}
          <AuthButton
            isAuthenticated={isAuthenticated}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 px-4 pb-8">
        <div className="max-w-[1920px] mx-auto">
          <ImageGallery items={mockItems} onItemClick={handleItemClick} />
        </div>
      </main>

      {/* Image Detail Modal */}
      {selectedItem && (
        <ImageDetailModal item={selectedItem} onClose={handleCloseModal} />
      )}
    </div>
  );
}
