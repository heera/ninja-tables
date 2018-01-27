const mix = require('laravel-mix');
const min = '';

mix.setPublicPath('assets');
mix.setResourceRoot('../');

mix.js('src/admin/main.js', `assets/js/ninja-tables-admin.js`)
    .js('src/public/js/ninja-tables-footable.js', `assets/js/ninja-tables-footable.js`)
    .sass('src/public/css/_public.scss', `assets/css/ninja-tables-public.css`)
    .sass('src/admin/css/ninja-tables-admin.scss', `assets/css/ninja-tables-admin.css`)
    .sourceMaps(true);