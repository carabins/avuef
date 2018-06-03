const path = require('path');

const base = {
  entry: path.resolve(__dirname, 'src/index.ts'),
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true //HMR doesn't work without this
          }
        },
        exclude: /node_modules/,
      }
    ]
  },

  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'a-vue-es.js',
    library: 'a-vue',
    libraryTarget: "commonjs-module"
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  optimization: {
    minimize: false
  },
  externals: {
    //alak: {
    //  commonjs: 'alak',
    //  commonjs2: 'alak',
    //  amd: 'alak',
    //  root: '_'
    //}
  }
};
let es = {
    path: path.resolve(__dirname, 'lib'),
    filename: 'a-vue-es.js',
    library: 'a-vue',
    libraryTarget: "commonjs-module"

}

let aa = {
    path: path.resolve(__dirname, 'lib'),
    filename: 'a-vue-aa.js',
    library: 'a-vue',
    libraryTarget: "umd",
    type: 'javascript/esm',
}

let v1 = Object.assign({},base)
let v2 = Object.assign({},base)
v2.output = aa

console.log(v1.output.filename, v2.output.filename)
console.log(v1.entry, v2.entry)

module.exports = [v1,v2]