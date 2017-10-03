const mix      = require('wp-mix');
const min      = Mix.inProduction() ? '.min' : '';

// Autoload


mix.query =  {
    presets: [
        require.resolve('babel-preset-es2015'),
        require.resolve('babel-preset-stage-0'),
    ],
};

mix.js('src/admin/main.js', `admin/js/ninja-tables-admin${min}.js`);
mix.js('src/public/js/ninja-tables-footable.js', `public/js/ninja-tables-footable${min}.js`);

mix.sass('src/public/css/_public.scss', `public/css/ninja-tables-public${min}.css`);
mix.sass('src/admin/css/ninja-tables-admin.scss', `admin/css/ninja-tables-admin${min}.css`);