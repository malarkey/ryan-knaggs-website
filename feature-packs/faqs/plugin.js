function getFaqOrder(item) {
  return Number(item.data.order || 0);
}

module.exports = function faqsFeature(eleventyConfig) {
  eleventyConfig.addFilter("filterFaqsByCategory", (items, category) => {
    return items.filter((item) => item.data.category === category);
  });

  eleventyConfig.addCollection("faqItems", (collection) => {
    return collection.getFilteredByGlob("./src/faqs/*.md").sort((left, right) => {
      const categoryCompare = (left.data.category || "").localeCompare(right.data.category || "");
      if (categoryCompare !== 0) {
        return categoryCompare;
      }

      return getFaqOrder(left) - getFaqOrder(right);
    });
  });

  eleventyConfig.addCollection("faqCategories", (collection) => {
    const categories = new Set();
    collection.getFilteredByGlob("./src/faqs/*.md").forEach((item) => {
      if (item.data.category) {
        categories.add(item.data.category);
      }
    });

    return Array.from(categories).sort();
  });

  eleventyConfig.addCollection("recentFaqs", (collection) => {
    return collection
      .getFilteredByGlob("./src/faqs/*.md")
      .sort((left, right) => getFaqOrder(right) - getFaqOrder(left))
      .slice(0, 3);
  });
};
