window.ninjaTableBus = new window.NINJATABLE.Vue();

window.NINJATABLE.Vue.mixin({
    methods: {
        $t(str) {
            let transString = ninja_table_admin.i18n[str];
            if(transString) {
                return transString;
            }
            return str;
        },
        setStoreData(key, value) {
            if(window.localStorage) {
                localStorage.setItem("ninjatable_"+key, value);
            }
        },
        getFromStore(key, defaultValue) {
            if(window.localStorage) {
                let itemValue = localStorage.getItem('ninjatable_'+key);
                if(itemValue) {
                    return itemValue;
                }
            }
            return defaultValue;
        },
        applyFilters: window.NINJATABLE.applyFilters,
        addFilter: window.NINJATABLE.addFilter,
        addAction: window.NINJATABLE.addFilter,
        doAction: window.NINJATABLE.doAction,
        $get: window.NINJATABLE.$get,
        $post: window.NINJATABLE.$post
    },
    data(){
        return {

        }
    },
    filters: {
        ucFirst(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }
});

import {routes} from './routes'
import Application from './App.vue'

const router = new window.NINJATABLE.Router({
    routes: window.NINJATABLE.applyFilters('ninja_table_global_routes', routes),
    linkActiveClass: 'active'
});

Application.router = router;
window.ninjaApp = new window.NINJATABLE.Vue(Application).$mount('#data-tables-app');
