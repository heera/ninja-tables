<template>
    <div>
        date field
    </div>
</template>

<script>
    export default {
        name: "DateField",
        props: {
            "model": {
                type: Object,
                default: {}
            },
            "hasPro": {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                dateFormats: {
                    'M/D/YYYY' : "4/28/2018",
                    'M/D/YY': "4/28/18",
                    'MM/DD/YY' : "04/28/18",
                    'MM/DD/YYYY': "04/28/2018",
                    'MMM/DD/YYYY' : "Apr/28/2018",
                    'YY/MM/DD': "18/04/28",
                    'YYYY-MM-DD': "2018-04-28",
                    'DD-MMM-YY' : "28-Apr-18"
                },
                formatType: 'standard',
            }
        },
        watch: {
            formatType() {
                if (this.formatType === "custom") {
                    if (!this.hasPro) {
                        window.ninjaTableBus.$emit('show_pro_popup', 1);
                        this.formatType = 'standard';
                        return;
                    }
                    this.model.dateFormat = "";
                }
            }
        },
        mounted() {
            this.model.dateFormat = this.model.dateFormat || "";
        }
    };
</script>

