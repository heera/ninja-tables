<template>
    <div>
        <p>
            Data Transformer is a powerful tool where you can concat any column values easily into any valid html and show as computed value.
        </p>
        <el-input
          type="textarea"
          placeholder="Please Input Transform Values (HTML supported)"
          :disabled="!hasPro"
          v-model="column.transformed_value"
        ></el-input>
        <ninja-premium-notice v-if="!hasPro" highlight="Transform Column Value"></ninja-premium-notice>

        <div class="ninja_instruction">
            You can use the following Reference Shortcode Values to transform your cell value
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th>Column Title</th>
                        <th>Reference Shortcode</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="column in columns" :key="column.key">
                        <td>{{ column.name }}</td>
                        <td>{<span>{{column.key}}</span>}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import ninja_alert from './alert';
    import NinjaPremiumNotice from './PremiumNotice';
    export default {
        name: 'ContentTransformer',
        props: ['column', 'columns'],
        components: {
            ninja_alert,
            NinjaPremiumNotice
        },
        data() {
            return {
                hasPro: !!window.ninja_table_admin.hasPro
            };
        }
    };
</script>
