import { Asset, Category } from "./types";

export const dummyAssets: Asset[] = [
  {
    id: "1",
    title: "Fantasy Sword Pack",
    creator: "Epic Armory",
    price: 19.99,
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=200",
    category: "Models",
    description:
      "A collection of high-quality 3D sword models perfect for fantasy games.",
  },
  {
    id: "2",
    title: "Sci-Fi Soundscape",
    creator: "Future Audio",
    price: 24.99,
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=200",
    category: "Audio",
    description:
      "Immersive sci-fi audio tracks and sound effects for futuristic games.",
  },
  {
    id: "3",
    title: "Medieval Village Kit",
    creator: "HistoryBuilders",
    price: 39.99,
    rating: 4.2,
    image: "/placeholder.svg?height=200&width=200",
    category: "Environments",
    description:
      "A comprehensive kit for building medieval villages in your game world.",
  },
  {
    id: "4",
    title: "Character Animation Pack",
    creator: "MoveItStudios",
    price: 29.99,
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=200",
    category: "Animations",
    description:
      "A versatile set of character animations suitable for various game genres.",
  },
  {
    id: "5",
    title: "Magical Particle Effects",
    creator: "Wizardry FX",
    price: 14.99,
    rating: 4.6,
    image: "/placeholder.svg?height=200&width=200",
    category: "VFX",
    description:
      "Stunning magical particle effects to enhance your fantasy game visuals.",
  },
  {
    id: "6",
    title: "Cyberpunk Texture Pack",
    creator: "NeonDesigns",
    price: 34.99,
    rating: 4.4,
    image: "/placeholder.svg?height=200&width=200",
    category: "Textures",
    description:
      "High-resolution cyberpunk-themed textures for futuristic game environments.",
  },
];

export const dummyCategories: Category[] = [
  { id: "1", name: "Models", icon: "🗿" },
  { id: "2", name: "Audio", icon: "🎵" },
  { id: "3", name: "Environments", icon: "🏞️" },
  { id: "4", name: "Animations", icon: "🏃" },
  { id: "5", name: "Textures", icon: "🎨" },
  { id: "6", name: "VFX", icon: "✨" },
];
