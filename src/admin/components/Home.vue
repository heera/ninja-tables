<template>
    <div>
        <h2 class="nav-tab-wrapper">
            <span class="plugin-name">{{ $t('Ninja Tables') }}</span>

            <router-link active-class="nav-tab-active" exact :class="['nav-tab']"
                         :to="{ name: 'home' }"
            >
                {{ $t('Home') }}
            </router-link>

            <router-link active-class="nav-tab-active" exact :class="['nav-tab']"
                         :to="{ name: 'tools' }"
            >
                {{ $t('Tools') }}
            </router-link>
            
            <router-link active-class="nav-tab-active" exact :class="['nav-tab']"
                         :to="{ name: 'help' }"
            >
                {{ $t('Help') }}
            </router-link>
            <a v-if="!has_pro" href="#" target="_blank" class="nav-tab buy_pro_tab">Buy Pro</a>
        </h2>
        
        <router-view></router-view>
    </div>
</template>

<script type="text/babel">
    export default {
        name: 'home',
        data() {
            return {
                has_pro: window.ninja_table_admin.hasPro,
            }
        }
    }
</script>

<style>
    .plugin-name {
        float: left;
        padding: 8px 0;
    }
    .buy_pro_tab {
        background: #e04f5e;
        color: white;
    }
</style>

