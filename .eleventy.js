
const { DateTime } = require("luxon");
const pluginSEO = require("eleventy-plugin-seo");
const Image = require("@11ty/eleventy-img");
/**
* This is the JavaScript code that determines the config for your Eleventy site
*
* You can add lost of customization here to define how the site builds your content
* Try extending it to suit your needs!
*/

module.exports = function(eleventyConfig) {
  eleventyConfig.setTemplateFormats([
    // Templates:
    "html",
    "njk",
    "md",
    // Static Assets:
    "css",
    "jpeg",
    "jpg",
    "png",
    "svg",
    "woff",
    "woff2"
  ]);
  eleventyConfig.addShortcode("image", async function (src, alt, sizes, classes) {
		let metadata = await Image(src, {
      widths: [1440, 768],
      formats: ["webp", "jpeg"],
      outputDir: "_site/public/img/",
      urlPath: "/public/img/"
		});

		let imageAttributes = {
			alt,
			sizes,
      class: classes,
			loading: "lazy",
			decoding: "async",
		};

		// You bet we throw an error on a missing alt (alt="" works okay)
		return Image.generateHTML(metadata, imageAttributes);
	});
  eleventyConfig.addPassthroughCopy("public");

  /* From: https://github.com/artstorm/eleventy-plugin-seo
  Adds SEO settings to the top of all pages
  */
  const seo = require("./src/seo.json");
  eleventyConfig.addPlugin(pluginSEO, seo);

  // Filters let you modify the content https://www.11ty.dev/docs/filters/
  eleventyConfig.addFilter("htmlDateString", dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.setBrowserSyncConfig({ ghostMode: false });

  /* Build the collection of posts to list in the site
  */
  eleventyConfig.addCollection("photos", function(collection) {
    const coll = collection.getFilteredByTag("photos");
    for (let i = 0; i < coll.length; i++) {
      const prev = coll[i - 1];
      const next = coll[i + 1];

      coll[i].data["prev"] = prev;
      coll[i].data["next"] = next;
    }

    return coll;
  });

  eleventyConfig.addCollection("inks", function(collection) {
    const coll = collection.getFilteredByTag("inks");
    for (let i = 0; i < coll.length; i++) {
      const prev = coll[i - 1];
      const next = coll[i + 1];

      coll[i].data["prev"] = prev;
      coll[i].data["next"] = next;
    }

    return coll;
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site"
    }
  };
};
