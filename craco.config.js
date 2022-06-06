const WebWorkerPlugin = require("worker-plugin");

module.exports = {
  webpack: {
    alias: {},
    plugins: {
      add: [new WebWorkerPlugin()],
    },
  },
};
