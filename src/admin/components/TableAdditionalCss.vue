<template>
    <div>
        <div class="section_block">
            <h3>{{ $t('Additional CSS') }}</h3>

            <ace_css_editor v-model="code"></ace_css_editor>
            <br/>
            <div class="custom_css_submit">
                <el-button @click="saveCSS()" type="primary">Save Custom CSS</el-button>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        name: 'ninja_css_editor',
        props: ['config'],
        components: {
            ace_css_editor: require('../../common/_ace_editor')
        },
        data() {
            return {
                code: this.config.table.custom_css
            }
        },
        methods: {
            saveCSS() {
                jQuery.post(ajaxurl, {
                    action: 'ninja_tables_ajax_actions',
                    target_action: 'save_custom_css',
                    table_id: this.config.table.ID,
                    custom_css: this.code
                })
                    .then(response => {
                        this.$message( {
                            showClose: true,
                            message: response.data.message,
                            type: 'success'
                        } );
                        this.$set(this.config.table, 'custom_css', this.code );
                    })
                    .then(error => {
                        console.log(error);
                    })
                    .always(() => {
                        
                    });
            }
        },
        mounted() {

        }
    }
</script> 