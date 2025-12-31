export type LayerType = 
  | "main" 
  | "second" 
  | "third" 
  | "fourth" 
  | "fifth" 
  | "sixth" 
  | "seventh" 
  | "eighth";

export interface StepOptionImage {
  id: number;
  layer: LayerType;
  image_url: string;
  options: number[];
}

import { OPTION_IDS } from '../constants/optionIds';

export const LAYER_Z_INDEX: Record<LayerType, number> = {
  main: 1,
  second: 2,
  third: 3,
  fourth: 4,
  fifth: 5,
  sixth: 6,
  seventh: 7,
  eighth: 8,
};

export const LAYER_CHOICES: LayerType[] = [
  "main",
  "second", 
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "eighth"
];


export const STEP_OPTION_IMAGES: StepOptionImage[] = [
  // Main Layer - Default images per house type
  { id: 2, layer: "main", image_url: "/media/detacheddefault.jpg", options: [OPTION_IDS.HOUSE.DETACHED] },
  { id: 4, layer: "main", image_url: "/media/semidetacheddefault.jpg", options: [OPTION_IDS.HOUSE.SEMI_DETACHED] },
  { id: 5, layer: "main", image_url: "/media/terraceddefault.jpg", options: [OPTION_IDS.HOUSE.TERRACED] },

  // Second Layer - Surface materials
  { id: 25, layer: "second", image_url: "/media/detachedbrick.png", options: [OPTION_IDS.SURFACE.BRICK, OPTION_IDS.HOUSE.DETACHED] },
  { id: 26, layer: "second", image_url: "/media/detachedstone.png", options: [OPTION_IDS.SURFACE.STONE, OPTION_IDS.HOUSE.DETACHED] },
  { id: 27, layer: "second", image_url: "/media/detachedpaintedbrick.png", options: [OPTION_IDS.SURFACE.PAINTED_BRICK, OPTION_IDS.HOUSE.DETACHED] },
  { id: 28, layer: "second", image_url: "/media/detachedblock.png", options: [OPTION_IDS.SURFACE.BLOCK, OPTION_IDS.HOUSE.DETACHED] },
  { id: 29, layer: "second", image_url: "/media/detachedpebbledash.png", options: [OPTION_IDS.SURFACE.PEBBLEDASH, OPTION_IDS.HOUSE.DETACHED] },
  { id: 30, layer: "second", image_url: "/media/detachedicf.png", options: [OPTION_IDS.SURFACE.ICF, OPTION_IDS.HOUSE.DETACHED] },
  { id: 31, layer: "second", image_url: "/media/detachedrendercarrierboard.png", options: [OPTION_IDS.SURFACE.RENDER_CARRIER, OPTION_IDS.HOUSE.DETACHED] },
  { id: 32, layer: "second", image_url: "/media/detachedsandandcement.png", options: [OPTION_IDS.SURFACE.SAND_CEMENT, OPTION_IDS.HOUSE.DETACHED] },
  
  { id: 33, layer: "second", image_url: "/media/terracedbrick.png", options: [OPTION_IDS.SURFACE.BRICK, OPTION_IDS.HOUSE.TERRACED] },
  { id: 34, layer: "second", image_url: "/media/terracedblock.png", options: [OPTION_IDS.SURFACE.BLOCK, OPTION_IDS.HOUSE.TERRACED] },
  { id: 35, layer: "second", image_url: "/media/terracedicf.png", options: [OPTION_IDS.SURFACE.ICF, OPTION_IDS.HOUSE.TERRACED] },
  { id: 36, layer: "second", image_url: "/media/terracedstone.png", options: [OPTION_IDS.SURFACE.STONE, OPTION_IDS.HOUSE.TERRACED] },
  { id: 37, layer: "second", image_url: "/media/terracedpaintedbrick.png", options: [OPTION_IDS.SURFACE.PAINTED_BRICK, OPTION_IDS.HOUSE.TERRACED] },
  { id: 38, layer: "second", image_url: "/media/terracedpebbledash.png", options: [OPTION_IDS.SURFACE.PEBBLEDASH, OPTION_IDS.HOUSE.TERRACED] },
  { id: 39, layer: "second", image_url: "/media/terracedsandandcementrender.png", options: [OPTION_IDS.SURFACE.SAND_CEMENT, OPTION_IDS.HOUSE.TERRACED] },
  { id: 40, layer: "second", image_url: "/media/terracedrendercarrierboard.png", options: [OPTION_IDS.SURFACE.RENDER_CARRIER, OPTION_IDS.HOUSE.TERRACED] },
  
  { id: 41, layer: "second", image_url: "/media/semidetachedbrick.png", options: [OPTION_IDS.SURFACE.BRICK, OPTION_IDS.HOUSE.SEMI_DETACHED] },
  { id: 42, layer: "second", image_url: "/media/semidetachedicf.png", options: [OPTION_IDS.SURFACE.ICF, OPTION_IDS.HOUSE.SEMI_DETACHED] },
  { id: 43, layer: "second", image_url: "/media/semidetachedstone.png", options: [OPTION_IDS.SURFACE.STONE, OPTION_IDS.HOUSE.SEMI_DETACHED] },
  { id: 44, layer: "second", image_url: "/media/semidetachedpaintedbrick.png", options: [OPTION_IDS.SURFACE.PAINTED_BRICK, OPTION_IDS.HOUSE.SEMI_DETACHED] },
  { id: 45, layer: "second", image_url: "/media/semidetachedblock.png", options: [OPTION_IDS.SURFACE.BLOCK, OPTION_IDS.HOUSE.SEMI_DETACHED] },
  { id: 46, layer: "second", image_url: "/media/semidetachedpebbledash.png", options: [OPTION_IDS.SURFACE.PEBBLEDASH, OPTION_IDS.HOUSE.SEMI_DETACHED] },
  { id: 47, layer: "second", image_url: "/media/semidetachedrendercarrierboard.png", options: [OPTION_IDS.SURFACE.RENDER_CARRIER, OPTION_IDS.HOUSE.SEMI_DETACHED] },
  { id: 48, layer: "second", image_url: "/media/semidetachedsandandcement.png", options: [OPTION_IDS.SURFACE.SAND_CEMENT, OPTION_IDS.HOUSE.SEMI_DETACHED] },

  // Third Layer - Insulation materials (thick variants)
  { id: 7, layer: "third", image_url: "/media/terracedmaterialepsthick.png", options: [OPTION_IDS.SYSTEM_TYPE.INSULATION_AND_RENDER, OPTION_IDS.HOUSE.TERRACED] },
  { id: 8, layer: "third", image_url: "/media/detachedmaterialepsthick.png", options: [OPTION_IDS.SYSTEM_TYPE.INSULATION_AND_RENDER, OPTION_IDS.HOUSE.DETACHED] },
  { id: 9, layer: "third", image_url: "/media/semidetachedmaterialepsthick.png", options: [OPTION_IDS.SYSTEM_TYPE.INSULATION_AND_RENDER, OPTION_IDS.HOUSE.SEMI_DETACHED] },
  
  { id: 10, layer: "third", image_url: "/media/detachedmaterialkingspanthick.png", options: [OPTION_IDS.SYSTEM_TYPE.INSULATION_AND_RENDER, OPTION_IDS.INSULATION.KINGSPAN, OPTION_IDS.HOUSE.DETACHED] },
  { id: 11, layer: "third", image_url: "/media/detachedmaterialepsthick.png", options: [OPTION_IDS.SYSTEM_TYPE.INSULATION_AND_RENDER, OPTION_IDS.INSULATION.EPS, OPTION_IDS.HOUSE.DETACHED] },
  { id: 12, layer: "third", image_url: "/media/detachedmaterialwoolthick.png", options: [OPTION_IDS.SYSTEM_TYPE.INSULATION_AND_RENDER, OPTION_IDS.INSULATION.WOOL, OPTION_IDS.HOUSE.DETACHED] },
  
  { id: 13, layer: "third", image_url: "/media/semidetachedmaterialkingspanthick.png", options: [OPTION_IDS.SYSTEM_TYPE.INSULATION_AND_RENDER, OPTION_IDS.INSULATION.KINGSPAN, OPTION_IDS.HOUSE.SEMI_DETACHED] },
  { id: 14, layer: "third", image_url: "/media/semidetachedmaterialepsthick.png", options: [OPTION_IDS.SYSTEM_TYPE.INSULATION_AND_RENDER, OPTION_IDS.INSULATION.EPS, OPTION_IDS.HOUSE.SEMI_DETACHED] },
  { id: 15, layer: "third", image_url: "/media/semidetachedmaterialwoolthick.png", options: [OPTION_IDS.SYSTEM_TYPE.INSULATION_AND_RENDER, OPTION_IDS.INSULATION.WOOL, OPTION_IDS.HOUSE.SEMI_DETACHED] },
  
  { id: 16, layer: "third", image_url: "/media/terracedmaterialkingspanthick.png", options: [OPTION_IDS.SYSTEM_TYPE.INSULATION_AND_RENDER, OPTION_IDS.INSULATION.KINGSPAN, OPTION_IDS.HOUSE.TERRACED] },
  { id: 17, layer: "third", image_url: "/media/terracedmaterialepsthick.png", options: [OPTION_IDS.SYSTEM_TYPE.INSULATION_AND_RENDER, OPTION_IDS.INSULATION.EPS, OPTION_IDS.HOUSE.TERRACED] },
  { id: 18, layer: "third", image_url: "/media/terracedmaterialwoolthick.png", options: [OPTION_IDS.SYSTEM_TYPE.INSULATION_AND_RENDER, OPTION_IDS.INSULATION.WOOL, OPTION_IDS.HOUSE.TERRACED] },

  // Fourth Layer - Fixings
  { id: 19, layer: "fourth", image_url: "/media/semidetachedfixingsmetalthick.png", options: [OPTION_IDS.SYSTEM_TYPE.INSULATION_AND_RENDER, OPTION_IDS.FIXINGS.METAL, OPTION_IDS.HOUSE.SEMI_DETACHED] },
  { id: 20, layer: "fourth", image_url: "/media/semidetachedfixingsplasticthick.png", options: [OPTION_IDS.SYSTEM_TYPE.INSULATION_AND_RENDER, OPTION_IDS.FIXINGS.PLASTIC, OPTION_IDS.HOUSE.SEMI_DETACHED] },
  { id: 21, layer: "fourth", image_url: "/media/detachedfixingsmetalthick.png", options: [OPTION_IDS.SYSTEM_TYPE.INSULATION_AND_RENDER, OPTION_IDS.FIXINGS.METAL, OPTION_IDS.HOUSE.DETACHED] },
  { id: 22, layer: "fourth", image_url: "/media/detachedfixingsplasticthick.png", options: [OPTION_IDS.SYSTEM_TYPE.INSULATION_AND_RENDER, OPTION_IDS.FIXINGS.PLASTIC, OPTION_IDS.HOUSE.DETACHED] },
  { id: 23, layer: "fourth", image_url: "/media/terracedfixingsmetalthick.png", options: [OPTION_IDS.SYSTEM_TYPE.INSULATION_AND_RENDER, OPTION_IDS.FIXINGS.METAL, OPTION_IDS.HOUSE.TERRACED] },
  { id: 24, layer: "fourth", image_url: "/media/terracedfixingsplasticthick.png", options: [OPTION_IDS.SYSTEM_TYPE.INSULATION_AND_RENDER, OPTION_IDS.FIXINGS.PLASTIC, OPTION_IDS.HOUSE.TERRACED] },

  // Fifth Layer - Colour masks
  { id: 61, layer: "fifth", image_url: "/media/terracedmask.png", options: [OPTION_IDS.RENDER_TYPE.SILICONE_SILICATE, OPTION_IDS.HOUSE.TERRACED] },
  { id: 62, layer: "fifth", image_url: "/media/terracedmask.png", options: [OPTION_IDS.RENDER_TYPE.SILICONE, OPTION_IDS.HOUSE.TERRACED] },
  { id: 63, layer: "fifth", image_url: "/media/terracedmask.png", options: [OPTION_IDS.RENDER_TYPE.PREMIUM_BIO, OPTION_IDS.HOUSE.TERRACED] },
  { id: 64, layer: "fifth", image_url: "/media/terracedmask.png", options: [OPTION_IDS.RENDER_TYPE.NANO_DREX, OPTION_IDS.HOUSE.TERRACED] },
  { id: 65, layer: "fifth", image_url: "/media/terracedmask.png", options: [OPTION_IDS.HOUSE.TERRACED, OPTION_IDS.RENDER_TYPE.BRICK_SLIPS] },
  
  { id: 66, layer: "fifth", image_url: "/media/detachedmask.png", options: [OPTION_IDS.RENDER_TYPE.SILICONE_SILICATE, OPTION_IDS.HOUSE.DETACHED] },
  { id: 67, layer: "fifth", image_url: "/media/detachedmask.png", options: [OPTION_IDS.RENDER_TYPE.SILICONE, OPTION_IDS.HOUSE.DETACHED] },
  { id: 68, layer: "fifth", image_url: "/media/detachedmask.png", options: [OPTION_IDS.RENDER_TYPE.PREMIUM_BIO, OPTION_IDS.HOUSE.DETACHED] },
  { id: 69, layer: "fifth", image_url: "/media/detachedmask.png", options: [OPTION_IDS.RENDER_TYPE.NANO_DREX, OPTION_IDS.HOUSE.DETACHED] },
  { id: 70, layer: "fifth", image_url: "/media/detachedmask.png", options: [OPTION_IDS.HOUSE.DETACHED, OPTION_IDS.RENDER_TYPE.BRICK_SLIPS] },

  // Sixth Layer - Render textures
  { id: 56, layer: "sixth", image_url: "/media/terracedbricktexture.png", options: [OPTION_IDS.HOUSE.TERRACED, OPTION_IDS.RENDER_TYPE.BRICK_SLIPS] },
  { id: 57, layer: "sixth", image_url: "/media/terracedrendertexture.png", options: [OPTION_IDS.RENDER_TYPE.SILICONE_SILICATE, OPTION_IDS.HOUSE.TERRACED] },
  { id: 58, layer: "sixth", image_url: "/media/terracedrendertexture.png", options: [OPTION_IDS.RENDER_TYPE.SILICONE, OPTION_IDS.HOUSE.TERRACED] },
  { id: 59, layer: "sixth", image_url: "/media/terracedrendertexture.png", options: [OPTION_IDS.RENDER_TYPE.PREMIUM_BIO, OPTION_IDS.HOUSE.TERRACED] },
  { id: 60, layer: "sixth", image_url: "/media/terracedrendertexture.png", options: [OPTION_IDS.RENDER_TYPE.NANO_DREX, OPTION_IDS.HOUSE.TERRACED] },
  
  { id: 76, layer: "sixth", image_url: "/media/detachedbricktexture.png", options: [OPTION_IDS.HOUSE.DETACHED, OPTION_IDS.RENDER_TYPE.BRICK_SLIPS] },
  { id: 77, layer: "sixth", image_url: "/media/detachedrendertexture.png", options: [OPTION_IDS.RENDER_TYPE.SILICONE_SILICATE, OPTION_IDS.HOUSE.DETACHED] },
  { id: 78, layer: "sixth", image_url: "/media/detachedrendertexture.png", options: [OPTION_IDS.RENDER_TYPE.SILICONE, OPTION_IDS.HOUSE.DETACHED] },
  { id: 79, layer: "sixth", image_url: "/media/detachedrendertexture.png", options: [OPTION_IDS.RENDER_TYPE.PREMIUM_BIO, OPTION_IDS.HOUSE.DETACHED] },
  { id: 80, layer: "sixth", image_url: "/media/detachedrendertexture.png", options: [OPTION_IDS.RENDER_TYPE.NANO_DREX, OPTION_IDS.HOUSE.DETACHED] },

  // Seventh Layer - Shadows
  { id: 51, layer: "seventh", image_url: "/media/terracedshadow.png", options: [OPTION_IDS.RENDER_TYPE.SILICONE_SILICATE, OPTION_IDS.HOUSE.TERRACED] },
  { id: 52, layer: "seventh", image_url: "/media/terracedshadow.png", options: [OPTION_IDS.RENDER_TYPE.SILICONE, OPTION_IDS.HOUSE.TERRACED] },
  { id: 53, layer: "seventh", image_url: "/media/terracedshadow.png", options: [OPTION_IDS.RENDER_TYPE.PREMIUM_BIO, OPTION_IDS.HOUSE.TERRACED] },
  { id: 54, layer: "seventh", image_url: "/media/terracedshadow.png", options: [OPTION_IDS.RENDER_TYPE.NANO_DREX, OPTION_IDS.HOUSE.TERRACED] },
  { id: 55, layer: "seventh", image_url: "/media/terracedshadow.png", options: [OPTION_IDS.HOUSE.TERRACED, OPTION_IDS.RENDER_TYPE.BRICK_SLIPS] },
  
  { id: 71, layer: "seventh", image_url: "/media/detachedshadow.png", options: [OPTION_IDS.HOUSE.DETACHED, OPTION_IDS.RENDER_TYPE.BRICK_SLIPS] },
  { id: 72, layer: "seventh", image_url: "/media/detachedshadow.png", options: [OPTION_IDS.RENDER_TYPE.SILICONE_SILICATE, OPTION_IDS.HOUSE.DETACHED] },
  { id: 73, layer: "seventh", image_url: "/media/detachedshadow.png", options: [OPTION_IDS.RENDER_TYPE.SILICONE, OPTION_IDS.HOUSE.DETACHED] },
  { id: 74, layer: "seventh", image_url: "/media/detachedshadow.png", options: [OPTION_IDS.RENDER_TYPE.PREMIUM_BIO, OPTION_IDS.HOUSE.DETACHED] },
  { id: 75, layer: "seventh", image_url: "/media/detachedshadow.png", options: [OPTION_IDS.RENDER_TYPE.NANO_DREX, OPTION_IDS.HOUSE.DETACHED] },

  // Eighth Layer - Scenery (thin variants)
  { id: 1, layer: "eighth", image_url: "/media/detachedscenerythin.png", options: [OPTION_IDS.HOUSE.DETACHED] },
  { id: 3, layer: "eighth", image_url: "/media/semidetachedscenerythin.png", options: [OPTION_IDS.HOUSE.SEMI_DETACHED] },
  { id: 6, layer: "eighth", image_url: "/media/terracedscenerythin.png", options: [OPTION_IDS.HOUSE.TERRACED] }
];

export const findBestMatchingImage = (
  layer: LayerType,
  selectedOptions: number[]
): string | null => {
  const matched = STEP_OPTION_IMAGES
    .filter(img => img.layer === layer)
    .filter(img => img.options.every(optId => selectedOptions.includes(optId)));

  if (matched.length === 0) return null;

  const bestMatch = matched.reduce((prev, curr) => {
    const prevMax = Math.max(...prev.options);
    const currMax = Math.max(...curr.options);
    return currMax > prevMax ? curr : prev;
  });

  return bestMatch.image_url;
};

export const buildOverlayImages = (selectedOptions: number[]) => {
  const overlays: Record<LayerType, string | null> = {
    main: null,
    second: null,
    third: null,
    fourth: null,
    fifth: null,
    sixth: null,
    seventh: null,
    eighth: null,
  };

  LAYER_CHOICES.forEach(layer => {
    overlays[layer] = findBestMatchingImage(layer, selectedOptions);
  });

  return overlays;
};

export default STEP_OPTION_IMAGES;