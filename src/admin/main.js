import {
    Button,
    Table, TableColumn, Dialog, Popover,Loading, Message, MessageBox,
    Icon,
    Tooltip,
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
    OptionGroup,
    Switch,
    CheckboxGroup,
    RadioButton,
    TabPane,
    Tabs,
    Steps,
    Step,
    Alert,
    Row,
    Col,
    Transfer,
    DatePicker
} from 'element-ui';
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
window.ninjaTableBus = new window.NINJATABLE.Vue();
// configure language
locale.use(lang);
window.NINJATABLE.Vue.use(Button);
window.NINJATABLE.Vue.use(DatePicker);
window.NINJATABLE.Vue.use(Table);
window.NINJATABLE.Vue.use(ColorPicker);
window.NINJATABLE.Vue.use(Pagination);
window.NINJATABLE.Vue.use(TableColumn);
window.NINJATABLE.Vue.use(Popover);
window.NINJATABLE.Vue.use(Menu);
window.NINJATABLE.Vue.use(Header);
window.NINJATABLE.Vue.use(MenuItem);
window.NINJATABLE.Vue.use(Loading);
window.NINJATABLE.Vue.use(Icon);
window.NINJATABLE.Vue.use(Tooltip);
window.NINJATABLE.Vue.use(Container);
window.NINJATABLE.Vue.use(Aside);
window.NINJATABLE.Vue.use(Main);
window.NINJATABLE.Vue.use(Collapse);
window.NINJATABLE.Vue.use(CollapseItem);
window.NINJATABLE.Vue.use(Dialog);
window.NINJATABLE.Vue.use(Form);
window.NINJATABLE.Vue.use(FormItem);
window.NINJATABLE.Vue.use(Input);
window.NINJATABLE.Vue.use(Select);
window.NINJATABLE.Vue.use(Option);
window.NINJATABLE.Vue.use(OptionGroup);
window.NINJATABLE.Vue.use(Checkbox);
window.NINJATABLE.Vue.use(RadioGroup);
window.NINJATABLE.Vue.use(Radio);
window.NINJATABLE.Vue.use(RadioButton);
window.NINJATABLE.Vue.use(Switch);
window.NINJATABLE.Vue.use(CheckboxGroup);
window.NINJATABLE.Vue.use(Tabs);
window.NINJATABLE.Vue.use(TabPane);
window.NINJATABLE.Vue.use(Steps);
window.NINJATABLE.Vue.use(Step);
window.NINJATABLE.Vue.use(Alert);
window.NINJATABLE.Vue.use(Row);
window.NINJATABLE.Vue.use(Col);
window.NINJATABLE.Vue.use(Transfer);
window.NINJATABLE.Vue.use(DatePicker);

window.NINJATABLE.Vue.prototype.$message = Message;
window.NINJATABLE.Vue.prototype.$msgbox = MessageBox;
window.NINJATABLE.Vue.prototype.$alert = MessageBox.alert;
window.NINJATABLE.Vue.prototype.$confirm = MessageBox.confirm;
window.NINJATABLE.Vue.prototype.$prompt = MessageBox.prompt;

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


function ignoreNinjaerror()
{
    return true
}
window.onerror = ignoreNinjaerror();

Application.router = router;
window.ninjaApp = new window.NINJATABLE.Vue(Application).$mount('#data-tables-app');
