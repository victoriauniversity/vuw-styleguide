const path    = require( 'path' );
const webpack = require( 'webpack' );


/**
 * Define plugins based on environment
 * @param {boolean} isDev If in development mode
 * @return {Array}
 */
function getPlugins( isDev ) {

  const plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({}),
  ];

  if ( isDev ) {
    plugins.push( new webpack.NoErrorsPlugin());
  } else {
    plugins.push( new webpack.optimize.DedupePlugin());
    plugins.push( new webpack.optimize.UglifyJsPlugin({
      minimize:  true,
      include:   /\.min\.js$/,
      sourceMap: true,
      compress:  {
        warnings: false,
      },
    }));
  }

  return plugins;
}


/**
 * Define loaders.
 *
 * @return {Array}
 */
function getLoaders() {

  const loaders = [ {
    test:    /(\.js)/,
    exclude: /(node_modules)/,
    loaders: [ 'babel' ],
  }, {
    test:   /(\.jpg|\.png)$/,
    loader: 'url-loader?limit=10000',
  }, {
    test:   /\.json/,
    loader: 'json-loader',
  } ];

  return loaders;

}


module.exports = ( config ) => {
  return {
    entry: {
      // Add objects: { 'dest': 'source' }
      [config.scripts.fabricator.pathInDest]:      config.scripts.fabricator.src,
      [config.scripts.toolkit.pathInDest]:         config.scripts.toolkit.src,
      [config.scripts.toolkit.minifiedPathInDest]: config.scripts.toolkit.src,
    },
    output: {
      path:     path.resolve( __dirname, '..', config.tmp ),
      filename: '[name].js',
    },
    devtool: 'source-map',
    resolve: {
      extensions: [
        '',
        '.js',
      ],
    },
    plugins: getPlugins( config.dev ),
    module:  {
      loaders: getLoaders(),
    },
  };
};
