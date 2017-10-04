<template>
    <div>
        <div v-if="isReady">
            <component :is="tab" :config="config"></component>
        </div>
    </div>
</template>

<script type="text/babel">
    import { tableHomeTabComponents } from '../../data/data';
    import each from 'lodash/each'
    export default {
        name: 'userComponents',
        props: ['config'],
        data() {
            return {
                tab: this.$route.query.user_tab,
                isReady: false,
                validComponents: {}
            }
        },
        watch: {
            '$route' (to, form) {
                if(to.query.user_tab) {
                    if(this.validComponents[to.query.user_tab]) {
                        this.tab = to.query.user_tab;
                    }
                }
            }
        },
        methods: {
           
        },
        mounted() {
            each(tableHomeTabComponents, (component, key) => {
                this.$options.components[key] = component;
                this.validComponents[key] = true;
            });
            this.isReady = true;
        }
    }
</script>