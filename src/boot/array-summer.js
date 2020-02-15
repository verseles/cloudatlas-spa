Array.prototype.summer = function(item) {
  return this.reduce((a, b) => a + (item ? b[item] : b), 0) || 0;
};
