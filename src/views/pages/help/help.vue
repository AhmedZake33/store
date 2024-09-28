<template>
    <DataTable :title="title" :total="total" :allowSearch="true" :filter="filter" :loading="load" @Refresh="refresh"
               @reset="filter = { export: 0 , order_direction: true }">
        <template #customTable>
            <b-table           @sort-changed="sortingChanged"
          no-local-sorting class="position-relative"
                     :items="tempData" responsive :fields="fields" primary-key="id" show-empty
                     :empty-text="$t('Global.empty_text')">
               
                 <template #cell(name)="data">

                    <b-link target="_blank" :href="data.item.link"
                            class="font-weight-bold d-block text-nowrap">
                        {{ data.item ? data.item.name : '_' }}
                    </b-link>
                </template>
                <template #cell(actions)="data" v-if="!is_payment">
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
                        <feather-icon class="text-primary"
                                      v-if="hasPermission('edit_year')"
                                      @click="$router.push({ name: 'year', params: { id: data.item.id }, query: { inline: true } })"
                                      v-b-tooltip.hover="$t('Global.edit')" icon="EditIcon"
                                      style="cursor: pointer"/>
                        <feather-icon v-b-tooltip.hover="$t('Global.delete')"  v-if="hasPermission('delete_year')" icon="Trash2Icon" style="cursor: pointer"
                                      class="text-danger" @click="remove(data.item.id)"/>
                    </div>
                </template>
            </b-table>
        </template>
        <template #action v-if="!is_payment">
            <b-button  v-if="hasPermission('add_year')"
                    @click="$router.push({ name: 'year', query: { inline: true } })" class="btn-icon" v-b-tooltip.hover="$t('Global.add')"
                      variant="primary">
                <feather-icon icon="PlusIcon"/>
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
        BFormDatepicker,
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
    import ValidationErrors from '@/views/components/common/ValidationErrors';
    import {localize, ValidationObserver, ValidationProvider} from "vee-validate";

    export default {
        name: 'years',
        components: {
            DataTable,
            BCard,
            BFormDatepicker,
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
            ValidationProvider,
            ValidationObserver,
            localize,
            ValidationErrors
        },
        directives: {
            'b-modal': VBModal,
            Ripple,
        },
        props: {
            title: String,
            is_payment: {Type: Boolean, default: false},
            reload: null,
        },
        watch: {
            reload() {
                this.refresh();
            }
        },
        data() {
            return {
                filter: {removed: 0, order_direction: true},
                tempData:[{id:1,name:"Edit home page public website",link:'https://drive.google.com/file/d/10rVpPMuIwLGxJ0m7pv0_Pz7EroKSxSAJ/view?usp=sharing',category:'Website'}]
            };
        },
        computed: {
            ...mapGetters({
                items: 'years/items',
                total: 'years/total',
                load: 'years/load',
                needDrop:'app/needDrop',
                lookups: 'years/lookups',
            }),
            fields: function () {
                return [
                    {
                        key: 'name',
                        label: this.$t('Global.name'),
                        sortable: true,
                    },
                    // {
                    //     key: 'link',
                    //     label: this.$t('Global.url'),
                    //     sortable: false,
                    // },
                    {
                        key: 'category',
                        label: this.$t('Global.category'),
                        sortable: false,
                    },
                    {
                        key: 'actions',
                        label: this.$t('actions'),
                        thClass: 'customAction',
                        tdClass: 'customWidth',
                    },
                ];
            },
        },
        methods: {
            refresh(query) {
                query = {...query};

                this.$store.dispatch('years/years', {query: query});
            },
            open(id) {
                window.open(this.$router.resolve({name: 'edit_term', params: {id: id}}).href, '_blank');
            },
            remove(id) {
                this.$swal({
                    title: `${this.$t('Global.deleteTitle')}`,
                    text: `${this.$t('Global.deleteText')}`,
                    icon: 'warning',
                    showCancelButton: true,
                    cancelButtonText: `${this.$t('Global.cancel')}`,
                    confirmButtonText: `${this.$t('Global.deleteBtn')}`,
                    customClass: {
                        confirmButton: 'btn btn-primary',
                        cancelButton: 'btn btn-outline-danger ml-1',
                    },
                    buttonsStyling: false,
                }).then(result => {
                    if (result.value) {
                        this.$store.dispatch('years/remove', id).then(_ => {
                            this.refresh();
                            this.$swal({
                                icon: 'success',
                                timer: 1500,
                                showConfirmButton: false,
                                title: this.$t('Global.deleted'),
                            });
                        });
                    }
                });
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
