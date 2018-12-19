const Home = require('./components/Home.vue');
const AllTables = require('./components/AllTables.vue');
const Tools = require('./components/Tools/Tools.vue');
const ImportTable = require('./components/Tools/Import.vue');
const PermissionSettings = require('./components/Tools/Privacy');
const DefaultTableAppearance = require('./components/Tools/DefaultAppearance');
const LicenseSettings = require('./components/Tools/License');


const TableHome = require('./components/Table/TableHome.vue');
const TableDataItems = require('./components/Table/TableRows.vue');
const TableColumns = require('./components/Table/ColumnEditor/TableColumns.vue');
const ExportImport = require('./components/Table/Tools/ExportImport');
const UserComponents = require('./components/extras/UserComponents.vue')
const Help = require('./components/extras/Help.vue');
const TableAdditionalCss = require('./components/Table/TableAdditionalCss');
const TableDesignStudio = require('./components/Table/TableDesignStudio');

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
                component: Tools,
                children: [
                    {
                        path: '/',
                        name: 'import_tables',
                        component: ImportTable
                    },
                    {
                        path: 'default_table_appearance',
                        name: 'default_table_appearance',
                        component: DefaultTableAppearance
                    },
                    {
                        path: 'permission',
                        name: 'permission',
                        component: PermissionSettings
                    },
                    {
                        path: 'licensing',
                        name: 'licensing',
                        component: LicenseSettings
                    }
                ]
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
                path: 'design_studio',
                name: 'design_studio',
                component: TableDesignStudio
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
