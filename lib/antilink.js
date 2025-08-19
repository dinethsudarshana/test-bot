module.exports = function (text = "") {
  const urlRegex = /(https?:\/\/|www\.)[\w-]+(\.[\w-]+)+(\/\S*)?/i;
  return urlRegex.test(text);
};
