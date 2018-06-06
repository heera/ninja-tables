const Home = require('./components/Home.vue');
const AllTables = require('./components/AllTables.vue');
const Tools = require('./components/Tools.vue');
const TableHome = require('./components/TableHome.vue');
const TableDataItems = require('./components/TableRows.vue');
const TableColumns = require('./components/TableColumns.vue');
const ExportImport = require('./components/extras/ExportImport.vue')
const UserComponents = require('./components/extras/UserComponents.vue')
const Help = require('./components/extras/Help.vue');
const TableAdvancedSettings = require('./components/TableAdvancedSettings');
const TableAdditionalCss = require('./components/TableAdditionalCss');

export const routes = [
    {
        path: '/',
        component: Home,
        props: true,
        children: [
            {
                path: '/',
                name: 'home',
                component: AllTables
            },
            {
                path: '/tools',
                name: 'tools',
                component: Tools
            },
            { 
                path: '/help',
                name: 'help',
                component: Help
            }
        ]
    },
    {
        path: '/tables/:table_id',
        component: TableHome,
        props: true,
        children: [
            {
                path: '/',
                name: 'data_items',
                component: TableDataItems
            },
            {
                path: 'columns',
                name: 'data_columns',
                component: TableColumns
            },
            {
                path: 'advanced_settings',
                name: 'advanced_settings',
                component: TableAdvancedSettings
            },
            {
                path: 'additional_css',
                name: 'additional_css',
                component: TableAdditionalCss
            },
            {
                path: 'import-export',
                name: 'import-export',
                component: ExportImport
            },
            {
                path: 'tab',
                name: 'custom_tab',
                component: UserComponents
            },
        ]
    }
];