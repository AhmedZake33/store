<template>
  <Chat v-if="renderComponent"></Chat>
</template>

<script>

import Chat from "@/views/chat/chat/components/Chat.vue";
export default {
  name: "index",
  components: { Chat },
  data() {
    return {
      renderComponent: true,
    }
  },
  computed: {
    lang: {
      get() {
        return this.$i18n.locale;
      },
    },
  },
  watch: {
    lang: function () {
      // remove the my-component component from the DOM
      this.renderComponent = false;
      this.$nextTick(() => {
        // add my-component component in DOM
        this.renderComponent = true;
      });
    },
  },
};
</script>
<style>
.chat-application #myHeader {
  display: none !important;
}
</style>
