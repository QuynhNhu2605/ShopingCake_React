const path = require('path');

module.exports = {
    // Cấu hình entry point của ứng dụng
    entry: './src/index.js',
    // Cấu hình output cho các file bundle được tạo ra
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    // Cấu hình resolve fallback cho các core module thiếu
    resolve: {
        fallback: {
            "crypto": require.resolve("crypto-browserify"),
            "timers": require.resolve("timers-browserify")
        },
    },
};
