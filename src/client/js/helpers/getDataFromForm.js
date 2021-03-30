export default (form) => {
  const data = new FormData(form);
  const formEntries = Array.from(data.entries());
  return formEntries.reduce((acc, cur) => {
    const [key, value] = cur;
    acc[key] = value;
    return acc;
  }, {});
};
