const TitlePlaceholder = () => {
  const placeholders = [
    ["I'd love to bake", "Some danish from scratch"],
    ["My farovite dish", "Tastes like heaven on earth"],
    ["Last christmas we had", "The same thing we always do"],
    ["Eat your veggies", "Like your mother told you"],
    ["Feed me", "I just swam across the lake"],
    ["My children like", "Sugar and spice and everything nice"],
    ["A midnight snack of", "Peanut butter and apples? or the leftover chicken?"],
    ["That restaurant has", "The best boop I ever ate"],
    ["The special tonight", "Is green eggs and ham"],
    ["Break me off a piece", "Of that"],
    ["Beans beans","The magical fruit, the more you eat, the more you toot"]
  ];
  return placeholders[Math.floor(Math.random()*placeholders.length)];
}
export default TitlePlaceholder;
