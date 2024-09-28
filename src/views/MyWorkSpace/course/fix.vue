<template>
    <div>
        <add v-if="params.status == 4" :inline="true" :hid_courses="hide_courses" :params="params"
             @hide="params.status = 3"/>
        <edit v-else-if="params.status == 1 || params.status == 2" :inline="true" :params="params"
              @hide="params.status = 3"/>
        <DataTable :paramsLoaded="paramsLoaded" v-else :tabNum="tabNum" :total="total" :allow-search="false"
                   :filter="filter" :loading="load"
                   
                   @Refresh="refresh" @Export="Export">
           
           
            <template #more>
                <b-button to="/settings/courses" class="ml-1" variant="primary"><span class="align-middle">More</span>
                </b-button>
            </template>
            <template #customTable>
                <div class="bg-gray p-0 mb-1"
                     style=" padding-left: 0rem !important; padding-right: 0rem !important">
                    <div class="d-flex justify-content-between" v-if="title">
                        <strong class="font-medium-3">
                            {{title }}
                        </strong>

                        <b-button
                                v-if="$route.name == 'program' && (faculty_id || bylaw_id || program_id) &&
                            hasPermission('add_course') && inline"
                                @click="params = { status: 4, faculty_id: faculty_id, bylaw_id: bylaw_id, program_id:
                            program_id }"
                                v-b-tooltip.hover="$t('Global.add')"
                                variant="primary"
                                class="btn-icon"
                        >
                            <feather-icon icon="PlusIcon"/>
                        </b-button>
                    </div>
                </div>
                <b-table           @sort-changed="sortingChanged"
          no-local-sorting :items="items"
                         responsive striped :fields="fieldsData" primary-key="id" show-empty
                         :empty-text="$t('Global.empty_text')">
                       <template #cell(name)="data">
                        <!-- <b-link v-if="$i18n.locale == 'en'" :to="{ name: 'course', params: { id: data.item.id } }"
                                class="font-weight-bold"> -->
                            <span v-if="$i18n.locale == 'en'">
                                {{ data.item ? (data.item.name ? data.item.name : data.item.name_local) : '_' }}
                            </span>
                        <!-- </b-link> -->
                        <!-- <b-link v-if="$i18n.locale == 'ar'" :to="{ name: 'course', params: { id: data.item.id } }"> -->
                           <span v-else>
                            {{ data.item ? (data.item.name_local ? shortMyText(data.item.name_local) : data.item.name) :
                            '_' }}
                           </span>
                            
                        <!-- </b-link> -->
                    </template>
                    <template #cell(bylaw_id)="data">
                        <template v-if="faculty_id">
                            <!-- <b-link :to="{ name: 'bylaw', params: { id: data.item.bylaw && data.item.bylaw.id ? data.item.bylaw.id : null } }"
                                    class="font-weight-bold"> -->
                                {{ data.item ? data.item.bylaw.code : '-' }}
                            <!-- </b-link> -->
                        </template>
                        <template v-if="!faculty_id">
                            <!-- <b-link v-if="$i18n.locale == 'en'"
                                    :to="{ name: 'bylaw', params: { id: data.item.bylaw && data.item.bylaw.id ? data.item.bylaw.id : null } }"
                                    class="font-weight-bold"> -->
                            <span v-if="$i18n.locale == 'en'">    
                                {{ data.item ? (data.item && data.item.bylaw ? data.item.bylaw.name : '-' ?
                                shortMyText(data.item && data.item.bylaw ? data.item.bylaw.name : '-') : data.item &&
                                data.item.bylaw ? data.item.bylaw.name_local : '-') : '_' }}
                            </span>
                            <!-- </b-link> -->
                            <!-- <b-link v-if="$i18n.locale == 'ar'"
                                    :to="{ name: 'bylaw', params: { id: data.item.bylaw && data.item.bylaw.id ? data.item.bylaw.id : null } }"> -->
                            <span v-else>   
                                {{ data.item ? (data.item && data.item.bylaw ? data.item.bylaw.name_local : '-' ?
                                shortMyText(data.item && data.item.bylaw ? data.item.bylaw.name_local : '-') : data.item
                                && data.item.bylaw ? data.item.bylaw.name_local : '-') : '_' }}
                            </span>
                            <!-- </b-link> -->
                        </template>
                    </template>
                    <template #cell(control_status)="data">
                        <b-badge pill :variant="`light-${getStatus(data.item.removed).color}`" class="text-capitalize">
                            {{ getStatus(data.item.removed).name }}
                        </b-badge>
                    </template>
                    <template #cell(faculty)="data">
                        <div v-if="data.item.bylaw && data.item.bylaw.faculty">
                            <!-- <b-link v-if="$i18n.locale == 'en'"
                                    :to="{ name: 'faculty', params: { id: data.item.bylaw.faculty.id } }"
                                    class="font-weight-bold"> -->
                            <span v-if="$i18n.locale == 'en'">
                                {{ data.item.bylaw.faculty.name }}</span>
                            <!-- </b-link> -->
                            <!-- <b-link v-if="$i18n.locale == 'ar'"
                                    :to="{ name: 'faculty', params: { id: data.item.bylaw.faculty.id } }"> -->
                            <span v-else>
                                {{ data.item.bylaw.faculty.name_local }}</span>
                            <!-- </b-link> -->
                        </div>
                    </template>
                    
                    <template #cell(department_id)="data">
                        <div v-if="data.item.department">
                            <!-- <b-link v-if="$i18n.locale == 'en'"
                                    :to="{ name: 'department', params: { id: data.item.department.id } }"
                                    class="font-weight-bold"> -->
                            <span v-if="$i18n.locale == 'en'">
                                {{ data.item.department.name }}</span>
                            <!-- </b-link>
                            <b-link v-if="$i18n.locale == 'ar'"
                                    :to="{ name: 'department', params: { id: data.item.department.id } }"> -->
                            <span v-else>
                                {{ data.item.department.name_local }}</span>
                            <!-- </b-link> -->
                        </div>
                    </template>
                    <template #cell(stage)="data">
                        <div v-if="data.item.bylaw && data.item.bylaw.stage">
              <span v-if="$i18n.locale == 'en'">
                {{ data.item.bylaw.stage.name }}
              </span>
                            <span v-else>
                {{ data.item.bylaw.stage.name_local }}
              </span>
                        </div>
                    </template>
                   
                    <template #cell(course_level)="data">
                        <div class="edit_hover">
              <span v-if="data.item.level">
                <!--                            {{ $i18n.locale == 'ar' ? data.item.level.level.name_local : data.item.level.level.name }},-->
                <div>
                  {{ data.item.level.semester }}
                </div>
              </span>
                        </div>
                    </template>

                  
                </b-table>
            </template>
        </DataTable>
        <b-modal no-close-on-backdrop ref="my-modal" v-model="levelModal" hide-footer :title="$t('Global.semester')">
            <div :class="loading ? 'disabled_all' : ''" class="demo-vertical-spacing">
                <validation-observer ref="simpleForm">
                    <b-form>
                        <!-- <b-col cols="12" md="12">
                                                                                       <b-form-group :label="$t('Global.level')" label-for="level">
                                                                                           <validation-provider #default="{ errors }" name="level" :rules="'required'">
                                                                                               <v-select v-model="form.level_id"
                                                                                                         :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                                                                                         :options="options.levels" class="w-100 mb-2" :reduce="val => val.id">
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
                                                                                               <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                                                                                    }}</small>
                                                                                            </validation-provider>
                                                                                        </b-form-group>
                                                                                    </b-col> -->
                        <b-col cols="12" md="12">
                            <b-form-group :label="$t('Global.semester')" label-for="semester">
                                <validation-provider #default="{ errors }" name="semester" :rules="'required'">
                                    <v-select v-model="form.semester"
                                              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                                              :options="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" class="w-100 mb-2"
                                              :reduce="val => val"
                                    >\
                                        <template #no-options>
                                            {{ $t('noMatching') }}
                                        </template>
                                    </v-select>
                                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message
                                        }}</small>
                                </validation-provider>
                            </b-form-group>
                        </b-col>
                    </b-form>
                </validation-observer>
            </div>
            <div class="mt-2" :class="loading ? 'disabled_all' : ''">
                <b-col cols="12" md="12">
                    <div class="d-flex justify-content-end">
                        <b-button type="submit" variant="primary" class="mr-1" @click="submit()">
                            {{ $t('Global.save') }}
                        </b-button>
                        <b-button type="reset" variant="outline-primary" @click="levelModal = false">
                            {{ $t('Global.cancel') }}
                        </b-button>
                    </div>
                </b-col>
            </div>
        </b-modal>
    </div>
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
        BPopover,
        BFormGroup,
        BTr,
        BTh
    } from 'bootstrap-vue';
    import {mapGetters, mapActions} from 'vuex';
    import Ripple from 'vue-ripple-directive';
    import vSelect from 'vue-select';
    import DataTable from '@/views/components/table/DataTable';
    import Edit from '@/views/academic_settings/courses/edit';
    import Add from '@/views/academic_settings/programs/add_courses';
    import TableFilters from '@/views/components/common/TableFilters';
    import {ValidationProvider, ValidationObserver, localize} from 'vee-validate';
    import {required, email} from '@validations';
    import {EventBus} from '../../../main';

    export default {
        name: 'Courses',
        components: {
            Add,
            TableFilters,
            DataTable,
            BCard,
            vSelect,
            BTr,
            BTh,
            BRow,
            BCol,
            Edit,
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
            BFormGroup,
        },
        directives: {
            'b-modal': VBModal,
            Ripple,
        },
        props: {
            title: String,
            excel_name: null,
            hide_courses: [],
            bylaw_id: Number,
            program_id: Number,
            faculty_id: Number,
            department_id: Number,
            faculty_dep_id: Number,
            faculty_id_course: Number,
            noStatus: Boolean,
            inline: false,
            tabNum: Number,
            plus: Boolean,
            course_type:Number,
            course_stage:Number,
        },
        data() {
            return {
                levelModal: false,
                paramsLoaded: true,
                filter: {
                    term_id:null
                },
                params: {},
                id: null,
                form: {
                    level_id: null,
                    semester: null,
                },
            };
        },
        computed: {
            fieldsData() {
                let fields = [
                    {
                        key: 'id',
                        label: this.$t('Global.id'),
                        sortable: true,
                    },
                    {
                        key: 'course',
                        label: this.$t('Global.course'),
                        sortable: false,
                    },
                    {
                        key: 'instructors',
                        label: this.$t('Global.instructors'),
                         sortable: false,
                    },
                    {
                        key: 'term',
                        label: this.$t('Global.term'),
                        sortable: true,
                    },
                    {
                        key: 'students',
                        label:  this.$t('Global.students'),
                        sortable: true,
                    },
                    {
                        key: 'control_status',
                        label: this.$t('Global.control_status'),
                        sortable: true,
                    },
                    {
                        key: 'exam',
                        label: this.$t('Global.exam'),
                        sortable: false,
                        thStyle: {width: '19%'},
                    },
                    {
                        key: 'actions',
                        label: this.$t('Global.actions'),
                         sortable: false,
                    },
                   
                
                ];
                if (this.noStatus) {
                    fields = fields.filter(obj => !['status', 'credit_hours'].includes(obj.key));
                }
                if (this.faculty_id && !this.bylaw_id) {
                    fields = fields.filter(obj => !['faculty', 'actions'].includes(obj.key));
                }
                if (this.bylaw_id) {
                    fields = fields.filter(obj => !['bylaw', 'level', 'faculty', 'stage'].includes(obj.key));
                }
                if (this.program_id) {
                    return [
                        {
                            key: 'code',
                            label: this.$t('Global.code'),
                            sortable: true,
                        },
                        {
                            key: 'name',
                            label: this.$t('Global.name'),
                            sortable: true,
                        },
                        // {
                        //     key: 'faculty',
                        //     label: this.$t('Global.faculty'),
                        //     sortable: true,
                        // },
                        {key: 'course_level', label: this.$t('Global.semester'), sortable: true},
                        
                        {
                            key: 'department_id',
                            label: this.$t('Global.department'),
                            sortable: true,
                        },
                        {
                            key: 'status',
                            label: this.$t('Global.status'),
                        },
                        {
                            key: 'actions',
                            label: this.$t('Global.actions'),
                            thClass: 'customAction',
                            tdClass: 'customWidth',
                        },
                    ];
                }
                if (this.department_id) {
                    fields = fields.filter(obj => !['department', 'faculty', 'actions'].includes(obj.key));
                }
                return fields;
            },
            offered_list() {
                return [
                    {id: 2, label: this.$t('Global.not_offered')},
                    {id: 1, label: this.$t('Global.offered_now')},
                ];
            },
            ...mapGetters({
                items: 'courses/items',
                total: 'courses/total',
                load: 'courses/load',
                needDrop:'app/needDrop',
                loading: 'app/load',
                lookups: 'courses/lookups',
                options: 'students/lookups',
            }),
        },
        methods: {
            ...mapActions({
                exportExcel: 'courses/export',
                lookupsApi: 'students/lookup',
                saveData: 'programs/sync',
                update: 'programs/update',
            }),
            changeParams() {
                EventBus.$emit('changeIt', this.params);
            },
            openDialog(data) {
                this.form.level_id = data?.level?.id;
                this.id = data.id;
                this.form.semester = data?.semester;
                this.levelModal = true;
            },
            submit() {
                this.$refs.simpleForm.validate().then(success => {
                    if (success) {
                        const payload = {
                            id: this.id,
                            query: this.form,
                        };
                        this.update(payload)
                            .then(response => {
                                this.$swal({
                                    icon: 'success',
                                    title: `${this.$t('Global.saved')}`,
                                    showConfirmButton: false,
                                    timer: 1500,
                                });
                                this.levelModal = false;
                                this.refresh();
                            })
                            .catch(error => {
                            });
                    }
                });
            },
            refresh(query) {
                if (this.bylaw_id) {
                    query = {...query, bylaw_id: this.bylaw_id};
                    // this.filter = {...this.filter, bylaw_id: this.bylaw_id};
                }
                if (this.program_id) {
                    query = {...query, program_id: this.program_id};
                    // this.filter = {...this.filter, bylaw_id:  this.program_id};
                }
                if (this.faculty_id) {
                    query = {...query, faculty_id: this.faculty_id};
                    // this.filter.faculty_id =  this.faculty_id;
                }
                if (this.department_id) {
                    query = {...query, department_id: this.department_id};
                    // this.filter = {...this.filter, department_id:  this.department_id};
                }

                this.$store.dispatch('courses/coursesWorkspace', {query}).then(_ => {
                    this.paramsLoaded = false;
                });
            },
            open(id) {
                window.open(this.$router.resolve({name: 'course_edit', params: {id}}).href);
            },
            remove(id) {
                let passFilter = {};
                if (this.$route.query.page || this.$route.query.perPage) {
                    passFilter = {
                        ...this.filter,
                        limit: this.$route.query.perPage || 10,
                        offset: (Number(this.$route.query.page) - 1) * (Number(this.$route.query.perPage) || 10),
                    };
                } else {
                    passFilter = this.filter;
                }
                // return
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
                        this.$store.dispatch('courses/remove', id).then(_ => {
                            this.refresh(passFilter);
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
            trash(id) {
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
                        this.$store.dispatch('programs/delete', id).then(_ => {
                            this.refresh(this.filter);
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
            Export(query) {
                query = {...query, language: this.$i18n.locale, excel_name: this.excel_name};
                if (this.bylaw_id) {
                    query = {...query, bylaw_id: this.bylaw_id};
                }
                if (this.program_id) {
                    query = {...query, program_id: this.program_id};
                }
                if (this.faculty_id) {
                    query = {...query, faculty_id: this.faculty_id};
                }
                if (this.department_id) {
                    query = {...query, department_id: this.department_id};
                }
                this.exportExcel(query);
                this.filter.export = 0;
            },
        },
        watch: {
            faculty_id: function () {
                let lookupQuery = {levels: true, bylaw_stages: true, programs: true, faculty_departments: true};
                if (this.program_id && this.faculty_id) {
                    lookupQuery = {
                        ...lookupQuery,
                        faculty_id: Number(this.faculty_id),
                        program_id: Number(this.program_id),
                    };
                    this.lookupsApi(lookupQuery);
                }
            },
        },
        mounted() {
            let lookupQuery = {levels: true, bylaw_stages: true, programs: true, faculty_departments: true};
            if (this.faculty_id) {
                lookupQuery = {...lookupQuery, faculty_id: Number(this.faculty_id)};
            }
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

    .edit_hover {
        position: relative;

        .icon_hover {
            position: absolute;
            top: -7px;
            right: 0;
            display: none;
        }
    }

    .edit_hover:hover {
        .icon_hover {
            display: block;
        }
    }
</style>
