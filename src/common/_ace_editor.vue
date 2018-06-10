<template>
    <div v-loading="loading" element-loading-text="Loading CSS Editor...">
        <div class="ace_container">
            <div class="ninja_custom_css_editor" id="ninja_custom_css_editor">{{ value }}</div>
        </div>
        <div  class="editor_errors">
            <span>Please don't include <code>&lt;style&gt;&lt;/style&gt;</code> tag</span>
            <span v-show="editorError" style="text-align: right; display: inline-block; color: #ff7171; float: right">{{ editorError }}</span>
        </div>
    </div>
</template>
<script type="text/babel">
    export default {
        name: 'ninja_ace_editor',
        props: ['value'],
        data() {
            return {
                ace_path: window.ninja_table_admin.ace_path_url,
                editorError: '',
                loading: true
            }
        },
        methods: {
            loadDependencies() {
                if(typeof ace == 'undefined') {
                    jQuery.get(this.ace_path + '/ace.min.js', () => {
                        console.log('loaded');
                        this.initAce();
                    });
                } else {
                    this.initAce();
                }
            },
            initAce() {
                ace.config.set("workerPath", this.ace_path);
                ace.config.set("modePath", this.ace_path);
                ace.config.set("themePath", this.ace_path);
                let editor = ace.edit("ninja_custom_css_editor");
                editor.setTheme("ace/theme/monokai");
                editor.session.setMode("ace/mode/css");
                editor.getSession().on("changeAnnotation", () => {
                    var annot = editor.getSession().getAnnotations();
                    this.editorError = '';
                    for (var key in annot) {
                       if(annot[key].type == 'error') {
                           this.editorError = annot[key].text;
                       }
                    }
                });

                editor.getSession().on("change", () => {
                    console.log(editor.getSession().getValue());
                    this.$emit('input', editor.getSession().getValue());
                });
                
                this.loading = false;
            }
        },
        mounted() {
            this.loadDependencies();
        }
    }
</script> 

<style>
    .ninja_custom_css_editor {
       min-height: 350px;
        height: auto;
    }
    .ace_gutter-cell.ace_warning {
        display: none;
    }
</style>