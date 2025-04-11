import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Shield, BookOpen, Clock } from "lucide-react";
import Header from "@/components/Header";

const LearnPage = () => {
  const [activeTab, setActiveTab] = useState("storage");

  const storageTips = [
    {
      title: "Proper Refrigeration",
      description: "Keep your refrigerator at 40°F (4°C) or below and your freezer at 0°F (-18°C).",
      tips: [
        "Store raw meat, poultry, and seafood in sealed containers on the bottom shelf",
        "Keep dairy products in the main body of the fridge, not the door",
        "Store fruits and vegetables in separate drawers with proper humidity settings"
      ]
    },
    {
      title: "Freezing Guidelines",
      description: "Maximize food quality and safety when freezing.",
      tips: [
        "Use freezer-safe containers or bags",
        "Label items with date and contents",
        "Freeze in portion sizes you'll use",
        "Remove as much air as possible from packaging"
      ]
    },
    {
      title: "Pantry Storage",
      description: "Keep dry goods fresh and safe.",
      tips: [
        "Store in cool, dry places away from direct sunlight",
        "Use airtight containers for grains and cereals",
        "Keep potatoes and onions in separate, well-ventilated areas",
        "Check expiration dates regularly"
      ]
    }
  ];

  const recipes = [
    {
      title: "Leftover Vegetable Stir-Fry",
      description: "Transform leftover vegetables into a quick and healthy meal.",
      ingredients: [
        "Assorted leftover vegetables",
        "2 tbsp oil",
        "2 cloves garlic, minced",
        "1 tbsp soy sauce",
        "1 tsp ginger, grated",
        "Optional: protein of choice"
      ],
      instructions: [
        "Heat oil in a wok or large pan",
        "Add garlic and ginger, stir for 30 seconds",
        "Add vegetables, starting with the ones that need longer cooking",
        "Stir-fry for 3-5 minutes",
        "Add soy sauce and any other seasonings",
        "Serve hot with rice or noodles"
      ]
    },
    {
      title: "Leftover Bread Pudding",
      description: "Turn stale bread into a delicious dessert.",
      ingredients: [
        "4 cups stale bread, cubed",
        "2 cups milk",
        "3 eggs",
        "1/2 cup sugar",
        "1 tsp vanilla extract",
        "1/2 cup raisins (optional)",
        "1 tsp cinnamon"
      ],
      instructions: [
        "Preheat oven to 350°F (175°C)",
        "Place bread cubes in a greased baking dish",
        "Whisk together milk, eggs, sugar, and vanilla",
        "Pour mixture over bread, let sit for 15 minutes",
        "Sprinkle with cinnamon and raisins",
        "Bake for 45-50 minutes until set"
      ]
    }
  ];

  const safetyGuidelines = [
    {
      title: "Food Handling Basics",
      description: "Essential practices for safe food handling.",
      guidelines: [
        "Wash hands thoroughly before and after handling food",
        "Use separate cutting boards for raw meat and produce",
        "Cook food to proper internal temperatures",
        "Keep hot food hot and cold food cold"
      ]
    },
    {
      title: "Leftover Safety",
      description: "How to safely handle and store leftovers.",
      guidelines: [
        "Refrigerate leftovers within 2 hours of cooking",
        "Divide large portions into smaller containers",
        "Reheat leftovers to 165°F (74°C)",
        "Discard leftovers after 3-4 days in the refrigerator"
      ]
    },
    {
      title: "Cross-Contamination Prevention",
      description: "Prevent the spread of harmful bacteria.",
      guidelines: [
        "Clean and sanitize surfaces and utensils after each use",
        "Store raw meat below ready-to-eat foods",
        "Use separate utensils for raw and cooked foods",
        "Wash fruits and vegetables before use"
      ]
    }
  ];

  const sustainabilityTips = [
    {
      title: "Reducing Food Waste",
      description: "Practical ways to minimize food waste.",
      tips: [
        "Plan meals and make shopping lists",
        "Store food properly to extend shelf life",
        "Use leftovers creatively in new meals",
        "Compost food scraps when possible"
      ]
    },
    {
      title: "Sustainable Shopping",
      description: "Make environmentally friendly food choices.",
      tips: [
        "Buy local and seasonal produce",
        "Choose products with minimal packaging",
        "Support sustainable farming practices",
        "Consider plant-based alternatives"
      ]
    },
    {
      title: "Energy Efficiency",
      description: "Reduce energy consumption in food preparation.",
      tips: [
        "Use lids when cooking to reduce cooking time",
        "Match pot size to burner size",
        "Defrost food in the refrigerator overnight",
        "Use energy-efficient appliances"
      ]
    }
  ];

  return (
    <>
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Food Education Center</h1>
          
          <Tabs defaultValue="storage" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="storage" onClick={() => setActiveTab("storage")}>
                <Clock className="mr-2 h-4 w-4" />
                Storage Tips
              </TabsTrigger>
              <TabsTrigger value="recipes" onClick={() => setActiveTab("recipes")}>
                <BookOpen className="mr-2 h-4 w-4" />
                Recipes
              </TabsTrigger>
              <TabsTrigger value="safety" onClick={() => setActiveTab("safety")}>
                <Shield className="mr-2 h-4 w-4" />
                Safety
              </TabsTrigger>
              <TabsTrigger value="sustainability" onClick={() => setActiveTab("sustainability")}>
                <Leaf className="mr-2 h-4 w-4" />
                Sustainability
              </TabsTrigger>
            </TabsList>

            <TabsContent value="storage">
              <div className="grid gap-6">
                {storageTips.map((tip, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{tip.title}</CardTitle>
                      <CardDescription>{tip.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-2">
                        {tip.tips.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recipes">
              <div className="grid gap-6">
                {recipes.map((recipe, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{recipe.title}</CardTitle>
                      <CardDescription>{recipe.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <h3 className="font-semibold mb-2">Ingredients:</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {recipe.ingredients.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Instructions:</h3>
                        <ol className="list-decimal pl-5 space-y-2">
                          {recipe.instructions.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="safety">
              <div className="grid gap-6">
                {safetyGuidelines.map((guideline, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{guideline.title}</CardTitle>
                      <CardDescription>{guideline.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-2">
                        {guideline.guidelines.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sustainability">
              <div className="grid gap-6">
                {sustainabilityTips.map((tip, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{tip.title}</CardTitle>
                      <CardDescription>{tip.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-2">
                        {tip.tips.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default LearnPage; 