<template>
  <section>
    <h2 class="mx-2 my-2">{{ title }}</h2>
    <div class="card_report_content">
      <slot name="content" />
    </div>
  </section>
</template>
  
  <script>
import {
  BCard,
  BCardText,
  BButton,
  BRow,
  BCol,
  BImg,
  BCardBody,
  BCardTitle,
  BCardSubTitle,
  BLink,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";

export default {
  components: {
    BCard,
    BCardText,
    BButton,
    BCardBody,
    BCardTitle,
    BCardSubTitle,
    BRow,
    BCol,
    BLink,
    BImg,
  },
  directives: {
    Ripple,
  },
  props: {
    title: String,
  },
};
</script>
  
<style lang="scss">
.card .card-title.custom_title {
  // border-bottom: 1px solid #ddd;
  padding: 0rem 2rem;
  padding-top: 1.5rem;
  padding-bottom: 0rem;
  margin-bottom: 0;
  //   background-color: gray;
  //   color: #fff;
}
</style>