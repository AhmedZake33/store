<template>
  <b-row class="custom_flex">
    <b-col cols="12">
      <!-- <b-overlay
        :show="loading"
        rounded="sm"
      > -->
      <b-card v-if="data">
        <b-card-header :class="'mt-0 pt-0 pb-0 p-0 d-flex justify-content-end'" >
          <slot
            name="edit"
            :data="data"
          />
        </b-card-header>
        <div>
          <!-- :data="data.payment_setting" -->
          <list
            style="padding: 0 !important"
            :data="data"
            :only="[ ]"
            :has-margins="false"
            class="new_edit"
          >
            <template #custom_show>
              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t('Global.faculty') }}
                </th>
                <td>
                  <div v-if="data.faculty">
                    {{ $i18n.locale == 'ar' ? data.faculty.name_local : data.faculty.name }}
                  </div>
                </td>
              </tr>
              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t('Global.term') }}
                </th>
                <td>
                  <div v-if="data.term">
                    {{ $i18n.locale == 'ar' ? data.term.name_local : data.term.name }}
                  </div>
                </td>
              </tr>
              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t('Global.certificate') }}
                </th>
                <td>
                  <div v-if="data.certificate">
                    {{ $i18n.locale == 'ar' ? data.certificate.name_local : data.certificate.name }}
                  </div>
                </td>
              </tr>
              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t('Global.UG_date') }}
                </th>
                <td>
                  <div v-if="data.UG_date">
                    {{ data.UG_date }}
                  </div>
                </td>
              </tr>
              <tr>
                <th scope="row" :width="'20%'">
                  {{ $t('Global.PG_date') }}
                </th>
                <td>
                  <div v-if="data.PG_date">
                    {{ data.PG_date }}
                  </div>
                </td>
              </tr>
            </template>
          </list>
        </div>
      </b-card>
      <!-- </b-overlay> -->
    </b-col>
    <b-row style="width: 100%">
      <b-col md="12" style="text-align: end">
        <b-button
          v-ripple.400="'rgba(186, 191, 199, 0.15)'"
          type="reset"
          variant="outline-secondary"
          @click="$emit('hideModal')"
        >
          {{ $t("Global.cancel") }}
        </b-button>
      </b-col>
    </b-row>
  </b-row>
</template>

<script>
import {
  BTabs,
  BTab,
  BCardText,
  BCard,
  BBadge,
  BCol,
  BRow,
  BCardHeader,
  BOverlay,
  BButton,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import List from "@/views/components/info/list";

export default {
  components: {
    BCardText,
    BCardHeader,
    BTabs,
    BTab,
    BCard,
    BCol,
    BOverlay,
    BRow,
    BBadge,
    BButton,
    List,
  },
  directives: {
    Ripple,
  },
  props: {
    data: null,
    loading: false,
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss">
.custom_flex .card .row div {
  margin-bottom: 6px;
}
.custom_flex .card .row div div {
  display: flex;
  flex-direction: column;
  span,
  a {
    margin-inline-start: 5px;
  }
}
</style>
