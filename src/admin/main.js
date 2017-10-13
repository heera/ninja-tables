import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);

import VueQuillEditor from 'vue-quill-editor';
Vue.use(VueQuillEditor);

import 'element-ui/lib/theme-default/table.css'
import 'element-ui/lib/theme-default/popover.css'
import 'element-ui/lib/theme-default/loading.css'
import 'element-ui/lib/theme-default/message.css'
import 'element-ui/lib/theme-default/message-box.css'
import 'element-ui/lib/theme-default/tooltip.css'
import 'element-ui/lib/theme-default/pagination.css'
import 'element-ui/lib/theme-default/collapse.css'
import 'element-ui/lib/theme-default/collapse-item.css'
import 'element-ui/lib/theme-default/dialog.css'

import {
    Table, TableColumn, Dialog, Popover,Loading, Message, MessageBox, Icon,Tooltip,
    Pagination, Collapse, CollapseItem
} from 'element-ui';

import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
// configure language
locale.use(lang);

Vue.use(Table);
Vue.use(Pagination);
Vue.use(TableColumn);
Vue.use(Popover);
Vue.use(Loading);
Vue.use(Icon);
Vue.use(Tooltip);
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


Application.router = router;
window.ninjaApp = new Vue(Application).$mount('#data-tables-app');


