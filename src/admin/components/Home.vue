<template>
    <div>
        <div class="ninja_main_nav">
            <span class="plugin-name">{{ $t('Ninja Tables') }}<span v-if="has_pro"> Pro</span></span>

            <router-link v-for="menuItem in topMenus" :key="menuItem.route" active-class="ninja-tab-active" exact :class="['ninja-tab']" :to="{ name: menuItem.route }">
                {{ menuItem.title }}
            </router-link>

            <a v-if="!has_pro" href="https://wpmanageninja.com/downloads/ninja-tables-pro-add-on/?utm_source=ninja-tables&utm_medium=wp&utm_campaign=wp_plugin&utm_term=upgrade" target="_blank" class="ninja-tab buy_pro_tab">Buy Pro</a>
        </div>

        <router-view :has-pro="has_pro"></router-view>
    </div>
</template>

<script type="text/babel">
    export default {
        name: 'home',
        data() {
            return {
                has_pro: window.ninja_table_admin.hasPro,
                topMenus: []
            }
        },
        methods: {
            setTopMenu() {
                this.topMenus = this.applyFilters('ninja_table_top_menus', [
                    {
                        route: 'home',
                        title: 'All Tables'
                    },
                    {
                        route: 'import_tables',
                        title: 'Tools and Settings'
                    },
                    {
                        route: 'help',
                        title: 'Help & Documentation'
                    }
                ]);
            },
        },
        mounted() {
            this.setTopMenu();
        }
    }
</script>

<style>
    .plugin-name {
        float: left;
        padding: 8px 0;
    }
</style>

