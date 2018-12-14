const IngredientPlaceholders = () => {
  let arr = ["What's in this?", "What else does it have?", "Okay, what's next?"];
  const options = ["My grandma loved to use...", "The secret ingredient is...",
    "It needs some...", "There might be a...", "The real flavor comes from...",
    "These types of dishes need...", "We usually replace the...",
    "And...", "Oh also...", "5 ml of...", "2 Tablespoons of...", "180 grams of...",
    "I almost forgot to add...", "I used to use...", "1 cup of...",
    "5 cups of...", "10 medium sized...", "1 can of..."];
  let usedOptions = options.slice();

  for (let i=0;i < 100; i++) {
    if (usedOptions.length == 0) {
      usedOptions = options.slice();
    }
    const randomIndex = Math.floor(Math.random()*usedOptions.length);
    arr.push(usedOptions[randomIndex]);
    usedOptions.splice(randomIndex, 1);
  }
  return arr;
}
export default IngredientPlaceholders;
