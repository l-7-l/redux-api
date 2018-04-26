import path from 'path'

const BASE_PATH = path.resolve(__dirname)
const MIDDLEWARE_PATH = path.resolve(BASE_PATH, './src/index.js')
const DIST_PATH = path.resolve(__dirname, 'dist')

export default {
  // https://medium.com/webpack/webpack-4-mode-and-optimization-5423a6bc597a
  mode: 'production',
  entry: MIDDLEWARE_PATH,
  output: {
    path: DIST_PATH,
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /.js/,
        use: ['babel-loader', 'eslint-loader'],
        include: MIDDLEWARE_PATH,
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
}
