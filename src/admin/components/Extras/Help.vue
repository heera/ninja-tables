<template>
    <div>
        <div class="help_container">
            <h1>{{ $t('Plugin Documentation and Help') }}</h1>
            <hr />
            <p>Please check the following Tutorials and Documentation for Ninja Tables Plugin</p>
            <ul class="doc_items">
                <li v-for="(doc, index) in docs" :key="index"><a :href="doc.url" target="_blank">{{ doc.title }}</a></li>
            </ul>
            
            <p>{{ $t('If You get any bug or need custom development work done please email us at') }} <a href="mailto:plugins@wpmanageninja.com" target="_blank">plugins@wpmanageninja.com</a></p>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        name: 'Help',
        data() {
            return {
               docs: [
                   {
                       title: 'Ninja Tables Introduction',
                       url: 'https://wpmanageninja.com/r/docs/ninja-tables/getting-started/?utm_source=ninja-tables'
                   },
                   {
                       title: 'Ninja Tables Demo',
                       url: 'https://wpmanageninja.com/r/docs/ninja-tables/demo/?utm_source=ninja-tables'
                   },
                   {
                       title: 'Setting up a Table',
                       url: 'https://wpmanageninja.com/r/docs/ninja-tables/setting-up-a-table/?utm_source=ninja-tables'
                   },
                   {
                       title: 'Configure Responsive Breakdowns for Table',
                       url: 'https://wpmanageninja.com/r/docs/ninja-tables/configure-responsive-breakdowns-for-table/?utm_source=ninja-tables'
                   },
                   {
                       title: 'Import Table Data from CSV',
                       url: 'https://wpmanageninja.com/r/docs/ninja-tables/import-table-data-from-csv/?utm_source=ninja-tables'
                   },
                   {
                       title: 'Export Data from a Table',
                       url: 'https://wpmanageninja.com/r/docs/ninja-tables/export-data/?utm_source=ninja-tables'
                   },
                   {
                       title: 'Export Data from a Table',
                       url: 'https://wpmanageninja.com/r/docs/ninja-tables/export-data/?utm_source=ninja-tables'
                   },
                   {
                       title: 'Import Table from CSV',
                       url: 'https://wpmanageninja.com/r/docs/ninja-tables/import-table-from-csv/?utm_source=ninja-tables'
                   },
                   {
                       title: 'Import Table from JSON file',
                       url: 'https://wpmanageninja.com/r/docs/ninja-tables/import-table-from-json-file/?utm_source=ninja-tables'
                   },
                   {
                       title: 'Import Table from Table Press Plugin',
                       url: 'https://wpmanageninja.com/r/docs/ninja-tables/import-table-from-table-press-plugin/?utm_source=ninja-tables'
                   }
               ]
            }
        },
        methods: {
           
        },
        mounted() {
            
        }
    }
</script>