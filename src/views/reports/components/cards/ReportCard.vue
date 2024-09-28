<template>
  <b-card no-body v-if="title" class="card-congratulation-medal">
    <h5>{{ title }}</h5>
    <b-card-text class="font-small-3"> Download Report PDF </b-card-text>
    <b-button
      @click="openModal()"
      v-ripple.400="'rgba(255, 255, 255, 0.15)'"
      variant="primary"
    >
      {{ $t("Global.export") }}
    </b-button>
    <report-modal
      v-if="show"
      :filtersModal="filters"
      @close="close()"
      @setLang="setLang()"
      :show="show"
      :title="title"
      size="lg"
      :link="link"
    >
      <template #filters_modal>
        <slot name="filters"></slot>
      </template>
    </report-modal>
  </b-card>
</template>
  
  <script>
import { BCard, BCardText, BLink, BButton, BImg } from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import ReportModal from "@/views/reports/components/modals/ReportModal.vue";
export default {
  components: {
    BCard,
    BCardText,
    BLink,
    BImg,
    BButton,
    ReportModal,
  },
  directives: {
    Ripple,
  },
  props: {
    title: String,
    link: String,
    filters: {
      type: Object,
      default: null,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      show: false,
    };
  },
  methods: {
    openModal() {
      this.show = !this.show;
    },
    close() {
      this.$emit("reset");
      this.show = false;
    },
    setLang(){
      this.$emit('setLang')
    },
  },
};
</script>
  
  <style lang="scss">
.card_report_content {
  display: flex;
  gap: 1rem;
  width: 100%;
  padding-left: 0.5rem;
  flex-flow: row wrap;
}
.card-congratulation-medal {
  // flex-grow: 1;
  padding: 1rem;
  display: block;
  // border: 1px solid #eee;
  width: 32.3333%;
  align-self: start;
  box-shadow: 17px 17px 23px -7px rgba(0, 0, 0, 0.08) !important;
  -webkit-box-shadow: 17px 17px 23px -7px rgba(0, 0, 0, 0.08);
  -moz-box-shadow: 17px 17px 23px -7px rgba(0, 0, 0, 0.08);
}
</style>