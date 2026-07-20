import { Flower2, Leaf, Salad, Sprout, Trees } from 'lucide-react';
import type { Plant, PlantFilters } from '../types';

export const plantCatalog: Plant[] = [
  {
    id: 'cherry-tomato',
    name: 'Cherry Tomato',
    scientificName: 'Solanum lycopersicum var. cerasiforme',
    category: 'Vegetables',
    suitability: 96,
    difficulty: 'Easy',
    description:
      'A high-yielding, compact tomato that rewards bright spaces with clusters of sweet fruit.',
    visual: 'tomato',
    icon: Salad,
    family: 'Solanaceae',
    origin: 'South America',
    climate: 'Warm temperate to subtropical',
    countries: ['Pakistan', 'United Kingdom', 'United States', 'Japan'],
    season: 'March–August',
    harvest: '60–75 days',
    water: '3–4× weekly',
    sunlight: '6–8 hours',
    soil: 'Rich, well-draining loam',
    temperature: '18–29°C',
    humidity: '50–70%',
    fertilizer:
      'Balanced feed every 2 weeks; switch to potassium-rich feed after flowering.',
    diseases: ['Early blight', 'Aphids', 'Powdery mildew'],
    treatment:
      'Remove affected foliage early, water soil rather than leaves, and use neem spray for soft-bodied pests.',
    pruning:
      'Remove lower leaves and pinch side shoots on indeterminate varieties.',
    companions: ['Basil', 'Marigold', 'Carrot'],
    avoid: ['Fennel', 'Potato'],
    yield: '3–5 kg per plant',
    aiTip:
      'Start with one sturdy plant in a deep container. Consistent root-level watering matters more than frequent feeding.',
    facts: [
      'Tomatoes are botanically berries.',
      'Their scent is released by tiny leaf hairs when touched.',
      'A tomato plant can carry hundreds of flowers in a season.',
    ],
    successRate: 94,
    growthStages: [
      {
        label: 'Seedling',
        days: 'Days 1–14',
        description: 'Builds a strong root base.',
      },
      {
        label: 'Leaf growth',
        days: 'Days 15–30',
        description: 'Needs steady light and support.',
      },
      {
        label: 'Flowering',
        days: 'Days 31–45',
        description: 'Shift gently to fruiting nutrition.',
      },
      {
        label: 'Harvest',
        days: 'Days 60–75',
        description: 'Pick ripe fruit often.',
      },
    ],
    growthTrend: [
      { label: 'W1', value: 12 },
      { label: 'W2', value: 28 },
      { label: 'W3', value: 46 },
      { label: 'W4', value: 67 },
      { label: 'W5', value: 82 },
      { label: 'W6', value: 95 },
    ],
    waterSchedule: [
      { day: 'Mon', value: 80 },
      { day: 'Tue', value: 28 },
      { day: 'Wed', value: 56 },
      { day: 'Thu', value: 85 },
      { day: 'Fri', value: 30 },
      { day: 'Sat', value: 76 },
      { day: 'Sun', value: 20 },
    ],
  },
  {
    id: 'genovese-basil',
    name: 'Genovese Basil',
    scientificName: 'Ocimum basilicum',
    category: 'Herbs',
    suitability: 93,
    difficulty: 'Easy',
    description:
      'A lush culinary herb with fragrant leaves and a naturally generous harvest rhythm.',
    visual: 'basil',
    icon: Sprout,
    family: 'Lamiaceae',
    origin: 'Tropical Asia and Africa',
    climate: 'Warm and sunny',
    countries: ['Pakistan', 'Italy', 'United States', 'India'],
    season: 'February–October',
    harvest: '30–45 days',
    water: '2–3× weekly',
    sunlight: '5–6 hours',
    soil: 'Light, fertile potting mix',
    temperature: '20–30°C',
    humidity: '45–65%',
    fertilizer: 'Half-strength organic liquid feed every 3 weeks.',
    diseases: ['Downy mildew', 'Fusarium wilt'],
    treatment:
      'Give plants good spacing, remove affected leaves, and avoid wet foliage overnight.',
    pruning: 'Pinch above leaf pairs once plants have six leaves.',
    companions: ['Tomato', 'Pepper', 'Marigold'],
    avoid: ['Rue', 'Sage'],
    yield: '30–40 cuttings',
    aiTip:
      'Harvest frequently but gently—regular pinching creates a fuller plant and delays flowering.',
    facts: [
      'Basil belongs to the mint family.',
      'There are more than 150 recognized basil varieties.',
      'Its essential oils create its iconic aroma.',
    ],
    successRate: 92,
    growthStages: [
      {
        label: 'Germination',
        days: 'Days 1–7',
        description: 'Warmth encourages even sprouting.',
      },
      {
        label: 'Leaf growth',
        days: 'Days 8–21',
        description: 'Keep soil consistently but lightly moist.',
      },
      {
        label: 'First cut',
        days: 'Days 30–45',
        description: 'Harvest tips above a leaf pair.',
      },
      {
        label: 'Ongoing',
        days: 'Weeks 6+',
        description: 'Repeat small harvests weekly.',
      },
    ],
    growthTrend: [
      { label: 'W1', value: 20 },
      { label: 'W2', value: 42 },
      { label: 'W3', value: 64 },
      { label: 'W4', value: 79 },
      { label: 'W5', value: 90 },
      { label: 'W6', value: 96 },
    ],
    waterSchedule: [
      { day: 'Mon', value: 67 },
      { day: 'Tue', value: 25 },
      { day: 'Wed', value: 58 },
      { day: 'Thu', value: 20 },
      { day: 'Fri', value: 69 },
      { day: 'Sat', value: 24 },
      { day: 'Sun', value: 35 },
    ],
  },
  {
    id: 'arabian-jasmine',
    name: 'Arabian Jasmine',
    scientificName: 'Jasminum sambac',
    category: 'Flowers',
    suitability: 89,
    difficulty: 'Moderate',
    description:
      'A compact flowering shrub valued for intensely fragrant, pearl-white blooms.',
    visual: 'jasmine',
    icon: Flower2,
    family: 'Oleaceae',
    origin: 'South and Southeast Asia',
    climate: 'Warm subtropical',
    countries: ['Pakistan', 'India', 'Philippines', 'Thailand'],
    season: 'March–September',
    harvest: 'Blooms in 8–12 weeks',
    water: '2× weekly',
    sunlight: '4–6 hours',
    soil: 'Slightly acidic, airy soil',
    temperature: '21–32°C',
    humidity: '55–75%',
    fertilizer: 'Bloom feed once monthly during active growth.',
    diseases: ['Scale insects', 'Root rot'],
    treatment:
      'Wipe scale insects early and let soil partially dry between waterings.',
    pruning: 'Trim after flowering to keep a compact, branching form.',
    companions: ['Marigold', 'Basil'],
    avoid: ['Large thirsty trees'],
    yield: 'Continuous fragrant blooms',
    aiTip:
      'Bright morning light and a protected afternoon position create the most reliable flowering pattern.',
    facts: [
      'Its flowers are often used in tea and ceremonial garlands.',
      'The scent is strongest after dusk.',
      'It is the national flower of the Philippines.',
    ],
    successRate: 87,
    growthStages: [
      {
        label: 'Rooting',
        days: 'Weeks 1–3',
        description: 'Settles into a warm, stable spot.',
      },
      {
        label: 'Branching',
        days: 'Weeks 4–8',
        description: 'Gentle pruning encourages shape.',
      },
      {
        label: 'Budding',
        days: 'Weeks 8–12',
        description: 'Feed lightly for blooms.',
      },
      {
        label: 'Flowering',
        days: 'Weeks 12+',
        description: 'Pick spent blooms often.',
      },
    ],
    growthTrend: [
      { label: 'W1', value: 15 },
      { label: 'W2', value: 23 },
      { label: 'W3', value: 39 },
      { label: 'W4', value: 53 },
      { label: 'W5', value: 74 },
      { label: 'W6', value: 85 },
    ],
    waterSchedule: [
      { day: 'Mon', value: 70 },
      { day: 'Tue', value: 20 },
      { day: 'Wed', value: 32 },
      { day: 'Thu', value: 70 },
      { day: 'Fri', value: 22 },
      { day: 'Sat', value: 28 },
      { day: 'Sun', value: 55 },
    ],
  },
  {
    id: 'dwarf-lemon',
    name: 'Dwarf Lemon',
    scientificName: 'Citrus limon',
    category: 'Fruits',
    suitability: 86,
    difficulty: 'Moderate',
    description:
      'A container-friendly citrus tree with fragrant flowers, glossy foliage, and a useful harvest.',
    visual: 'lemon',
    icon: Trees,
    family: 'Rutaceae',
    origin: 'South Asia',
    climate: 'Warm Mediterranean to subtropical',
    countries: [
      'Pakistan',
      'United Arab Emirates',
      'United States',
      'Australia',
    ],
    season: 'February–April',
    harvest: '8–12 months',
    water: '2× weekly',
    sunlight: '6–8 hours',
    soil: 'Free-draining citrus mix',
    temperature: '18–32°C',
    humidity: '40–65%',
    fertilizer: 'Citrus fertilizer monthly in spring and summer.',
    diseases: ['Citrus leaf miner', 'Scale', 'Root rot'],
    treatment:
      'Use horticultural oil for pests and never leave roots in standing water.',
    pruning: 'Remove crossing branches and suckers in early spring.',
    companions: ['Chives', 'Marigold'],
    avoid: ['Heavy shade plants'],
    yield: '15–25 fruits annually',
    aiTip:
      'A large, stable pot and full sun make a more meaningful difference than intensive pruning.',
    facts: [
      'Lemons are a natural hybrid of citron and bitter orange.',
      'Citrus flowers are called blossoms.',
      'Dwarf rootstock keeps the tree productive but compact.',
    ],
    successRate: 84,
    growthStages: [
      {
        label: 'Settling',
        days: 'Weeks 1–4',
        description: 'Roots establish in a deep pot.',
      },
      {
        label: 'Leaf flush',
        days: 'Weeks 5–10',
        description: 'New leaves signal active growth.',
      },
      {
        label: 'Flowering',
        days: 'Months 3–5',
        description: 'Fragrant blossoms appear.',
      },
      {
        label: 'Fruit ripening',
        days: 'Months 6–12',
        description: 'Fruit colours gradually.',
      },
    ],
    growthTrend: [
      { label: 'M1', value: 16 },
      { label: 'M2', value: 30 },
      { label: 'M3', value: 43 },
      { label: 'M4', value: 58 },
      { label: 'M5', value: 68 },
      { label: 'M6', value: 78 },
    ],
    waterSchedule: [
      { day: 'Mon', value: 65 },
      { day: 'Tue', value: 20 },
      { day: 'Wed', value: 30 },
      { day: 'Thu', value: 68 },
      { day: 'Fri', value: 20 },
      { day: 'Sat', value: 25 },
      { day: 'Sun', value: 45 },
    ],
  },
  {
    id: 'aloe-vera',
    name: 'Aloe Vera',
    scientificName: 'Aloe barbadensis miller',
    category: 'Medicinal Plants',
    suitability: 88,
    difficulty: 'Easy',
    description:
      'A sculptural, low-care succulent with useful leaves and remarkable drought tolerance.',
    visual: 'aloe',
    icon: Leaf,
    family: 'Asphodelaceae',
    origin: 'Arabian Peninsula',
    climate: 'Arid to semi-arid',
    countries: ['Pakistan', 'United Arab Emirates', 'South Africa', 'Mexico'],
    season: 'Year-round',
    harvest: 'After 8 months',
    water: 'Every 10–14 days',
    sunlight: 'Bright indirect light',
    soil: 'Gritty cactus mix',
    temperature: '18–30°C',
    humidity: '30–50%',
    fertilizer: 'Diluted succulent fertilizer once in spring.',
    diseases: ['Root rot', 'Mealybugs'],
    treatment:
      'Let soil dry fully, replace compacted soil, and dab pests with diluted alcohol.',
    pruning: 'Remove only outer mature leaves at the base.',
    companions: ['Haworthia', 'Echeveria'],
    avoid: ['Moisture-loving herbs'],
    yield: 'Ongoing mature leaves',
    aiTip:
      'The kindest thing you can do is leave it alone between deep waterings.',
    facts: [
      'Aloe stores water in its leaves.',
      'The gel is mostly water with complex polysaccharides.',
      'It has been cultivated for thousands of years.',
    ],
    successRate: 91,
    growthStages: [
      {
        label: 'Settling',
        days: 'Weeks 1–3',
        description: 'Avoid watering immediately after repotting.',
      },
      {
        label: 'Root growth',
        days: 'Weeks 4–8',
        description: 'Leaves become firm and upright.',
      },
      {
        label: 'Maturity',
        days: 'Months 4–8',
        description: 'Outer leaves can be harvested.',
      },
      {
        label: 'Offsets',
        days: 'Months 8+',
        description: 'Small pups may emerge.',
      },
    ],
    growthTrend: [
      { label: 'M1', value: 18 },
      { label: 'M2', value: 27 },
      { label: 'M3', value: 38 },
      { label: 'M4', value: 51 },
      { label: 'M5', value: 63 },
      { label: 'M6', value: 72 },
    ],
    waterSchedule: [
      { day: 'Mon', value: 0 },
      { day: 'Tue', value: 0 },
      { day: 'Wed', value: 20 },
      { day: 'Thu', value: 0 },
      { day: 'Fri', value: 0 },
      { day: 'Sat', value: 0 },
      { day: 'Sun', value: 0 },
    ],
  },
  {
    id: 'snake-plant',
    name: 'Snake Plant',
    scientificName: 'Dracaena trifasciata',
    category: 'Indoor Plants',
    suitability: 90,
    difficulty: 'Easy',
    description:
      'An architectural indoor plant that brings calm vertical structure to low-light rooms.',
    visual: 'snake',
    icon: Leaf,
    family: 'Asparagaceae',
    origin: 'West Africa',
    climate: 'Tropical to indoor',
    countries: ['Pakistan', 'United Kingdom', 'United States', 'Japan'],
    season: 'Year-round indoors',
    harvest: 'Not applicable',
    water: 'Every 14–21 days',
    sunlight: 'Low to bright indirect',
    soil: 'Well-draining indoor mix',
    temperature: '16–30°C',
    humidity: '30–60%',
    fertilizer: 'Half-strength houseplant feed once in spring and summer.',
    diseases: ['Root rot', 'Mealybugs'],
    treatment:
      'Reduce water, inspect leaves, and use clean soil if roots soften.',
    pruning: 'Remove damaged leaves at soil level.',
    companions: ['ZZ Plant', 'Pothos'],
    avoid: ['Thirsty ferns'],
    yield: 'Air-purifying foliage',
    aiTip:
      'Place it where the light is gentle; then resist the urge to water on a schedule.',
    facts: [
      'Its upright leaves inspired its common name.',
      'It is unusually tolerant of lower light.',
      'New plants can grow from simple leaf cuttings.',
    ],
    successRate: 94,
    growthStages: [
      {
        label: 'Settling',
        days: 'Weeks 1–3',
        description: 'Roots adapt to their position.',
      },
      {
        label: 'Leaf growth',
        days: 'Months 1–3',
        description: 'New spears emerge slowly.',
      },
      {
        label: 'Maturity',
        days: 'Months 4–8',
        description: 'Leaves become taller and firmer.',
      },
      {
        label: 'Division',
        days: 'Months 8+',
        description: 'Rhizomes can be divided.',
      },
    ],
    growthTrend: [
      { label: 'M1', value: 24 },
      { label: 'M2', value: 36 },
      { label: 'M3', value: 46 },
      { label: 'M4', value: 57 },
      { label: 'M5', value: 69 },
      { label: 'M6', value: 80 },
    ],
    waterSchedule: [
      { day: 'Mon', value: 0 },
      { day: 'Tue', value: 0 },
      { day: 'Wed', value: 0 },
      { day: 'Thu', value: 16 },
      { day: 'Fri', value: 0 },
      { day: 'Sat', value: 0 },
      { day: 'Sun', value: 0 },
    ],
  },
];

function matchesCategory(plant: Plant, category: string) {
  if (plant.category === category) return true;
  if (category === 'Trees') return plant.id === 'dwarf-lemon';
  if (category === 'Succulents') return plant.id === 'aloe-vera';
  if (category === 'Outdoor Plants') return plant.id !== 'snake-plant';
  if (category === 'Organic Farming') return true;
  if (category === 'Low Maintenance' || category === 'Beginner Friendly') {
    return plant.difficulty === 'Easy';
  }
  if (category === 'Fast Growing') {
    return ['cherry-tomato', 'genovese-basil'].includes(plant.id);
  }
  if (category === 'Pet Friendly') {
    return ['genovese-basil', 'arabian-jasmine'].includes(plant.id);
  }
  return false;
}

export const plantLibraryService = {
  search(query: string, filters: PlantFilters) {
    const normalized = query.trim().toLowerCase();
    return plantCatalog.filter((plant) => {
      const haystack = [
        plant.name,
        plant.scientificName,
        plant.category,
        plant.climate,
        plant.season,
        ...plant.countries,
      ]
        .join(' ')
        .toLowerCase();
      const matchesQuery = !normalized || haystack.includes(normalized);
      const matchesCategories =
        !filters.categories.length ||
        filters.categories.some((category) => matchesCategory(plant, category));
      return (
        matchesQuery &&
        matchesCategories &&
        (!filters.season || plant.season.includes(filters.season)) &&
        (!filters.country || plant.countries.includes(filters.country)) &&
        (!filters.climate ||
          plant.climate
            .toLowerCase()
            .includes(filters.climate.toLowerCase())) &&
        (!filters.difficulty || plant.difficulty === filters.difficulty)
      );
    });
  },
  getById(id: string) {
    return plantCatalog.find((plant) => plant.id === id);
  },
  getSuggestions(query: string) {
    const term = query.trim().toLowerCase();
    return plantCatalog
      .filter(
        (plant) =>
          !term ||
          plant.name.toLowerCase().includes(term) ||
          plant.scientificName.toLowerCase().includes(term) ||
          plant.category.toLowerCase().includes(term),
      )
      .slice(0, 5);
  },
};
