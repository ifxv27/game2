import React, { useState } from 'react';
import { API_ENDPOINTS, apiRequest } from '../../config/api';
import useAiGeneratorStore from '../../store/aiGeneratorStore';
import { FaRobot, FaSpinner, FaMagic, FaUndo, FaRandom } from 'react-icons/fa';

interface ImageGeneratorProps {
  onImageGenerated: (imageUrl: string) => void;
}

const SEAART_MODELS = [
  { id: 'colossus-project-flux', name: 'Colossus Project Flux' },
  { id: '2.1-de-distilled-aio-exp', name: '2.1 de-distilled AIO exp' },
  { id: 'checkpoint-f1', name: 'Checkpoint | F1' },
  { id: 'the-best-realism-2.2', name: 'The Best Realism 2.2' },
  { id: 'rtx', name: 'RTX' },
  { id: 'level4', name: 'Level4' },
  { id: 'v5.0-baked-vae-fp16', name: 'v5.0 Baked VAE fp16' },
  { id: 'flux-new-mix', name: 'FLUX New Mix' },
  { id: 'anything-v5', name: 'Anything V5' },
  { id: 'realistic-vision-v51', name: 'Realistic Vision V5.1' },
  { id: 'dreamshaper-v8', name: 'DreamShaper V8' },
  { id: 'deliberate-v3', name: 'Deliberate V3' },
  { id: 'sdxl-base', name: 'SDXL Base' },
  { id: 'dark-sushi-mix', name: 'Dark Sushi Mix' }
];

export function ImageGenerator({ onImageGenerated }: ImageGeneratorProps) {
  const aiGeneratorSettings = useAiGeneratorStore((state) => state.settings);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    characterName: '',
    style: aiGeneratorSettings.artStyles[0] || 'anime',
    theme: 'warrior',
    mood: aiGeneratorSettings.moods[0] || 'epic',
    details: '',
    pose: aiGeneratorSettings.poses[0] || 'standing',
    background: aiGeneratorSettings.settings[0] || 'simple',
    model: 'colossus-project-flux',
    lighting: aiGeneratorSettings.lighting[0] || 'natural',
    effects: aiGeneratorSettings.effects[0] || 'none',
    negativePrompt: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generatePrompt = () => {
    const parts = [
      formData.mood,
      formData.theme,
      'character',
      `in ${formData.style} style`,
      `${formData.pose} pose`,
      formData.details,
      `with ${formData.background} background`,
      formData.lighting !== 'natural' ? `${formData.lighting} lighting` : '',
      formData.effects !== 'none' ? `${formData.effects} effects` : ''
    ];

    return parts.filter(Boolean).join(', ');
  };

  const handleRandomize = () => {
    setFormData(prev => ({
      ...prev,
      style: aiGeneratorSettings.artStyles[Math.floor(Math.random() * aiGeneratorSettings.artStyles.length)],
      mood: aiGeneratorSettings.moods[Math.floor(Math.random() * aiGeneratorSettings.moods.length)],
      pose: aiGeneratorSettings.poses[Math.floor(Math.random() * aiGeneratorSettings.poses.length)],
      background: aiGeneratorSettings.settings[Math.floor(Math.random() * aiGeneratorSettings.settings.length)],
      lighting: aiGeneratorSettings.lighting[Math.floor(Math.random() * aiGeneratorSettings.lighting.length)],
      effects: aiGeneratorSettings.effects[Math.floor(Math.random() * aiGeneratorSettings.effects.length)],
      model: SEAART_MODELS[Math.floor(Math.random() * SEAART_MODELS.length)].id
    }));
  };

  const handleReset = () => {
    setFormData({
      characterName: '',
      style: aiGeneratorSettings.artStyles[0] || 'anime',
      theme: 'warrior',
      mood: aiGeneratorSettings.moods[0] || 'epic',
      details: '',
      pose: aiGeneratorSettings.poses[0] || 'standing',
      background: aiGeneratorSettings.settings[0] || 'simple',
      model: 'colossus-project-flux',
      lighting: aiGeneratorSettings.lighting[0] || 'natural',
      effects: aiGeneratorSettings.effects[0] || 'none',
      negativePrompt: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);

    try {
      const prompt = generatePrompt();
      const response = await apiRequest(API_ENDPOINTS.GENERATE_IMAGE, {
        method: 'POST',
        body: JSON.stringify({
          prompt,
          negative_prompt: formData.negativePrompt,
          style: formData.style,
          model: formData.model,
          width: 512,
          height: 768
        })
      });

      if (response.imageUrl) {
        setGeneratedImage(response.imageUrl);
        onImageGenerated(response.imageUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
      <div className="flex items-center gap-2 mb-6">
        <FaRobot className="text-2xl text-purple-400" />
        <h2 className="text-xl font-bold text-purple-300">Generate Card Image</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Model Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-purple-300">
            AI Model
          </label>
          <select
            name="model"
            value={formData.model}
            onChange={handleChange}
            className="w-full bg-gray-700/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
          >
            {SEAART_MODELS.map(model => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Style Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-purple-300">
              Art Style
            </label>
            <select
              name="style"
              value={formData.style}
              onChange={handleChange}
              className="w-full bg-gray-700/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
            >
              {aiGeneratorSettings.artStyles.map(style => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-purple-300">
              Theme
            </label>
            <select
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="w-full bg-gray-700/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
            >
              {aiGeneratorSettings.themes?.map(theme => (
                <option key={theme} value={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </div>

          {/* Mood Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-purple-300">
              Mood
            </label>
            <select
              name="mood"
              value={formData.mood}
              onChange={handleChange}
              className="w-full bg-gray-700/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
            >
              {aiGeneratorSettings.moods.map(mood => (
                <option key={mood} value={mood}>
                  {mood}
                </option>
              ))}
            </select>
          </div>

          {/* Pose Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-purple-300">
              Pose
            </label>
            <select
              name="pose"
              value={formData.pose}
              onChange={handleChange}
              className="w-full bg-gray-700/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
            >
              {aiGeneratorSettings.poses.map(pose => (
                <option key={pose} value={pose}>
                  {pose}
                </option>
              ))}
            </select>
          </div>

          {/* Background Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-purple-300">
              Background
            </label>
            <select
              name="background"
              value={formData.background}
              onChange={handleChange}
              className="w-full bg-gray-700/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
            >
              {aiGeneratorSettings.settings.map(setting => (
                <option key={setting} value={setting}>
                  {setting}
                </option>
              ))}
            </select>
          </div>

          {/* Lighting Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-purple-300">
              Lighting
            </label>
            <select
              name="lighting"
              value={formData.lighting}
              onChange={handleChange}
              className="w-full bg-gray-700/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white"
            >
              {aiGeneratorSettings.lighting.map(light => (
                <option key={light} value={light}>
                  {light}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-purple-300">
            Additional Details
          </label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            placeholder="Add any specific details about the character..."
            className="w-full bg-gray-700/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white h-20"
          />
        </div>

        {/* Negative Prompt */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-purple-300">
            Negative Prompt
          </label>
          <textarea
            name="negativePrompt"
            value={formData.negativePrompt}
            onChange={handleChange}
            placeholder="Specify what you don't want in the image..."
            className="w-full bg-gray-700/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white h-20"
          />
        </div>

        {error && (
          <div className="text-red-400 bg-red-900/20 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleRandomize}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600/40 hover:bg-purple-600/60 rounded-lg text-purple-200 border border-purple-500/30"
          >
            <FaRandom /> Randomize
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600/40 hover:bg-purple-600/60 rounded-lg text-purple-200 border border-purple-500/30"
          >
            <FaUndo /> Reset
          </button>

          <button
            type="submit"
            disabled={isGenerating}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <FaSpinner className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FaMagic />
                Generate Image
              </>
            )}
          </button>
        </div>
      </form>

      {generatedImage && (
        <div className="mt-6">
          <img
            src={generatedImage}
            alt="Generated character"
            className="w-full rounded-lg border border-purple-500/30"
          />
        </div>
      )}
    </div>
  );
}
