import React, { useState } from 'react';
import useAiGeneratorStore from '../../store/aiGeneratorStore';
import { FaRobot, FaSpinner } from 'react-icons/fa';

interface CardImageGeneratorProps {
  onImageGenerated: (imageUrl: string) => void;
}

export function CardImageGenerator({ onImageGenerated }: CardImageGeneratorProps) {
  const { settings, apiSettings } = useAiGeneratorStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    prompt: '',
    negativePrompt: '',
    style: 'anime',  // Default style
    provider: localStorage.getItem('aiGenerator_provider') || 'seaart',
    model: 'anything-v5',  // Default model
  });

  const seaartModels = [
    { id: 'anything-v5', name: 'Anything V5' },
    { id: 'realistic-vision-v51', name: 'Realistic Vision V5.1' },
    { id: 'dreamshaper-v8', name: 'DreamShaper V8' },
    { id: 'deliberate-v3', name: 'Deliberate V3' },
    { id: 'sdxl-base', name: 'SDXL Base' },
    { id: 'dark-sushi-mix', name: 'Dark Sushi Mix' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateImage = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINTS.GENERATE_IMAGE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: formData.provider,
          prompt: formData.prompt,
          negative_prompt: formData.negativePrompt,
          style: formData.style,
          model: formData.model,
          width: 512,
          height: 768,
        }),
        credentials: 'include'  // This ensures cookies are sent
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      if (data.imageUrl) {
        onImageGenerated(data.imageUrl);
      } else {
        throw new Error('No image URL in response');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4 bg-gray-800/50 rounded-xl p-6 border border-purple-500/30">
      <div className="flex items-center gap-2 mb-4">
        <FaRobot className="text-purple-400" />
        <h3 className="text-lg font-semibold text-purple-300">Generate Card Image</h3>
      </div>

      <div className="space-y-4">
        {/* Prompt Input */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Prompt</label>
          <textarea
            name="prompt"
            value={formData.prompt}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg"
            placeholder="Describe your image..."
            rows={3}
          />
        </div>

        {/* Negative Prompt Input */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Negative Prompt</label>
          <textarea
            name="negativePrompt"
            value={formData.negativePrompt}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg"
            placeholder="What to avoid in the image..."
            rows={2}
          />
        </div>

        {/* Model Selection for SeaArt */}
        {formData.provider === 'seaart' && (
          <div>
            <label className="block text-sm text-gray-300 mb-1">Model</label>
            <select
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg"
            >
              {seaartModels.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Style Selection */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Style</label>
          <select
            name="style"
            value={formData.style}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg"
          >
            {settings?.artStyles?.map((style: string) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>

        {/* Provider Selection */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">AI Provider</label>
          <select
            name="provider"
            value={formData.provider}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg"
          >
            <option value="seaart">SeaArt AI</option>
            <option value="tensorart">TensorArt</option>
          </select>
        </div>

        {error && (
          <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={generateImage}
            disabled={isGenerating || !formData.prompt}
            className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
              isGenerating
                ? 'bg-purple-600/50 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-500'
            } text-white transition-colors`}
          >
            {isGenerating ? (
              <>
                <FaSpinner className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FaRobot />
                Generate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
