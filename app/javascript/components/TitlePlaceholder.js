const TitlePlaceholder = () => {
  const placeholders = [
    "I'd love to cook",
    "My farovite dish",
    "Last christmas we had",
    "Eat me",
    "Feed me",
    "My children like",
    "A midnight snack of",
    "That restaurant has",
    "Our menu will be"
  ];
  return placeholders[Math.floor(Math.random()*placeholders.length)];
}
export default TitlePlaceholder;
