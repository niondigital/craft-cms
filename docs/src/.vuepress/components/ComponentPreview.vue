<template>
  <div class="component-preview">
    <h3>{{ name }}</h3>
    <iframe ref="iframe"></iframe>
    <pre class="filepath">{{ component }}</pre>
    <h4>Config</h4>
    <pre
      class="language-json"
    ><code>{{ JSON.stringify(config, null, 2) }}</code></pre>
  </div>
</template>

<script>
  export default {
    name: 'ComponentPreview',
    props: {
      name: {
        type: String,
      },
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

  .filepath {
    padding: 0;
    background: transparent;
    font-size: 12px;
    margin: 0;
  }
</style>
