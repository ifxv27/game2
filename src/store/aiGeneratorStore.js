import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const defaultSettings = {
  skinColors: ['Light', 'Medium', 'Dark', 'Tan', 'Olive', 'Fair'],
  bodyTypes: ['Athletic', 'Slim', 'Curvy', 'Muscular', 'Average'],
  clothes: ['Casual', 'Formal', 'Athletic', 'Fantasy', 'Sci-fi', 'Traditional'],
  lighting: ['Natural', 'Studio', 'Dramatic', 'Soft', 'Neon', 'Cinematic'],
  hair: ['Short', 'Long', 'Curly', 'Straight', 'Wavy', 'Braided', 'Updo'],
  providers: {
    seaart: {
      enabled: true,
      userId: '8e1d30ebd5ae106fb715d1713ff42d2f',
      apiKey: '',
    },
  }
};

const defaultCosts = {
  base: {
    money: 1000,
    gems: 5
  },
  multipliers: {
    common: 1,
    uncommon: 1.2,
    rare: 1.5,
    epic: 2,
    legendary: 3
  },
  levelMultiplier: 0.1
};

const defaultCategories = {
  common: {
    enabled: true,
    displayName: 'Common Cards',
    description: 'Basic card generation',
    costMultiplier: 1
  },
  uncommon: {
    enabled: true,
    displayName: 'Uncommon Cards',
    description: 'Better quality cards',
    costMultiplier: 1.2
  },
  rare: {
    enabled: true,
    displayName: 'Rare Cards',
    description: 'High quality cards',
    costMultiplier: 1.5
  },
  epic: {
    enabled: true,
    displayName: 'Epic Cards',
    description: 'Premium quality cards',
    costMultiplier: 2
  },
  legendary: {
    enabled: true,
    displayName: 'Legendary Cards',
    description: 'Ultimate quality cards',
    costMultiplier: 3
  }
};

const defaultApiSettings = {
  activeProvider: 'seaart',
  providers: {
    seaart: {
      apiKey: '',
      enabled: true
    },
    tensorart: {
      apiKey: '',
      enabled: true
    },
    leonardo: {
      apiKey: '',
      enabled: true
    },
    webui: {
      endpoint: 'http://localhost:7860',
      enabled: false
    },
    flux: {
      enabled: false
    }
  }
};

const defaultCategoriesList = {
  skinColors: {
    name: 'Skin Colors',
    icon: 'FaPalette',
    items: ['Light', 'Medium', 'Dark', 'Tan', 'Olive', 'Fair']
  },
  bodyTypes: {
    name: 'Body Types',
    icon: 'FaUser',
    items: ['Athletic', 'Slim', 'Curvy', 'Muscular', 'Average']
  },
  clothes: {
    name: 'Clothes',
    icon: 'FaTshirt',
    items: ['Casual', 'Formal', 'Athletic', 'Fantasy', 'Sci-fi', 'Traditional']
  },
  lighting: {
    name: 'Lighting',
    icon: 'FaLightbulb',
    items: ['Natural', 'Studio', 'Dramatic', 'Soft', 'Neon', 'Cinematic']
  },
  hair: {
    name: 'Hair',
    icon: 'FaCut',
    items: ['Short', 'Long', 'Curly', 'Straight', 'Wavy', 'Braided', 'Updo']
  }
};

const useAiGeneratorStore = create(
  persist(
    (set, get) => ({
      skinColors: defaultSettings.skinColors,
      bodyTypes: defaultSettings.bodyTypes,
      clothes: defaultSettings.clothes,
      lighting: defaultSettings.lighting,
      hair: defaultSettings.hair,
      costs: defaultCosts,
      categories: defaultCategories,
      categoriesList: defaultCategoriesList,
      providers: defaultSettings.providers,

      updateSettings: (newSettings) => {
        set((state) => ({
          ...state,
          ...newSettings,
        }));
      },

      updateApiSettings: (newSettings) => {
        set((state) => ({
          ...state,
          providers: {
            ...state.providers,
            ...(newSettings.providers || {})
          }
        }));
      },

      resetSettings: () => {
        set((state) => ({
          skinColors: defaultSettings.skinColors,
          bodyTypes: defaultSettings.bodyTypes,
          clothes: defaultSettings.clothes,
          lighting: defaultSettings.lighting,
          hair: defaultSettings.hair,
          providers: defaultSettings.providers,
          costs: defaultCosts,
          categories: defaultCategories,
          categoriesList: defaultCategoriesList,
          apiSettings: defaultApiSettings,
        }));
      },

      getSettings: () => {
        const state = get();
        return {
          skinColors: state.skinColors,
          bodyTypes: state.bodyTypes,
          clothes: state.clothes,
          lighting: state.lighting,
          hair: state.hair,
        };
      },

      updateCategorySettings: (category, settings) => {
        set(state => ({
          categories: {
            ...state.categories,
            [category]: {
              ...state.categories[category],
              ...settings
            }
          }
        }));
      },

      updateCosts: (newCosts) => {
        set(state => ({
          costs: {
            ...state.costs,
            ...newCosts
          }
        }));
      },

      calculateCost: (cardType, level) => {
        const state = get();
        const { base, multipliers, levelMultiplier } = state.costs;
        const typeMultiplier = multipliers[cardType] || 1;
        const levelCost = 1 + (level * levelMultiplier);
        
        return {
          money: Math.round(base.money * typeMultiplier * levelCost),
          gems: Math.round(base.gems * typeMultiplier * levelCost)
        };
      },

      canAffordGeneration: (player, cardType, level) => {
        const state = get();
        const cost = state.calculateCost(cardType, level);
        return player.money >= cost.money && player.gems >= cost.gems;
      },
      
      updateCategory: (category, options) => {
        if (!Array.isArray(options)) {
          console.error('Options must be an array');
          return;
        }
        
        const validOptions = options.filter(option => 
          typeof option === 'string' && 
          option.length > 0 && 
          option.length <= 50 &&
          /^[a-zA-Z0-9\s-]+$/.test(option)
        );
        
        set(state => ({
          [category]: validOptions
        }));
      },
      
      resetCategory: (category) => {
        if (category in defaultSettings) {
          set(state => ({
            [category]: [...defaultSettings[category]]
          }));
        }
      },
      
      addCategory: (key, category) => {
        if (!key || typeof key !== 'string') {
          console.error('Invalid category key');
          return;
        }

        set((state) => ({
          categoriesList: {
            ...state.categoriesList,
            [key]: {
              name: category.name,
              icon: category.icon || 'FaCog',
              items: category.items || []
            }
          }
        }));
      },

      removeCategory: (key) => {
        set((state) => {
          const newCategories = { ...state.categoriesList };
          delete newCategories[key];
          return { categoriesList: newCategories };
        });
      },

      updateCategoryList: (category, items) => {
        if (!Array.isArray(items)) {
          console.error('Items must be an array');
          return;
        }

        set((state) => ({
          categoriesList: {
            ...state.categoriesList,
            [category]: {
              ...state.categoriesList[category],
              items
            }
          }
        }));
      },

      resetCategoryList: (category) => {
        if (category in defaultCategoriesList) {
          set((state) => ({
            categoriesList: {
              ...state.categoriesList,
              [category]: { ...defaultCategoriesList[category] }
            }
          }));
        }
      },

      generateSeaArtImage: async (prompt, userId, options) => {
        try {
          const response = await fetch('https://api.seaart.ai/v1/txt2img', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userId}`
            },
            body: JSON.stringify({
              prompt: prompt,
              model_name: options.model || 'anything-v5',
              samples: 2,
              steps: 30,
              cfg_scale: 7,
              width: 512,
              height: 768,
              negative_prompt: "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry"
            })
          });

          if (!response.ok) {
            throw new Error(`SeaArt API error: ${response.statusText}`);
          }

          const data = await response.json();
          return data.images || [];
        } catch (error) {
          console.error('Error generating image with SeaArt:', error);
          throw error;
        }
      },

      generateImage: async (prompt, options = {}) => {
        const state = get();
        const providers = state.providers;
        const seaartSettings = providers?.seaart;

        if (!seaartSettings?.enabled) {
          throw new Error('SeaArt is not enabled');
        }

        if (!seaartSettings?.userId) {
          throw new Error('SeaArt User ID is not set');
        }

        return state.generateSeaArtImage(prompt, seaartSettings.userId, options);
      },

      saveGeneratedImage: async (imageData, cardType, playerId) => {
        console.log('Saving generated image for', playerId, 'card type:', cardType);
        return imageData;
      }
    }),
    {
      name: 'ai-generator-settings',
      version: 1,
    }
  )
);

export default useAiGeneratorStore;
