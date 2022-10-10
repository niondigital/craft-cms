<template>
  <pre
    class="language-json"
  ><code>{{ JSON.stringify(data, null, 2) }}</code></pre>
</template>

<script>
  export default {
    props: {
      data: {
        type: Object,
        default: () => {},
      },
    },
  };
</script>
