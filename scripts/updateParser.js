var https = require("https");
var fs = require("fs-extra");
var path = require("path");
var peg = require("pegjs");
var tspeg = require("ts-pegjs");

var grammar =
  "https://raw.githubusercontent.com/fuhrmanator/GIFT-grammar-PEG.js/master/GIFT.pegjs";

var downloadLocation = path.join(__dirname, "/GIFT.pegjs");
var parserLocation = path.join(__dirname, "../src/parser/parser.ts");

var injectText = "// @ts-nocheck \n";

var dirCheck = function (download, parser) {
  fs.ensureFileSync(download);
  fs.ensureFileSync(parser);
};

var download = function (url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = https
    .get(url, function (response) {
      response.pipe(file);
      file.on("finish", function () {
        file.close(cb); // close() is async, call cb after close completes.
      });
    })
    .on("error", function (err) {
      // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      if (cb) cb(err.message);
    });
};

var createParser = function (file, dest) {
  try {
    var grammar = peg.generate(fs.readFileSync(file, "utf8"), {
      output: "source",
      format: "commonjs",
      plugins: [tspeg],
    });

    fs.writeFileSync(dest, injectText + grammar);
    console.log("Grammar Created.");
  } catch (error) {
    console.log(error);
  }
};

dirCheck(downloadLocation, parserLocation);
download(grammar, downloadLocation, () => {
  createParser(downloadLocation, parserLocation);
});
