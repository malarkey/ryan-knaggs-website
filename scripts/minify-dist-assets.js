const fs = require("fs");
const path = require("path");
const { tokenizer } = require("acorn");

const distDir = path.join(__dirname, "..", "dist");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return walk(fullPath);
    }

    return fullPath;
  });
}

function minifyCss(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n")
    .trim();
}

function needsSpace(previous, next) {
  if (!previous) {
    return false;
  }

  const prevChar = previous[previous.length - 1];
  const nextChar = next[0];
  const prevIsWord = /[A-Za-z0-9_$#]/.test(prevChar);
  const nextIsWord = /[A-Za-z0-9_$#]/.test(nextChar);

  if (prevIsWord && nextIsWord) {
    return true;
  }

  if ((prevChar === "+" && nextChar === "+") || (prevChar === "-" && nextChar === "-")) {
    return true;
  }

  if (prevChar === "/" && nextChar === "/") {
    return true;
  }

  return false;
}

function minifyJs(source) {
  const tokens = [];
  const tokenStream = tokenizer(source, {
    ecmaVersion: "latest",
    sourceType: "module",
    allowHashBang: true
  });

  while (true) {
    const token = tokenStream.getToken();
    if (token.type.label === "eof") {
      break;
    }

    tokens.push(source.slice(token.start, token.end));
  }

  return tokens.reduce((output, tokenText) => {
    if (needsSpace(output, tokenText)) {
      return `${output} ${tokenText}`;
    }

    return `${output}${tokenText}`;
  }, "");
}

function minifyFile(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const extension = path.extname(filePath);

  if (extension === ".css") {
    fs.writeFileSync(filePath, `${minifyCss(source)}\n`);
    return "minified";
  }

  if (extension === ".js") {
    if (/^\s*<script[\s>]/i.test(source)) {
      fs.unlinkSync(filePath);
      return "removed";
    }

    try {
      fs.writeFileSync(filePath, `${minifyJs(source)}\n`);
      return "minified";
    } catch (error) {
      console.warn(`Skipped JS minification for ${path.relative(distDir, filePath)}: ${error.message}`);
      return "skipped";
    }
  }

  return "skipped";
}

if (!fs.existsSync(distDir)) {
  process.exit(0);
}

const assetFiles = walk(distDir).filter((filePath) => {
  const extension = path.extname(filePath);
  return extension === ".css" || extension === ".js";
});

let minifiedCount = 0;
let removedCount = 0;

assetFiles.forEach((filePath) => {
  const result = minifyFile(filePath);

  if (result === "minified") {
    minifiedCount += 1;
  }

  if (result === "removed") {
    removedCount += 1;
  }
});

console.log(`Minified ${minifiedCount} dist asset${minifiedCount === 1 ? "" : "s"}.`);
if (removedCount > 0) {
  console.log(`Removed ${removedCount} stale dist asset${removedCount === 1 ? "" : "s"}.`);
}
