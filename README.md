## XML catalog generator
### Usage

#### Via Yarn

1. Install the package:
```sh
yarn add xml-catalog
```
2. Run the command:
```sh
yarn generate
```

#### Via NPM

1. Install the package:
```sh
npm install xml-catalog
```
2. Add the following script in your `package.json`:
```json
"scripts": {
  "generate": "generate"
},
```
3. Run the command:
```sh
npm run generate
```

### Options

Scan passed extensions:
```sh
yarn generate -e xml,txt
npm run generate -- -e xml,txt
```
Scan passed path:

```sh
yarn generate -p /path/to/scan
npm run generate -- -p /path/to/scan
```

Generate passed filename:
```sh
yarn generate -o filename.xml
npm run generate -- -o filename.xml
```
