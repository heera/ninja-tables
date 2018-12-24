const mix = require('laravel-mix');
const exec = require('child_process').exec;
const min = '';
const assetVersion = '3.1.0';
mix.setPublicPath('assets');
mix.setResourceRoot('../');

// mix.react('src/admin/gutenblock.js', `assets/js/ninja-tables-gutenblock.js`);
// return;

mix.js('src/admin/Boot.js', `assets/js/ninja-tables-boot.js`)
    .js('src/admin/main.js', `assets/js/ninja-tables-admin.${assetVersion}.js`)
    .js('src/public/js/ninja-tables-footable.js', `assets/js/ninja-tables-footable.${assetVersion}.js`)
    .js('src/admin/ninja-table-tinymce-button.js', `assets/js/ninja-table-tinymce-button.js`)
    .sass('src/public/css/_public.scss', `assets/css/ninjatables-public.css`)
    .sass('src/admin/css/ninja-tables-admin.scss', `assets/css/ninja-tables-admin.css`)
    .sass('src/admin/css/vendor.scss', 'assets/css/ninja-tables-vendor.css')
    .sass('src/admin/css/gutenblock.scss', 'assets/css/ninja-tables-gutenblock.css')
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
