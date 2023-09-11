const defaults = require('@wordpress/scripts/config/webpack.config');
const path = require('path-browserify');

module.exports = {
  ...defaults,
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  resolve: {
    ...defaults.resolve,
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss'],
    alias: {
      ...defaults.resolve.alias,
      style: path.resolve(__dirname, 'src/style'),
    },
  },
};