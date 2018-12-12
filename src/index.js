const fs = require('fs');
const path = require('path');

const defaults = {
  extensions: ['xml', 'xslt'],
  filename: 'catalog.xml',
  currentPath: process.cwd()
};

module.exports = function(args) {
  let { extensions, filename, currentPath } = defaults;

  // Parse arguments
  if (args.includes('-e') && args[args.indexOf('-e') + 1])
    extensions = args[args.indexOf('-e') + 1].split(',');

  if (args.includes('-o') && args[args.indexOf('-o') + 1])
    filename = args[args.indexOf('-o') + 1];

  if (args.includes('-p') && args[args.indexOf('-p') + 1])
    currentPath = path.resolve(process.cwd(), args[args.indexOf('-p') + 1]);

  // Scan files
  const files = getFiles(currentPath);

  // Build xml
  const catalog = files.map(file => {
    const packageName = process.cwd().split('/').pop();

    const uri = file.replace(`${currentPath}/`, '');
    const npm = uri.match(/^node_modules\/[^/]*/);
    const tail = file.replace(`${currentPath}/node_modules/`, '');

    const comment = npm ? `'${npm[0]}' package directory`
      : `current package '${packageName}'`;

    const systemId = npm ? tail.replace(/\//g, (hit, index) => {
      if (index === tail.search(/\/[^/]*\/[^/]*$/)) return ':';

      return hit;
    }) : `${packageName}:${uri}`;

    return `\n<!-- supported files found in ${comment} -->
      <system systemId="${systemId}"
      uri="${uri}"/>`;
  }).join('');

  const xml = `<?xml version="1.0"?>
    <catalog xmlns="urn:oasis:names:tc:entity:xmlns:xml:catalog">
      ${catalog}
    </catalog>
  `;

  fs.writeFileSync(path.join(process.cwd(), filename), xml);

  console.log('Done');

  function getFiles(dir) {
    return fs.readdirSync(dir).reduce((files, file) => {
      const results = fs.statSync(path.join(dir, file)).isDirectory()
        ? files.concat(getFiles(path.join(dir, file)))
        : files.concat(path.join(dir, file));

      return results.filter(file =>
        extensions.includes(path.extname(file).slice(1)));
    }, []);
  }
};
