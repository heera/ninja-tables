<template>
    <div>
        You can set new value without any condition here. For example, if you want to set an image
        from an image URL, then you may use "&ltimg src='{value}' /&gt".
        <el-input
          type="textarea"
          autosize
          placeholder="Please input"
          v-model="column.transformed_value"
        ></el-input>
    </div>
</template>

<script>
    export default {
        name: 'ContentTransformer',
        props: ['column'],
        data() {
            return {
                // ...
            };
        }
    };
</script>
