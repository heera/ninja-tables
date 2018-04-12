<template>
    <div class="form_group" v-if="model.data_type == 'date'">
        <label>
            {{ $t('Date Format') }}

            <el-tooltip placement="right" content="Pattern of the date value">
                <i class="el-icon-information" />
            </el-tooltip>
        </label>

        <input type="radio" id="date-format-standard" value="standard" v-model="formatType">
        <label for="date-format-standard" class="normalLabel">Standard</label>

        <input type="radio" id="date-format-custom" value="custom" v-model="formatType">
        <label for="date-format-custom" class="normalLabel">Custom</label>

        <select v-if="formatType == 'standard'" v-model="model.dateFormat" class="form_control mt5">
            <option value="">Select a Format</option>
            <option v-for="(format, i) in dateFormats" :value="i" :key="i">
                {{ i }} - (Ex: {{ format }})
            </option>
        </select>

        <input v-else type="text" v-model="model.dateFormat" 
               placeholder="Enter moment.js supported format" class="form_control mt5"
        >
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
                    if (!this.has_pro) {
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

