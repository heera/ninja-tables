<template>
    <div>
        <div v-loading="fetching" v-if="fetching">
            <h3>Loading... Please wait</h3>
        </div>
        <div v-else class="section_block">
            <el-radio-group v-model="current_tab">
                <el-radio-button label="additional_css">Additional Custom CSS</el-radio-button>
                <el-radio-button label="additional_js">Custom Javascript</el-radio-button>
            </el-radio-group>
            <hr />
            <template v-if="current_tab == 'additional_css'">
                <p>You may add <code>#footable_parent_{{config.table.ID}} </code> as your css selector prefix to target this specific table</p>
                <ace_code_editor editor_id="ninja_custom_css" mode="css" v-model="custom_css"></ace_code_editor>
                <span>Please don't include <code>&lt;style&gt;&lt;/style&gt;</code> tag</span>
                <br/>
                <div style="margin-top: 20px" class="custom_css_submit">
                    <el-button @click="saveScripts()" type="success">Save Custom CSS</el-button>
                </div>
            </template>
            <template v-if="current_tab == 'additional_js'">
                <p>Your additional JS code will run after ninja table initialized. Please provide valid javascript code. Invalid JS code may break the table UI.</p>
                <div class="js_instruction">
                    The Following JavaScrip variables are available that you can use: <br />
                    <b>$table</b> : The Javascript DOM object of the table<br />
                    <b>tableConfig</b> : The configuration object of the table.
                </div>
                <ace_js_editor editor_id="ninja_custom_js" mode="javascript" v-model="custom_js"></ace_js_editor>
                <span>Please don't include <code>&lt;script>&lt;/script&gt;</code> tag</span>
                <template v-if="!hasPro">
                    <p>Custom Javascript feature is a pro feature along with many awesome features. Please upgrade to pro.</p>
                </template>
                <template v-else>
                    <div style="margin-top: 20px" class="custom_css_submit">
                        <el-button @click="saveScripts()" type="success">Save Custom Javascript</el-button>
                    </div>
                </template>
            </template>
        </div>

        <div class="section_block">

        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        name: 'ninja_css_editor',
        props: ['config'],
        components: {
            ace_code_editor: require('../../../common/_ace_editor'),
            ace_js_editor: require('../../../common/_ace_editor_js'),
        },
        data() {
            return {
                current_tab: 'additional_css',
                custom_css: '',
                custom_js: '',
                hasPro: !!window.ninja_table_admin.hasPro,
                fetching: false,
            }
        },
        methods: {
            saveScripts() {
                if(!this.hasPro) {
                    this.custom_js = '';
                }
                this.$post({
                    action: 'ninja_tables_ajax_actions',
                    target_action: 'save_custom_css_js',
                    table_id: this.config.table.ID,
                    custom_css: this.custom_css,
                    custom_js: this.custom_js,
                })
                    .then(response => {
                        this.$message( {
                            showClose: true,
                            message: response.data.message,
                            type: 'success'
                        } );
                        this.$set(this.config.table, 'custom_css', this.custom_css );
                    })
                    .then(error => {
                        console.log(error);
                    })
                    .always(() => {

                    });
            },
            getScripts() {
                this.fetching = true;
                this.$get({
                    action: 'ninja_tables_ajax_actions',
                    target_action: 'get_custom_css_js',
                    table_id: this.config.table.ID,
                })
                    .then(response => {
                        this.custom_css = response.data.custom_css;
                        this.custom_js = response.data.custom_js;
                    })
                    .fail(error => {

                    })
                    .always(() => {
                        this.fetching = false;
                    });
            }
        },
        mounted() {
            this.getScripts();
        }
    }
</script>

<style>
    .js_instruction {
        padding: 10px 20px;
        background: rgb(255, 255, 255);
        margin-bottom: 20px;
        font-size: 14px;
        line-height: 22px;
    }
</style>
