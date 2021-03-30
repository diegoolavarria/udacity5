const checkForName = (inputText) => {
  if (inputText.length < 5) {
    return false;
  }
  return true;
};

export { checkForName };
