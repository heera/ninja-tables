import { includes } from 'lodash';
if( typeof window._.contains === 'undefined' ) {
    window._.contains = includes;
} // This is a hack to prevent the jetpack notification error.

import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);

import 'element-ui/lib/theme-chalk/table.css'
import 'element-ui/lib/theme-chalk/popover.css'
import 'element-ui/lib/theme-chalk/loading.css'
import 'element-ui/lib/theme-chalk/message.css'
import 'element-ui/lib/theme-chalk/message-box.css'
import 'element-ui/lib/theme-chalk/tooltip.css'
import 'element-ui/lib/theme-chalk/pagination.css'
import 'element-ui/lib/theme-chalk/collapse.css'
import 'element-ui/lib/theme-chalk/collapse-item.css'
import 'element-ui/lib/theme-chalk/dialog.css'
import 'element-ui/lib/theme-chalk/aside.css'
import 'element-ui/lib/theme-chalk/main.css'
import 'element-ui/lib/theme-chalk/container.css'
import 'element-ui/lib/theme-chalk/menu.css'
import 'element-ui/lib/theme-chalk/menu-item.css'
import 'element-ui/lib/theme-chalk/header.css'

import {
    Table, TableColumn, Dialog, Popover,Loading, Message, MessageBox, Icon,Tooltip,
    Pagination, Collapse, CollapseItem, Container, Aside, Main,
    Menu,
    MenuItem,
    Header

} from 'element-ui';

import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
// configure language
locale.use(lang);

Vue.use(Table);
Vue.use(Pagination);
Vue.use(TableColumn);
Vue.use(Popover);
Vue.use(Menu);
Vue.use(Header);
Vue.use(MenuItem);
Vue.use(Loading);
Vue.use(Icon);
Vue.use(Tooltip);
Vue.use(Container);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Dialog);

Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;

let NinjaTableSettings = (function () {
    const HomeComponents = [];
    const tableLibs = {  };
    
    class NinjaTableSettingsClass {
        constructor() {
            
        }
        addHomeComponents(component) {
            HomeComponents.push(component);
        }
        
        getHomeComponent() {
            return HomeComponents;
        }
        
        addTableLib(lib) {
            tableLibs[lib.key] =  lib.settings;
        }
        getTableLibs() {
            return tableLibs;
        }
    }
    window.ninjaFormSettings = new NinjaTableSettingsClass();
})();

Vue.mixin({
    methods: {
        $t(str) {
            return str;
        }
    },
    data(){
        return {
            public_components: {
                home: {
                    temp1: {
                        name: 'temp_1',
                        template: '<div><h1>First</h1></div>'
                    },
                    temp2: {
                        name: 'temp2',
                        template: '<div><h1>second</h1></div>'
                    }
                }
            }
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

const router = new VueRouter({
    routes,
    linkActiveClass: 'active'
});

window.ninjaTableBus = new Vue();

Application.router = router;
window.ninjaApp = new Vue(Application).$mount('#data-tables-app');


