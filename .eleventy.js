const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const markdownIt = require("markdown-it");
const features = require("./features.json");

// Filters
const dateFilter = require("./src/filters/date-filter.js");
const md = markdownIt({ html: true });

function sortByOrder(left, right) {
  const leftOrder = Number(left.data.order || 0);
  const rightOrder = Number(right.data.order || 0);

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return (left.data.title || "").localeCompare(right.data.title || "");
}

function readFrontMatter(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const match = source.match(/^---\s*\n([\s\S]*?)\n---/);

  if (!match) {
    return {};
  }

  return yaml.load(match[1]) || {};
}

module.exports = function(eleventyConfig) {
  // Filters
  eleventyConfig.addFilter("dateFilter", dateFilter);
  eleventyConfig.addFilter("markdown", (content) => {
    if (!content) {
      return "";
    }

    return md.render(content);
  });

  // Passthrough copy
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/audio");
  eleventyConfig.addPassthroughCopy("src/images");

  eleventyConfig.addCollection("panels", () => {
    const panelsDirectory = path.join(__dirname, "src", "panels");

    return fs.readdirSync(panelsDirectory)
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        const filePath = path.join(panelsDirectory, fileName);

        return {
          fileSlug: path.basename(fileName, ".md"),
          inputPath: filePath,
          data: readFrontMatter(filePath)
        };
      })
      .sort(sortByOrder);
  });

  if (features.blog) {
    const blogPlugin = require("./feature-packs/blog/plugin.js");
    blogPlugin(eleventyConfig);
  }

  if (features.faqs) {
    const faqsPlugin = require("./feature-packs/faqs/plugin.js");
    faqsPlugin(eleventyConfig);
  }

  if (features.portfolio) {
    const portfolioPlugin = require("./feature-packs/portfolio/plugin.js");
    portfolioPlugin(eleventyConfig);
  }

  if (features.team) {
    const teamPlugin = require("./feature-packs/team/plugin.js");
    teamPlugin(eleventyConfig);
  }

  // Use .eleventyignore, not .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Directory structure
  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "dist"
    }
  };
};
