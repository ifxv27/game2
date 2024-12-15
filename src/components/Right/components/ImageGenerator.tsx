import React, { useState } from 'react';
import axios from 'axios';
import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

interface GeneratorOptions {
  skinColor: string;
  bodyType: string;
  clothes: string;
  style: string;
}

const skinColors = [
  'fair', 'light', 'medium', 'olive', 'tan', 'dark', 'deep dark'
];

const bodyTypes = [
  'athletic', 'slim', 'average', 'curvy', 'muscular', 'plus size'
];

const clothesOptions = [
  'casual wear', 'formal suit', 'fantasy armor', 'medieval dress',
  'modern streetwear', 'royal attire', 'battle gear', 'magical robes'
];

const styleTypes = [
  'realistic', 'cinematic', 'anime', 'fantasy art',
  'digital art', 'oil painting', 'concept art'
];

export default function ImageGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [options, setOptions] = useState<GeneratorOptions>({
    skinColor: skinColors[0],
    bodyType: bodyTypes[0],
    clothes: clothesOptions[0],
    style: styleTypes[0],
  });

  const generatePrompt = (options: GeneratorOptions) => {
    return `full body portrait of a person with ${options.skinColor} skin, 
    ${options.bodyType} body type, wearing ${options.clothes}, 
    ${options.style} style, 9:16 aspect ratio, high quality, detailed, 
    professional photography, dramatic lighting`;
  };

  const generateImage = async () => {
    setIsGenerating(true);
    const prompt = generatePrompt(options);
    
    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/John6666/pony-realism-v21main-sdxl',
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE_TOKEN}`,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        }
      );

      const base64 = btoa(
        new Uint8Array(response.data)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      setGeneratedImage(`data:image/jpeg;base64,${base64}`);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Character Image Generator</h2>
      
      <div className="space-y-6">
        {/* Skin Color Dropdown */}
        <Dropdown
          label="Skin Color"
          options={skinColors}
          selected={options.skinColor}
          onChange={(value) => setOptions({ ...options, skinColor: value })}
        />

        {/* Body Type Dropdown */}
        <Dropdown
          label="Body Type"
          options={bodyTypes}
          selected={options.bodyType}
          onChange={(value) => setOptions({ ...options, bodyType: value })}
        />

        {/* Clothes Dropdown */}
        <Dropdown
          label="Clothes"
          options={clothesOptions}
          selected={options.clothes}
          onChange={(value) => setOptions({ ...options, clothes: value })}
        />

        {/* Style Dropdown */}
        <Dropdown
          label="Art Style"
          options={styleTypes}
          selected={options.style}
          onChange={(value) => setOptions({ ...options, style: value })}
        />

        <button
          onClick={generateImage}
          disabled={isGenerating}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                   disabled:bg-blue-300 transition-colors duration-200"
        >
          {isGenerating ? 'Generating...' : 'Generate Image'}
        </button>

        {generatedImage && (
          <div className="mt-6">
            <img
              src={generatedImage}
              alt="Generated character"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}

interface DropdownProps {
  label: string;
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

function Dropdown({ label, options, selected, onChange }: DropdownProps) {
  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="relative">
        <Listbox.Label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </Listbox.Label>
        <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white border 
                                 border-gray-300 rounded-md shadow-sm cursor-pointer focus:outline-none 
                                 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
          <span className="block truncate">{selected}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronUpDownIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base 
                                  bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black 
                                  ring-opacity-5 focus:outline-none sm:text-sm">
          {options.map((option) => (
            <Listbox.Option
              key={option}
              value={option}
              className={({ active }) =>
                `${active ? 'text-white bg-blue-600' : 'text-gray-900'}
                 cursor-pointer select-none relative py-2 pl-10 pr-4`
              }
            >
              {({ selected, active }) => (
                <>
                  <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                    {option}
                  </span>
                  {selected && (
                    <span
                      className={`${active ? 'text-white' : 'text-blue-600'}
                               absolute inset-y-0 left-0 flex items-center pl-3`}
                    >
                      <CheckIcon className="w-5 h-5" aria-hidden="true" />
                    </span>
                  )}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
