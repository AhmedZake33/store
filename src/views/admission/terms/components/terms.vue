<template>
    <DataTable :title="title" :total="total" :allowSearch="true" @reset="filter = {export:0}" :filter="filter" :loading="load" @Refresh="refresh">
        <template #filter v-if="lookups">

            <b-col cols="12" md="6">
                <v-select
                        v-model="filter.type_id"
                        :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                        :options="lookups.admission_types"
                        class="w-100 mb-2"
                        :reduce="val => val.id"
                        :placeholder="$t('Global.type')"
                >
                    <template slot="selected-option" slot-scope="option">
                              <span v-if="$i18n.locale == 'ar'">
                                {{ option.name_local || option.name }}
                              </span>
                        <span v-else>
                                {{ option.name || option.name_local }}
                              </span>
                    </template>
                    <template v-slot:option="option">
                        {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                    </template>
                    <template #no-options>
                        {{ $t('noMatching') }}
                    </template>
                </v-select>
            </b-col>
            <b-col cols="12" md="6">
                <v-select :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" v-model="filter.removed"
                          :options="getStatusList(true)" class="w-100" :reduce="val => val.value"
                          :placeholder="$t('Global.status')">
                    <template slot="selected-option" slot-scope="option">
                            <span>
                                {{ $t(`Global.${option.label}`) }}
                              </span>
                    </template>
                    <template v-slot:option="option">
                        {{ $t(`Global.${option.label}`) }}
                    </template>
                </v-select>
            </b-col>
        </template>
        <template #customTable>
            <b-table           @sort-changed="sortingChanged"
          no-local-sorting class="position-relative" :items="items" responsive
                     :fields="fields" primary-key="id" show-empty :empty-text="$t('Global.empty_text')">
                <template #cell(name)="data">
                    <b-link v-if="$i18n.locale == 'en'" 
                            :to="{ name: 'admission_term', params: { id: data.item.id } }"
                            class="font-weight-bold d-block text-nowrap">
                        {{ data.item ? data.item.name : '_' }}
                    </b-link>
                    <b-link :to="{ name: 'admission_term', params: { id: data.item.id } }" v-if="$i18n.locale == 'ar'"
                            >
                        {{ data.item ? data.item.name_local : '_' }}
                    </b-link>
                </template>
                <template #cell(start_date)="data">
                    <div>
                        {{toLocalDatetime(data.item.start_date, $i18n.locale)}}
                    </div>
                </template>
                <template #cell(end_date)="data">
                    <div>
                        {{toLocalDatetime(data.item.end_date, $i18n.locale)}}
                    </div>
                </template>
                <template #cell(type)="data">
                    <b-badge pill :variant="`primary`" class="text-capitalize">
                        {{data.item.type ? data.item.type.name : ''}}
                    </b-badge>
                </template>
                <template #cell(status)="data">
                    <b-badge pill :variant="`light-${getStatus(data.item.removed).color}`" class="text-capitalize">
                        {{ getStatus(data.item.removed).name }}
                    </b-badge>
                </template>
                <template #cell(actions)="data">
                    <div>
                        <b-dropdown
                v-if="needDrop"
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="flat-primary"
                class="dropdown-icon-wrapper custom_action_drop"
              >
                <template #button-content>
                  <feather-icon
                    icon="MoreVerticalIcon"
                    size="16"
                    class="align-middle"
                  />
                </template>
              </b-dropdown>
                        <feather-icon v-b-tooltip.hover="$t('Global.edit')" icon="EditIcon" style="cursor: pointer" @click="open(data.item.id)" />
                        <feather-icon  v-b-tooltip.hover="$t('Global.delete')" icon="Trash2Icon" style="cursor: pointer" class="text-danger" @click="remove(data.item.id)"/>
                    </div>
                </template>
            </b-table>
        </template>
        <template #action>
                            <!-- <b-button
                        v-b-tooltip.hover="$t('Global.export_excel')"
                        class="btn-icon"
                        variant="primary"
                        @click="filter.export = 1"
                >
                    <feather-icon icon="FileTextIcon"/>
                </b-button> -->
            <b-button
                    :to="{ name: 'edit_admission_term'}"
                    class="btn-icon"
                    v-b-tooltip.hover="$t('Global.add')"
                    variant="primary"
                    v-if="hasPermission('add_term')"
            >
                <feather-icon
                        icon="PlusIcon"
                />
            </b-button>
        </template>
    </DataTable>
</template>

<script>
    import {
        BCard,
        BRow,
        BCol,
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
        BOverlay,
        BCardHeader,
        BCardBody,
        BModal,
        VBModal,
        BPopover
    } from 'bootstrap-vue';
    import DataTable from '@/views/components/table/DataTable';
    import {mapGetters} from 'vuex';
    import Ripple from 'vue-ripple-directive';
    import vSelect from 'vue-select';

    export default {
        name: 'terms',
        components: {
            DataTable,
            BCard,
            vSelect,
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
            BModal,
            VBModal,
            BPopover,
        },
        directives: {
            'b-modal': VBModal,
            Ripple,
        },
        props: {
            title: String,
            bylaw_id: null,
            course_id: null,
        },
        data() {
            return {
                filter: {removed: 0},
            };
        },
        computed: {
            ...mapGetters({
                items: 'terms/items',
                total: 'terms/total',
                load: 'terms/load',
                lookups: 'terms/lookups',
                needDrop:'app/needDrop',
            }),
            fields: function () {
                return [
                    {
                        key: 'code',
                        label: this.$t('Global.code'),
                    },
                    {
                        key: 'name',
                        label: this.$t('Global.name'),
                        sortable: true,
                    },
                     {
                        key: 'year',
                        label: this.$t('Global.year'),
                        sortable: true,
                    },
                    // {
                    //     key: 'type',
                    //     label: this.$t('Global.type'),
                    //     sortable: true,
                    // },
                    {
                        key: 'start_date',
                        label: this.$t('Global.start_date'),
                        sortable: true,
                    },
                    {
                        key: 'end_date',
                        label: this.$t('Global.end_date'),
                        sortable: true,
                    },
                   
                    {
                        label: this.$t('Global.actions'),
                        key:'actions',
                        thClass: 'customAction',
                        tdClass: 'customWidth',
                    },
                ];
            }
        },
        methods: {
            refresh(query) {
                query = {...query, type:[6,5]};
                this.$store.dispatch('terms/terms', {query: query});
            },
            open(id) {
                window.open(this.$router.resolve({ name: 'edit_admission_term', params: { id: id } }).href, '_blank');
            },
            remove(id) {
                this.$swal({
                    title: `${this.$t('Global.deleteTitle')}`,
                    text: `${this.$t('Global.deleteText')}`,
                    icon: 'warning',
                    showCancelButton: true,
cancelButtonText:`${this.$t('Global.cancel')}`,
                    confirmButtonText: `${this.$t('Global.deleteBtn')}`,
                    customClass: {
                        confirmButton: 'btn btn-primary',
                        cancelButton: 'btn btn-outline-danger ml-1',
                    },
                    buttonsStyling: false,
                }).then(result => {
                    if (result.value) {
                        this.$store.dispatch('terms/remove', id).then(_ => {
                            this.refresh()
                            this.$swal({
                                icon: 'success',
                                timer: 1500,
                                showConfirmButton: false,
                                title: this.$t('Global.deleted'),
                            })
                        })
                    }
                })
            },
        },
    };
</script>

<style lang="scss" scoped>
    .per-page-selector {
        width: 90px;
    }
</style>

<style lang="scss">
    @import '@core/scss/vue/libs/vue-select.scss';
</style>
