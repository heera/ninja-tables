<template>
    <el-alert title=""
              type="warning"
              :closable="false"
              class="premium-notice"
    >
        <p>
            This is a Premium feature. Get
            <b v-if="highlight">{{highlight}},</b>
            <b>unlimited customizations</b>,
            <b>data filters</b>,
            <b>professional looks</b>,
            <b>Many More Integrations</b>
            and so many things from the Pro version.
        </p>

        <a href="https://wpmanageninja.com/ninja-tables/ninja-tables-pro-pricing/?utm_source=ninja-tables&utm_medium=wp&utm_campaign=wp_plugin&utm_term=upgrade"
           class="buy_now_button el-button el-button--danger el-button--mini">
            Get Premium Version Now
        </a>
    </el-alert>
</template>

<script>
    export default {
        name: "PremiumNotice",
        props: ['highlight']
    }
</script>

<style scoped lang="scss">
    .premium-notice {
        .buy_now_button {
            text-decoration: none;
        }
    }
</style>
