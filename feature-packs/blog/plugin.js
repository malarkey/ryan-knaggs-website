const rssPlugin = require("@11ty/eleventy-plugin-rss");

module.exports = function blogFeature(eleventyConfig) {
  eleventyConfig.addFilter("filterBlogByCategory", (posts, category) => {
    return posts.filter(
      (post) => post.data.postCategories && post.data.postCategories.includes(category)
    );
  });

  eleventyConfig.addFilter("filterBlogByTag", (posts, tag) => {
    return posts.filter(
      (post) => post.data.postTags && post.data.postTags.includes(tag)
    );
  });

  eleventyConfig.addPlugin(rssPlugin);

  eleventyConfig.addCollection("blog", (collection) => {
    return [...collection.getFilteredByGlob("./src/posts/*.md")].reverse();
  });

  eleventyConfig.addCollection("postCategories", (collection) => {
    const categories = new Set();
    collection.getFilteredByGlob("./src/posts/*.md").forEach((post) => {
      if (post.data.postCategories) {
        post.data.postCategories.forEach((cat) => categories.add(cat));
      }
    });
    return Array.from(categories).sort();
  });

  eleventyConfig.addCollection("postTags", (collection) => {
    const tags = new Set();
    collection.getFilteredByGlob("./src/posts/*.md").forEach((post) => {
      if (post.data.postTags) {
        post.data.postTags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  });

  eleventyConfig.addCollection("blogCategoryPages", (collectionApi) => {
    const categories = new Set();
    const posts = collectionApi.getFilteredByGlob("./src/posts/*.md");

    posts.forEach((post) => {
      if (post.data.postCategories) {
        post.data.postCategories.forEach((cat) => categories.add(cat));
      }
    });

    return Array.from(categories).map((category) => ({
      title: `${category}`,
      category,
      permalink: `/blog/category/${category.toLowerCase().replace(/\s+/g, "-")}/`,
      layout: "layouts/base.html"
    }));
  });

  eleventyConfig.addCollection("blogTagPages", (collectionApi) => {
    const tags = new Set();
    const posts = collectionApi.getFilteredByGlob("./src/posts/*.md");

    posts.forEach((post) => {
      if (post.data.postTags) {
        post.data.postTags.forEach((tag) => tags.add(tag));
      }
    });

    return Array.from(tags).map((tag) => ({
      title: `${tag}`,
      tag,
      permalink: `/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}/`,
      layout: "layouts/base.html"
    }));
  });
};
