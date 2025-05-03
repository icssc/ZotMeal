function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const fruitKeywords = ["strawberry", "strawberries", "banana", "apple", 
  "orange", "grapes", "melon", "berries", "cantaloupe", "pineapple", "peach", 
  "pear"];
const preparedFruitKeywords = ["cubed", "sliced", "diced fruit", "medley"];
const healthyKeywords = ["oats", "chia", "yogurt", "quinoa", "salad", 
  "vegetable", "tofu", "bean", "lentil", "oatmeal", "cream of wheat", "kale",
  "farro"];
const comfortingKeywords = ["soup", "stew", "pasta", "rice bowl", 
  "mashed potatoes", "casserole", "curry", "chicken", "bacon", "sausage", 
  "egg roll", "burger"];
const bakeryKeywords = ["muffin", "croissant", "scone", "bagel", "bread", 
  "fries", "pizza", "cake", "cookie"];
const toppingKeywords = ["lettuce", "carrots", "croutons", "spinach", 
  "bell peppers", "cucumbers", "beans", "tomato", "cheese", "onion", "pickle", 
  "olive", "mushroom"]

function enhanceDescription(dish: string, description: string | null | undefined): string {
  if (!description || description.trim() === "") {
    description = dish;
  }

  const lowerDesc = description.toLowerCase();
  const lowerDish = dish.toLowerCase();

  if (fruitKeywords.some(keyword => lowerDesc === keyword || lowerDesc === keyword + 's')) {
    return `Fresh and simple ${lowerDesc}. A light and healthy choice.`;
  }

  if (preparedFruitKeywords.some(keyword => lowerDesc.includes(keyword)) && fruitKeywords.some(keyword => lowerDesc.includes(keyword))) {
    return `Refreshing ${lowerDesc}. Perfect for a quick energy boost.`;
  }

  if (bakeryKeywords.some(keyword => lowerDish.includes(keyword))) {
    return `Freshly prepared ${lowerDesc}. A perfect treat.`;
  }

  if (comfortingKeywords.some(keyword => lowerDish.includes(keyword))) {
    return `Warm and comforting ${lowerDesc}. A satisfying classic.`;
  }

  if (healthyKeywords.some(keyword => lowerDish.includes(keyword))) {
    return `A nutritious choice: ${lowerDesc}. Packed with wholesome ingredients.`;
  }

  if (toppingKeywords.some(keyword => lowerDish.includes(keyword))) {
    return `Enjoy ${lowerDesc} as a tasty topping or by itself.`
  }

  if (description.length < 40) {
    return `Enjoy this classic dish: ${lowerDesc}.`;
  }

  // Return original if no rules match or it's already reasonably descriptive
  return description.endsWith('.') ? description : (description + '.');
}

export { toTitleCase, enhanceDescription }