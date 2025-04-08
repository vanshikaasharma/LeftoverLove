
export const MOCK_FOOD_LISTINGS = [
  {
    id: 1,
    name: "Fresh Produce Box",
    provider: "Community Garden Co-op",
    distance: "0.8 mi",
    type: "Free",
    image: "https://images.unsplash.com/photo-1573246123716-6b1782bfc499?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Box of fresh vegetables and fruits. Available for pickup today.",
    category: "Fruits & Vegetables"
  },
  {
    id: 2,
    name: "Bread and Pastries",
    provider: "Local Bakery",
    distance: "1.2 mi",
    type: "Reduced Price",
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Day-old bread and pastries at 75% off regular price.",
    category: "Breads & Baked Goods"
  },
  {
    id: 3,
    name: "Canned Food Bundle",
    provider: "Food Pantry Network",
    distance: "2.5 mi",
    type: "Free",
    image: "https://images.unsplash.com/photo-1584263347416-85a696b4eda7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Assorted canned goods including beans, vegetables, and soups.",
    category: "Pantry Items"
  },
  {
    id: 4,
    name: "Restaurant Meal Kits",
    provider: "Sunshine Cafe",
    distance: "3.1 mi",
    type: "Reduced Price",
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Prepared meal ingredients with instructions. $5 per kit.",
    category: "Prepared Meals"
  },
  {
    id: 5,
    name: "Organic Fruit Box",
    provider: "Green Farms",
    distance: "4.2 mi",
    type: "Reduced Price",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Seasonal organic fruits at 50% off market price.",
    category: "Fruits & Vegetables"
  },
];

export const FOOD_CATEGORIES = [
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Breads & Baked Goods",
  "Meat & Protein",
  "Pantry Items",
  "Prepared Meals",
  "Beverages",
  "Snacks",
  "Baby Food",
  "Other"
];

export const suggestCategoriesByKeywords = (query: string) => {
  const keywords = query.toLowerCase().split(' ');
  const suggestions: string[] = [];
  
  const keywordToCategory: Record<string, string[]> = {
    'fruit': ['Fruits & Vegetables'],
    'vegetable': ['Fruits & Vegetables'],
    'produce': ['Fruits & Vegetables'],
    'apple': ['Fruits & Vegetables'],
    'banana': ['Fruits & Vegetables'],
    'orange': ['Fruits & Vegetables'],
    'milk': ['Dairy & Eggs'],
    'cheese': ['Dairy & Eggs'],
    'yogurt': ['Dairy & Eggs'],
    'egg': ['Dairy & Eggs'],
    'bread': ['Breads & Baked Goods'],
    'pastry': ['Breads & Baked Goods'],
    'bakery': ['Breads & Baked Goods'],
    'meat': ['Meat & Protein'],
    'chicken': ['Meat & Protein'],
    'beef': ['Meat & Protein'],
    'fish': ['Meat & Protein'],
    'protein': ['Meat & Protein'],
    'can': ['Pantry Items'],
    'canned': ['Pantry Items'],
    'pantry': ['Pantry Items'],
    'soup': ['Pantry Items'],
    'meal': ['Prepared Meals'],
    'prepared': ['Prepared Meals'],
    'restaurant': ['Prepared Meals'],
    'drink': ['Beverages'],
    'beverage': ['Beverages'],
    'water': ['Beverages'],
    'soda': ['Beverages'],
    'snack': ['Snacks'],
    'chips': ['Snacks'],
    'candy': ['Snacks'],
    'baby': ['Baby Food'],
    'infant': ['Baby Food'],
    'formula': ['Baby Food']
  };
  
  keywords.forEach(keyword => {
    if (keywordToCategory[keyword]) {
      suggestions.push(...keywordToCategory[keyword]);
    }
  });
  
  return [...new Set(suggestions)];
};

export const calculateDistance = (coords1: { lat: number; lng: number }, coords2: { lat: number; lng: number }): number => {
  // Mock implementation for distance calculation
  return Math.random() * 10;
};
