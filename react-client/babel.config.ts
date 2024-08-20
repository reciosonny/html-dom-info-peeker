module.exports = (api: any) => {
    console.log("running babel configuration...");

    api.cache(true);
    const presets = [
        [
            "@babel/preset-env",
            {
                targets: { node: "current", browsers: "last 2 versions" },
            },
        ],
        "@babel/preset-react",
        "@babel/preset-typescript",
    ];
    const plugins = [
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-syntax-dynamic-import",
        ["@babel/plugin-transform-runtime", { regenerator: true }],
    ];

    if (process.env.NODE_ENV !== "production") {
        console.log("running babel development plugins...");
        plugins.push("react-hot-loader/babel");
    } else {
        console.log("running babel production plugins...");
    }

    return {
        presets,
        plugins,
    };
};
