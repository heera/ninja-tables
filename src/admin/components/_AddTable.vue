<template>
    <!-- MODAL -->
   <div>
       <div class="ninja_modal-body">
           <div class="form-group">
               <label for="name">{{ $t('Title') }}</label>
               <input type="text" id="name" class="form-control" v-model="table.post_title">
           </div>
           <div class="form-group">
               <label>{{ $t('Description') }}</label>
               <wp_editor v-model="table.post_content"></wp_editor>
           </div>
       </div>
       <div class="modal-footer">
           <button class="btn btn-default" @click="closeModal">{{ $t('Cancel') }}</button>
           <button class="btn btn-primary btn-flex" @click="addTable">
               <span v-if="table.ID">{{ $t('Update') }}</span>
               <span v-else>{{ $t('Add') }}</span>
               <i v-if="btnLoading" class="fooicon fooicon-spin fooicon-circle-o-notch"></i>
           </button>
       </div>
   </div>
    <!-- END OF MODAL -->
</template>

<script type="text/babel">
    import wp_editor from '../../common/_wp_editor'
    export default {
        name: 'add_table',
        components: {
            wp_editor: wp_editor  
        },
        props: { 
            table: {
                type: Object,
                default() {
                    return {
                        ID: null,
                        post_title: '',
                        post_content: ''
                    }
                }
            }
        },
        data() {
            return {
                btnLoading: false,
                editorOption: {
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike', 'link'],         // toggled buttons
                            ['blockquote', 'code-block'],
                            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                            [{ 'align': [] }],
                            [{ 'direction': 'rtl' }]
                        ]
                    }
                }
            }
        },
        methods: {
            addTable: function() {
                this.btnLoading = true;
                let data = {
                    action: 'ninja_tables_ajax_actions',
                    target_action: 'store-a-table',
                    post_title: this.table.post_title,
                    post_content: this.table.post_content,
                    tableId: this.table.ID
                };
                jQuery.post(ajaxurl, data)
                    .then( (response) => {
                        this.$message({
                            showClose: true,
                            message: response.message,
                            type: 'success'
                        });
                        
                        if(this.table.ID) {
                            this.closeModal();
                        } else {
                            this.$emit('table_inserted', response.table_id);
                        }
                    })
                    .fail( (error) => {
                        if(error.responseJSON.data.message) {
                            this.$message({
                                showClose: true,
                                message: error.responseJSON.data.message,
                                type: 'error'
                            });
                        } else {
                            this.$message({
                                showClose: true,
                                message: error.responseText,
                                type: 'error'
                            });
                        }
                    })
                    .always(() => {
                        this.btnLoading = false;
                    });
            },
            closeModal() {
                this.$emit('modal_close');
            },
            onEditorChange({ editor, html, text }) {
                this.table.post_content = html
            }
        }
    }
</script> 