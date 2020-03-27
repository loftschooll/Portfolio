const fs = require("fs");

module.exports = {
  syntax: "postcss-scss",
  parser: 'postcss-scss',
  plugins: [
    require("postcss-easy-import")({
      extensions: ".pcss"
    }),
    require("autoprefixer")({
      cascade: false
    }),
    require("postcss-advanced-variables")({
      variables: require("./src/assets/styles/variable")
    }),
    require("postcss-nested"),
    require("postcss-rgb"),
    require("postcss-inline-svg")({
      removeFill: true,
      path: "./src/images/icons"
    }),
    require("cssnano"),
    require("postcss-pxtorem")({
      rootValue: 16,
      propList: ["*", "!*border*"],
      selectorBlackList: [/^html$/]
    })
  ]
};
