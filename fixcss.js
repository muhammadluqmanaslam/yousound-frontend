var fs = require('fs');
var path = require('path');

fs.readdir(process.argv[2], function(err, files) {
  if (err) {
    console.error("Could not list the directory.", err);
    process.exit(1);
  }
  files.forEach((file, index) => {
    filePath = path.join(process.argv[2], file)
    fs.readFile(filePath, "utf8", function(err, data) {
      if (err) {
        console.log(err)
        process.exit(1)
      }
      if (!data) {
        console.log("NO data")
        process.exit(1)
      }
      re = /([0-9]+.?[0-9]*)px/g

      while (match = re.exec(data)) {
        pxVal = parseFloat(data.substring(match.index, match.index + match[1].length))
        meme = pxVal * 1.1 + "BLAH"
        data = data.substring(0, match.index) + meme + data.substring(match.index + match[1].length, data.length)


      }
      fixed = data.replace(/BLAH/g, '')
      console.log("Writing to", path.join(process.argv[3], file))
      fs.writeFileSync(path.join(process.argv[3], file), fixed)
    });
  })
});
