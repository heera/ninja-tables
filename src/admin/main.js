import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);

import {
    Button,
    Table, TableColumn, Dialog, Popover,Loading, Message, MessageBox, Icon,Tooltip,
    Pagination, Collapse, CollapseItem, Container, Aside, Main,
    Menu,
    MenuItem,
    Header,
    ColorPicker,
    Form,
    FormItem,
    Input,
    Checkbox,
    RadioGroup,
    Radio,
    Select,
    Option,
    Switch,
    CheckboxGroup,
    RadioButton,
    TabPane,
    Tabs,
    Steps,
    Step,
    Alert,
} from 'element-ui';
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
// configure language
locale.use(lang);
Vue.use(Button);
Vue.use(Table);
Vue.use(ColorPicker);
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
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Checkbox);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(RadioButton);
Vue.use(Switch);
Vue.use(CheckboxGroup);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Alert);

Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;

Vue.mixin({
    methods: {
        $t(str) {
            let transString = ninja_table_admin.i18n[str];
            if(transString) {
                return transString;
            }
            return str;
        }
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

const router = new VueRouter({
    routes,
    linkActiveClass: 'active'
});


function ignoreerror()
{
    return true
}
window.onerror=ignoreerror();

window.ninjaTableBus = new Vue();

Application.router = router;
window.ninjaApp = new Vue(Application).$mount('#data-tables-app');
