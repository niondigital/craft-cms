<template>
  <div class="component-preview">
    <iframe ref="iframe"></iframe>
  </div>
</template>

<script>
  export default {
    name: 'ComponentPreview',
    props: {
      component: {
        type: String,
      },
      config: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        previewHtml: null,
      };
    },
    mounted() {
      const params = new URLSearchParams(this.config);
      console.log(params);
      fetch(
        `https://craft4.ddev.site/admin/components/preview/${this.component}?${params}`
      )
        .then((response) => response.text())
        .then((html) => {
          this.$refs.iframe.contentDocument.open();
          this.$refs.iframe.contentDocument.write(html);
          this.$refs.iframe.contentDocument.close();
        });
    },
  };
</script>

<style scoped>
  .component-preview {
    margin: 1em 0;
  }

  iframe {
    border: 0;
    width: 100%;
  }
</style>
