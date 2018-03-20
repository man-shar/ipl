const yaml = require("js-yaml");
const fs = require('fs');
const path = require('path');
 
var yaml_base = path.join(__dirname, "assets", "data", "india_male", "yaml");
var json_base = path.join(__dirname, "assets", "data", "india_male", "json");

fs.readdir(yaml_base, function(err, items) {
  // console.log(items);

  for (var i=0; i<items.length; i++) {
    var ext = path.extname(items[i])

    console.log(items[i]);

    if(ext !== ".yaml")
      continue;

    var inFile = path.join(yaml_base, items[i]);
    var outFile = path.join(json_base, (path.basename(items[i], ".yaml") + ".json"));

    fs.writeFileSync(outFile, JSON.stringify(yaml.safeLoad(fs.readFileSync(inFile))));
  }
});