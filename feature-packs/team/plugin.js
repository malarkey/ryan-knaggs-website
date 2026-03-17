module.exports = function teamFeature(eleventyConfig) {
  eleventyConfig.addCollection("team", (collection) => {
    return collection.getFilteredByGlob("./src/team/*.md");
  });
};
