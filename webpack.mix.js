const mix = require('laravel-mix');
const exec = require('child_process').exec;
const min = '';
const assetVersion = '2.1';
mix.setPublicPath('assets');
mix.setResourceRoot('../');

mix.js('src/admin/main.js', `assets/js/ninja-tables-admin.js`)
    .js('src/public/js/ninja-tables-footable.js', `assets/js/ninja-tables-footable.${assetVersion}.js`)
    .js('src/admin/ninja-table-tinymce-button.js', `assets/js/ninja-table-tinymce-button.js`)
    .sass('src/public/css/_public.scss', `assets/css/ninjatables-public.css`)
    .sass('src/admin/css/ninja-tables-admin.scss', `assets/css/ninja-tables-admin.css`)
    .sass('src/admin/css/vendor.scss', 'assets/css/ninja-tables-vendor.css')
    .sourceMaps(false);

mix.then(() => {
    exec('rtlcss ./assets/css/ninja-tables-vendor.css ./assets/css/ninja-tables-vendor-rtl.css', (error) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
    });

    exec('rtlcss ./assets/css/ninjatables-public.css ./assets/css/ninjatables-public-rtl.css', (error) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
    });
});