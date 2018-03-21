<template>
    <div>
        <h2>{{ $t('Plugin Documentation and Help') }}</h2>
        <hr />
        <ninja_premium></ninja_premium>
        <div class="ninja_documentaion_wrapper">
            <div class="ninja_doc_top_blocks">
                <div class="ff_block block_1_3">
                    <div class="ff_block_box text-center">
                        <img class="block_icon" :src="imageUrl('support.png')" />
                        <h3>Need And Expert Support?</h3>
                        <p>Our EXPERTS would like to assist you for your query and any customization.</p>
                        <p><a target="_blank" class="button button-primary" href="https://wpmanageninja.com/support-tickets/">Contact Support</a></p>
                    </div>
                </div>
                <div class="ff_block block_1_3">
                    <div class="ff_block_box text-center">
                        <img class="block_icon" :src="imageUrl('bug.png')" />
                        <h3>Found a Bug?</h3>
                        <p>Please report us and we promise we will fix that as soon as humanly possible</p>
                        <p><a target="_blank" class="button button-primary" href="https://wpmanageninja.com/support-tickets/submit-ticket/">Submit a Support Ticket</a></p>
                    </div>
                </div>
                <div class="ff_block block_1_3">
                    <div class="ff_block_box text-center">
                        <img class="block_icon" :src="imageUrl('heart.png')" />
                        <h3>Love this Plugin?</h3>
                        <p>Please write a review in wp.org plugin repository. We appreciate it!</p>
                        <p><a target="_blank" class="button button-primary" href="https://wordpress.org/plugins/ninja-tables/reviews/#new-post">Write Review</a></p>
                    </div>
                </div>
                
                <div class="ff_block block_1_3">
                    <div class="ff_block_box help_container">
                        <h3>User Guide</h3>
                        <p>Please check the following Tutorials and Documentation for Ninja Tables Plugin</p>
                        <ul class="doc_items">
                            <li v-for="(doc, index) in docs" :key="index"><a :href="doc.url" target="_blank">{{ doc.title }}</a></li>
                        </ul>
                    </div>
                </div>

                <div class="ff_block block_1_3">
                    <div class="ff_block_box help_container text-center">
                        <img class="block_icon" :src="imageUrl('fluent-icon.png')" />
                        <h3>Try WP FluentFrom</h3>
                        <p>Need to build a contact form by drag and drop form builder. Try the modern contact form plugin with all the necessary input fields, notifications and connect your form with powerful integrations</p>
                        <p><a target="_blank" class="button button-primary" href="https://wordpress.org/plugins/fluentform/">Download from wp.org (Free)</a></p>
                    </div>
                </div>
                
                <div class="ff_block block_1_3">
                    <div class="ff_block_box help_container">
                        <h3>Need More Help?</h3>
                        <p>{{ $t('For any type of query which was not covered in our documentation, Please submit a support ticket') }} <a href="https://wpmanageninja.com/support-tickets/submit-ticket/" target="_blank">Submit a support ticket</a></p>
                    </div>
                </div>
                
            </div>
        </div>

        <fluentpromoad></fluentpromoad>
    </div>
</template>

<script type="text/babel">
   // import FluentPromo from './FluentPromoAdd';
   import FluentPromoAdd from './FluentPromoAdd2.vue';
   import nijaPremium from './NinjaPremiumPromo';
    export default {
        name: 'help',
        components: {
            'fluentpromoad': FluentPromoAdd,
            'ninja_premium': nijaPremium
        },
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
               ],
                img_url: window.ninja_table_admin.img_url
            }
        },
        methods: {
           imageUrl(imageName) {
               return this.img_url+imageName;
           }
        },
        mounted() {
            
        }
    }
</script>