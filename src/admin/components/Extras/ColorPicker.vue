<template>
    <div class="form_group">
        <el-color-picker
                show-alpha
                @active-change="changeColor"
                v-model="color"></el-color-picker>
        <label>{{label}}</label>
    </div>
</template>

<script type="text/babel">
    export default {
        name: 'ninja_color_picker',
        props: ['label', 'value'],
        data() {
            return {
                color: '',
                previous_color: ''
            }
        },
        watch: {
            color(value) {
                if(value === 'transparent') {
                    this.color = '';
                }
                this.previous_color = this.color;
                this.$emit('input', this.color);
            }
        },
        methods: {
            changeColor(color) {
                if(this.previous_color === 'transparent') {
                    this.previous_color = color;
                    this.color = 'transparent';
                } else {
                    this.color = color;
                }
            }
        },
        mounted() {
            console.log(this.value);
            this.color = this.value;
        }
    }
</script>