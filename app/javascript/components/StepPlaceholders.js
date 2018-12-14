const StepPlaceholders = () => {
  let arr = ["How do we make this?", "Okay, what shall I do next?"];
  const options = ["Is this all timed correctly?", "Now...",
    "Don't nibble yet, we have to...", "Okay now here comes the hardest part...",
    "Did you turn on the oven yet?", "That last step was pretty tough, lets try something easier...",
    "Whisk till your wrist goes numb", "Gently 'scramble'", "Add the toppings and...",
    "Before you serve you must...", "Garnish with...", "Add the..."];
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
export default StepPlaceholders;
