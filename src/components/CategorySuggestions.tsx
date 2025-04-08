
import React from "react";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CategorySuggestionsProps {
  searchQuery: string;
  suggestedCategories: string[];
  onCategoryClick: (category: string) => void;
}

const CategorySuggestions: React.FC<CategorySuggestionsProps> = ({
  searchQuery,
  suggestedCategories,
  onCategoryClick,
}) => {
  if (suggestedCategories.length === 0) {
    return null;
  }

  return (
    <div className="bg-amber-50 rounded-lg p-4 mb-6 border border-amber-200">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-amber-800 mb-2">No exact matches found for "{searchQuery}"</h3>
          <p className="text-sm text-amber-700 mb-3">Try these related categories instead:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedCategories.map((category, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="bg-white text-amber-700 border-amber-300 hover:bg-amber-100 cursor-pointer"
                onClick={() => onCategoryClick(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySuggestions;
