function normalizeUrl(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

function normalizeAssetPath(value) {
  const normalized = normalizeUrl(value);

  if (!normalized || normalized === "/") {
    return "";
  }

  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

module.exports = function() {
  const absoluteUrl = normalizeUrl(process.env.SITE_URL || process.env.URL || process.env.DEPLOY_PRIME_URL);

  return {
    name: "Ryan Knaggs Music",
    url: "",
    absoluteUrl,
    assetPath: normalizeAssetPath(process.env.ASSET_PATH),
    authorName: "Andy Clarke",
    authorEmail: "andy.clarke@stuffandnonsense.co.uk",
    telephone: "+1 480 978 5304",
    email: "ryan@rkmproductions.com",
    siteID: "ryan-knaggs-music",
    copyrightOwner: "Ryan Knaggs Music"
  };
};
