const rssPlugin = require("@11ty/eleventy-plugin-rss");

function getPortfolioYear(item) {
  return Number(item.data.year || 0);
}

function getPortfolioOrder(item) {
  return Number(item.data.order || 0);
}

function sortPortfolioItems(left, right) {
  const yearCompare = getPortfolioYear(right) - getPortfolioYear(left);
  if (yearCompare !== 0) {
    return yearCompare;
  }

  const orderCompare = getPortfolioOrder(left) - getPortfolioOrder(right);
  if (orderCompare !== 0) {
    return orderCompare;
  }

  return (left.data.title || "").localeCompare(right.data.title || "");
}

module.exports = function portfolioFeature(eleventyConfig) {
  eleventyConfig.addPlugin(rssPlugin);

  eleventyConfig.addFilter("filterPortfolioByService", (items, service) => {
    return items.filter((item) => item.data.service === service);
  });

  eleventyConfig.addCollection("portfolioItems", (collection) => {
    return collection.getFilteredByGlob("./src/portfolio/*.md").sort(sortPortfolioItems);
  });

  eleventyConfig.addCollection("portfolioServices", (collection) => {
    const services = new Set();
    collection.getFilteredByGlob("./src/portfolio/*.md").forEach((item) => {
      if (item.data.service) {
        services.add(item.data.service);
      }
    });

    return Array.from(services).sort();
  });

  eleventyConfig.addCollection("recentPortfolio", (collection) => {
    return collection.getFilteredByGlob("./src/portfolio/*.md").sort(sortPortfolioItems).slice(0, 3);
  });
};
