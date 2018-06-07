<template>
    <div class="license">
        <div class="ninja_header">
            <div v-if="is_valid != 'valid'">
                <h2>Licensing</h2>
                <p>
                    You need to activate your Ninja Table Pro by providing the license key bellow. If you don't have a
                    license key please <a href="https://wpmanageninja.com/checkout/purchase-history/" target="_blank">Click
                    Here</a> to get a license key from your purchase. <br/>Any questions or problems with your license? <a
                        href="https://wpmanageninja.com/contact/" target="_blank">Contact us!</a>
                </p>
            </div>
            <div v-else>
                <h2>Your License is Active</h2>
            </div>
           
        </div>
        <div class="ninja_content">
            <div v-if="is_valid != 'valid'" class="license_form">
                <label for="license_form_input">
                    Enter your license key
                </label>
                <div class="form_input">
                    <input v-model="licenseKey" placeholder="License Key" id="license_form_input"/>
                </div>
                <el-button v-loading="doing_ajax" @click="activateLicense()" class="license_submit" type="primary">Activate Ninja Tables Pro</el-button>
                
                <div class="nt_messages">
                    <p class="error_message" v-html="error_message" v-if="error_message"></p>
                </div>
            </div>
            <div v-else class="license_success">
                <h3>Your license is active! Enjoy Ninja Tables Pro Add On</h3>
                <el-button v-loading="doing_ajax" @click="deactivateLicense()" class="license_submit" type="default" size="mini">Deactivate License</el-button>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        name: 'license',
        data() {
            return {
                licenseKey: '',
                error_message: '',
                doing_ajax: false,
                is_valid: window.ninja_table_admin.hasValidLicense
            }
        },
        methods: {
            activateLicense() {
                if(!this.licenseKey) {
                    this.error_message = 'Please provide a license key';
                    return;
                }
                this.doing_ajax = true;
                this.error_message = '';
                jQuery.post(ajaxurl, {
                    action: '_ninjatables_pro_license_activate_license',
                    _ninjatables_pro_license_key: this.licenseKey
                })
                .then(response => {
                    jQuery('.error_notice_ninjatables_pro_license').remove();
                    this.is_valid = 'valid';
                })
                    .fail(error => {
                        this.error_message = error.responseJSON.data.message;
                    })
                    .always(() => {
                        this.doing_ajax = false;
                    });
            },
            deactivateLicense() {
                this.doing_ajax = true;
                this.error_message = '';
                jQuery.post(ajaxurl, {
                    action: '_ninjatables_pro_license_deactivate_license'
                })
                    .then(response => {
                        this.is_valid = false;
                    })
                    .fail(error => {
                        this.error_message = error.responseJSON.data.message;
                    })
                    .always(() => {
                        this.doing_ajax = false;
                    });
                
            }
        }
    }
</script>

<style lang="scss">
    .license_form {
        text-align: center;
        padding: 20px 0px;
        label {
            font-size: 30px;
            font-weight: normal;
            display: block;
            margin-bottom: 20px;
            text-transform: capitalize;
        }
        .form_input input {
            min-width: 400px;
            height: 48px;
            width: 50%;
            margin-bottom: 20px;
            border-radius: 5px;
            border: 1px solid gray;
            background: #fbfdff;
            font-size: 20px;
            padding: 0px 10px;
        }
        .license_submit {

        }
        .error_message {
            margin-top: 40px;
            padding: 10px;
            background: #ffe491;
            color: #000000;
            font-weight: bold;
            border-radius: 5px;
        }
    }
    .license_success {
        text-align: center;
        padding: 40px 0px;
    }
</style> 