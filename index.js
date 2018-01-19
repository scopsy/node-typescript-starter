const tsConfig = require("./tsconfig.json");
const tsConfigPaths = require("tsconfig-paths");

const baseUrl = "."; // Either absolute or relative path. If relative it's resolved to current working directory.
tsConfigPaths.register({
    baseUrl,
    paths: tsConfig.compilerOptions.paths
});

require('./src/app');