import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { CardImageGenerator } from './CardImageGenerator';

interface CardFormProps {
  card?: any;
  onSubmit: (cardData: any) => void;
  onCancel: () => void;
  onGenerateImage: (prompt: string) => void;
}

const CARD_RANKS = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
};

export function CardForm({ card, onSubmit, onCancel, onGenerateImage }: CardFormProps) {
  const { classes, categories } = useGameStore();
  const [formData, setFormData] = useState({
    name: card?.name || '',
    description: card?.description || '',
    imageUrl: card?.imageUrl || '',
    class: card?.classId || '',
    category: card?.category || '',
    rank: card?.cardRank || 'COMMON',
    starLevel: card?.starRank || 1,
    health: card?.stats?.health || 0,
    energy: card?.stats?.energy || 0,
    money: card?.stats?.money || 0,
    experience: card?.rewards?.experience || 0,
    rewardMoney: card?.rewards?.money || 0,
    rewardItems: card?.rewards?.items || [],
    imagePrompt: ''
  });
  const [imagePreview, setImagePreview] = useState(card?.imageUrl || '');
  const [imageError, setImageError] = useState(false);
  const [hasInteractedWithUrl, setHasInteractedWithUrl] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'imageUrl') {
      setImagePreview(value);
      setImageError(false);
      setHasInteractedWithUrl(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cardData = {
      id: card?.id || `card-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      imageUrl: formData.imageUrl || '',
      class: formData.class,
      category: formData.category.toUpperCase(),
      cardRank: formData.rank.toUpperCase(),
      starRank: parseInt(formData.starLevel.toString()),
      power: 10,
      defense: 10,
      speed: 10,
      level: 1,
      health: parseInt(formData.health.toString()) || 100,
      energy: parseInt(formData.energy.toString()) || 100,
      skills: []
    };

    console.log('Submitting card data:', cardData);
    onSubmit(cardData);
  };

  const handleImageError = () => {
    // Only show error if there's a URL and user has interacted with the field
    if (formData.imageUrl && hasInteractedWithUrl) {
      setImageError(true);
      setImagePreview('/placeholder-card.png');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-gray-800 rounded-lg p-4 md:p-6 w-full max-w-2xl my-8">
        <div className="max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            {card ? 'Edit Card' : 'Create New Card'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black/40 border border-purple-500/20 rounded-lg text-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black/40 border border-purple-500/20 rounded-lg text-gray-200"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Class</label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black/40 border border-purple-500/20 rounded-lg text-gray-200"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Star Level</label>
                <select
                  name="starLevel"
                  value={formData.starLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black/40 border border-purple-500/20 rounded-lg text-gray-200"
                  required
                >
                  <option value="1">★</option>
                  <option value="2">★★</option>
                  <option value="3">★★★</option>
                  <option value="4">★★★★</option>
                  <option value="5">★★★★★</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-1">Rank</label>
                <select
                  name="rank"
                  value={formData.rank}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black/40 border border-purple-500/20 rounded-lg text-gray-200"
                  required
                >
                  <option value="">Select Rank</option>
                  {Object.entries(CARD_RANKS).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 h-32 bg-black/40 border border-purple-500/20 rounded-lg text-gray-200"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Image URL</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black/40 border border-purple-500/20 rounded-lg text-gray-200"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-400 hover:text-purple-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30"
              >
                {card ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
