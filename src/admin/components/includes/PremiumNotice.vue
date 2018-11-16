<template>
    <el-alert title=""
              type="warning"
              :closable="false"
              show-icon
              class="premium-notice"
    >
        <p>
            This is a Premium feature. Get 
            <b>unlimited customizations</b>, 
            <b>data filters</b>, 
            <b>professional looks</b> 
            and so many things from the Pro version.
        </p>
        
        <a href="https://wpmanageninja.com/downloads/ninja-tables-pro-add-on/?utm_source=ninja-tables&utm_medium=wp&utm_campaign=wp_plugin&utm_term=upgrade"
           class="buy_now_button el-button el-button--danger el-button--mini">
            Buy Now
        </a>
    </el-alert>
</template>

<script>
    export default {
        name: "PremiumNotice"
    }
</script>

<style scoped lang="scss">
    .premium-notice {
        .buy_now_button {
            text-decoration: none;
        }
    }
</style>
