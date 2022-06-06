import WebWorkerPlugin from "worker-plugin";
import { CracoConfig, addBeforeLoader, loaderByName } from "@craco/craco";

const config: CracoConfig = {
  webpack: {
    alias: {},
    plugins: {
      add: [new WebWorkerPlugin()],
    },
    configure: (webpackConfig) => {
      addBeforeLoader(webpackConfig, loaderByName("file-loader"), {
        test: /\.sol/,
        use: ["raw-loader"],
      });

      return webpackConfig;
    },
  },
};

module.exports = config;
