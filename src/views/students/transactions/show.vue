<template>
  <div>
    <b-card class="mb-0">
      <b-tabs vertical nav-wrapper-class="nav-hidden" align="left">
        <b-tab>
          <template #title>
            <feather-icon icon="InfoIcon" />
            <span>{{ $t("Global.basic_info") }}</span></template
          >
          <ShowComponent
            v-if="item"
            :data="item"
            :only="[
              'amount',
              'user',
              'created_at',
              'pay_date',
              'payment_number',
              'provider',
              'status',
              'paid',
              ...(item.internal_by ? ['internal_by'] : []),
              item.canceled_transaction_id ? 'bank' : '',
            ]"
            :loading="load"
          >
            <template #amount="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`amount`) }}
              </th>
              <td class="d-flex flex-wrap">
                <strong v-if="data.amount">
                  {{ data.amount }}
                </strong>
              </td>
            </template>
            <template #user="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.created_by`) }}
              </th>
              <td class="d-flex flex-wrap">
                <strong v-if="data.user">
                  <b-link
                    :to="{ name: 'user-show', params: { id: data.user.id } }"
                  >
                    {{
                      $i18n.locale == "ar"
                        ? data.user.name_local
                        : data.user.name
                    }}
                  </b-link>
                </strong>
              </td>
            </template>
            <template #created_at="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.created_at`) }}
              </th>
              <td class="d-flex flex-wrap">
                <strong v-if="data.created_at">
                  {{
                    moment(data.created_at).utc().format("YYYY-MM-DD HH:MM:SS")
                  }}
                </strong>
              </td>
            </template>
            <template #pay_date="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.paid_at`) }}
              </th>
              <td class="d-flex flex-wrap">
                <strong v-if="data.pay_date">
                  {{
                    moment(data.pay_date).utc().format("YYYY-MM-DD HH:MM:SS")
                  }}
                </strong>
              </td>
            </template>
            <template #provider="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Provider`) }}
              </th>
              <td class="d-flex flex-wrap">
                <strong v-if="data.provider">
                  <b-link>
                    {{
                      $i18n.locale == "ar"
                        ? data.provider.name_local
                        : data.provider.name
                    }}
                  </b-link>
                </strong>
              </td>
            </template>
            <template #status="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.status`) }}
              </th>
              <td class="d-flex flex-wrap">
                <b-badge
                  pill
                  v-if="data.status"
                  :variant="`${
                    getCustomStatus(
                      data.status.id ? data.status.id : data.status
                    ).color
                  }`"
                  class="text-capitalize"
                >
                  <span v-if="data.status.id">
                    {{
                      $i18n.locale == "ar"
                        ? data.status.name_local
                        : data.status.name
                    }}
                  </span>
                  <span v-else>
                    {{ data.status }}
                  </span>
                </b-badge>
              </td>
            </template>
            <template #paid="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.paid`) }}
              </th>
              <td class="d-flex flex-wrap">
                <strong v-if="data.paid">
                  {{ data.paid }}
                </strong>
              </td>
            </template>
            <template #payment_number="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.payment_number`) }}
              </th>
              <td class="d-flex flex-wrap">
                <strong v-if="data.payment_number">
                  {{ data.payment_number }}
                </strong>
              </td>
            </template>
            <template #internal_by="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.paid_by`) }}
              </th>
              <td class="d-flex flex-wrap">
                <strong v-if="data.internal_by">
                  <b-link
                    :to="{
                      name: 'user-show',
                      params: { id: data.internal_by.id },
                    }"
                  >
                    {{
                      $i18n.locale == "ar"
                        ? data.internal_by.name_local
                        : data.internal_by.name
                    }}
                  </b-link>
                </strong>
              </td>
            </template>
            <template #bank="{ data }">
              <th scope="row" :width="'20%'">
                {{ $t(`Global.canceled_transaction_id`) }}
              </th>
              <td class="d-flex flex-wrap">
                <strong v-if="data.canceled_transaction_id">
                  <b-link
                    :to="{
                      name: 'transaction',
                      params: { id: data.canceled_transaction_id },
                    }"
                    target="_blank"
                  >
                    {{
                        data.canceled_transaction_id
                    }}
                  </b-link>
                </strong>
              </td>
            </template>
          </ShowComponent>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
  <!--  <b-row>-->
  <!--    <b-col cols="12">-->
  <!--      <b-card class="mb-0">-->
  <!--        <list :data="item" :except="['id', 'removed', 'parent_id','alt_name','type']" ></list>-->
  <!--      </b-card>-->
  <!--    </b-col>-->
  <!--  </b-row>-->
</template>

<script>
import List from "@/views/components/info/list";
import { mapGetters } from "vuex";
import ShowComponent from "@/views/components/info/show";
import {
  BCard,
  BCol,
  BRow,
  BFormFile,
  BForm,
  BFormGroup,
  BButton,
  BFormInput,
  BFormDatepicker,
  BModal,
  BBadge,
  BTab,
  BTabs,
  BLink,
  BDropdown,
  BDropdownItem,
  BFormTextarea,
  validate,
} from "bootstrap-vue";

export default {
  name: "show",
  components: {
    List,
    BCard,
    BCol,
    BRow,
    ShowComponent,
    BTab,
    BTabs,
    BLink,
    BFormFile,
    BForm,
    BFormGroup,
    BButton,
    BFormInput,
    BFormDatepicker,
    BModal,
    BBadge,
    BTab,
    BTabs,
    BLink,
    BDropdown,
    BDropdownItem,
    BFormTextarea,
  },
  computed: {
    ...mapGetters({
      item: "transactions/item",
      load: "transactions/load",
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
  },

  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$store.dispatch("transactions/get", this.id);
    },
    getCustomStatus(status) {
      if (status == -2 || status == "Not Verified") {
        return {
          color: "warning",
          name: "Not Verified",
        };
      } else if (status == -1 || status == "Incomplete") {
        return {
          color: "light-warning",
          name: "Incomplete",
        };
      } else if (status == 0 || status == "New") {
        return {
          color: "light-primary",
          name: "New",
        };
      } else if (status == 1 || status == "Paid") {
        return {
          color: "light-success",
          name: "Paid",
        };
      } else if (status == 2 || status == "Unpaid") {
        return {
          color: "danger",
          name: "Unpaid",
        };
      } else if (status == 3 || status == "Expired") {
        return {
          color: "primary",
          name: "Expired",
        };
      }
    },
  },
};
</script>

<style scoped></style>
