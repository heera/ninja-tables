<template>
    <div class="wp_vue_editor_wrapper" :class="'editor_wrapper_'+ninja_editor_id">
        <template v-if="hasWpEditor">
            <button v-if="!has_pro" type="button" class="button ninja_demo_media_button"><span class="dashicons dashicons-admin-media"></span> Add Media (pro)</button>
            <textarea class="wp_vue_editor" :id="ninja_editor_id">{{value}}</textarea>
        </template>
        <template v-else>
            <p style="font-style: italic"><small>WP Editor is only available on WordPress version 4.8 or later. Please Upgrade Your WordPress Core</small></p>
            <textarea
                      class="wp_vue_editor wp_vue_editor_plain"
                      v-model="plain_content">
            </textarea>
        </template>
        
    </div>
</template>

<script type="text/babel">
    export default {
        name: 'wp_editor',
        props: {
            editor_id: {
                type: String,
                default() {
                    return 'wp_editor_'+Date.now();
                }
            },
            value: {
                type: String,
                default() {
                    return '';
                }
            }
        },
        data() {
            return {
                hasWpEditor: !!window.wp.editor,
                plain_content: this.value,
                has_pro: !!window.ninja_table_admin.hasPro,
            }
        },
        computed: {
          ninja_editor_id() {
              return 'ninja_editor_'+this.slugify(this.editor_id);
            }  
        },
        watch: {
            plain_content() {
                this.$emit('input', this.plain_content);
            },
            value() {
                if(!this.value) {
                    this.reloadEditor();
                }
            }
        },
        methods: {
            initEditor() {
                if(this.hasWpEditor) {
                    wp.editor.remove(this.ninja_editor_id);
                    const that = this;
                    wp.editor.initialize(this.ninja_editor_id, {
                        mediaButtons: this.has_pro,
                        mode : "none",
                        tinymce: {
                            toolbar1: 'bold,italic,bullist,numlist,link,blockquote,alignleft,aligncenter,alignright,strikethrough,forecolor,codeformat,undo,redo',
                            setup(ed) {
                                ed.on('change', function (ed, l) {
                                    that.changeContentEvent();
                                });
                            }
                        },
                        quicktags: true
                    });
                    jQuery('#'+this.ninja_editor_id).on('change', function(e) {
                        that.changeContentEvent();
                    });
                }
            },
            slugify(text)
            {
                return text.toString().toLowerCase()
                    .replace(/\s+/g, '-')           // Replace spaces with -
                    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                    .replace(/^-+/, '')             // Trim - from start of text
                    .replace(/-+$/, '');            // Trim - from end of text
            },
            reloadEditor() {
                wp.editor.remove(this.ninja_editor_id);  
                jQuery('#'+ this.ninja_editor_id).val('');
                this.initEditor();
            },
            changeContentEvent() {
                let content = wp.editor.getContent(this.ninja_editor_id);
                this.$emit('input', content);
            }
        },
        mounted() {
            this.initEditor();
            jQuery('.editor_wrapper'+this.ninja_editor_id+' .ninja_demo_media_button').on('click', function (e) {
                e.preventDefault();
                window.ninjaTableBus.$emit('show_pro_popup', 1);
            });
        },
        beforeDestroy() {
          
        }
    }
</script> 
<style lang="scss">
    button.button.ninja_demo_media_button {
        position: absolute;
        z-index: 9999999999;
        cursor: pointer;
    }
    .wp_vue_editor {
        width: 100%;
        min-height: 100px;
    }
    .wp_vue_editor_wrapper {
        position: relative;

        .popover-wrapper {
            z-index: 2;
            position: absolute;
            top: 0;
            left: 0;

            &-plaintext {
                left: auto;
                right: 0;
                top: -32px;
            }
        }
    }
</style>