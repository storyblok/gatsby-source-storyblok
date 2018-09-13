module.exports = function(string) {
  const converter = function(matches) {
    console.log(matches);
    return matches[1].toUpperCase();
  };

  const result = string.replace(/(\-\w)/g, converter);
  return result.charAt(0).toUpperCase() + result.slice(1);
}