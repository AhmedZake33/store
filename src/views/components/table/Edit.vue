<template>
  <section>
    <b-row>
      <b-col cols="12">
        <b-overlay
          :show="loading"
          rounded="sm"
        >
          <b-card :no-body="no_body">
            <div v-if="name">
              <b-card-header
                class="flex-wrap text-initial mx-1_3"
                :class="ml?'ml-1_2':''"
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 0.5rem;
                  padding-left: 0rem;
                "
              >
                <div
                  v-if="name"
                  class=" d-flex align-items-center"
                >
                  <feather-icon
                    v-if="$route.params.id && !add"
                    icon="EditIcon"
                    size="16"
                  />
                  <feather-icon
                    v-else
                    icon="PlusCircleIcon"
                    size="16"
                  />
                  <strong class="mx-1">
                    {{ name }}
                  </strong>
                  <slot name="status" />
                </div>
              </b-card-header>
              <hr class="mt-0" :class="ml?'mb-0':''">
            </div>
            <b-card-body :class="'p-0'">
              <slot name="inputs" />
              <div class="mt-2 d-flex justify-content-start">
                <slot name="footer" />
              </div>
            </b-card-body>
          </b-card>
        </b-overlay>
      </b-col>
    </b-row>
  </section>
</template>
<script>
import BCardActions from '@core/components/b-card-actions/BCardActions.vue'
import {
  BCard,
  BRow,
  BCol,
  BCardTitle,
  BFormInput,
  BButton,
  BCardText,
  BTable,
  BMedia,
  BAvatar,
  BLink,
  BBadge,
  BDropdown,
  BDropdownItem,
  BPagination,
  BOverlay,
  BCardHeader,
  BCardBody,
} from 'bootstrap-vue'
import { mapGetters } from 'vuex'

export default {
  name: 'EditComponent',
  components: {
    BCardActions,
    BCardTitle,
    BCardText,
    BCard,
    BRow,
    BCol,
    BOverlay,
    BCardHeader,
    BCardBody,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
  },
  props: {
    item: Array,
    name: String,
    formName: String,
    except: [],
    big_th: Boolean,
    no_body:Boolean,
    no_padding:Boolean,
    ml:Boolean,
    subtitle: Boolean,
    loading: Boolean,
    status: Number,
    add: false,
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss">
.mx-1_3{
  // margin-left:1.3rem;
  margin-right:1.3rem
}
.ml-1_2{
  margin-left:1.7rem
}
// .vertical.wizard-vertical.vue-form-wizard .wizard-navigation .wizard-nav li a span{
//   color:#746D69 !important;
//   font-weight: 450 !important;
// }
// .vue-form-wizard .wizard-navigation .wizard-nav li a span{
//   color:#746D69 !important;
//   font-weight: 450 !important;
// }
// .wizard-navigation .wizard-nav.wizard-nav-pills li.active a span{
//   font-weight: 450 !important;
// }
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
