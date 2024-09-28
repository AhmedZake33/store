<template>
  <div>
        <b-card-header class="p-0 justify-content-end">
            <b-button 
                v-b-tooltip.hover="$t('Print')" 
                @click="$emit('printData')" 
                variant="primary" 
                class="btn-icon mr-2"
            >
                <feather-icon icon="PrinterIcon" />
            </b-button>
        </b-card-header>
    <b-card class="mb-0 p-0">
        <table class="table table-striped custom_table text_nobreak">
            <tbody style="text-align: initial" v-if="items">
                <tr v-if="items.submitted_at && items.submitted_by">
                    <td v-if="$i18n.locale == 'ar'">
                        <div>
                            {{ 'أرسلت في : ' + items.submitted_at + ', أرسلت بواسطة : ' + items.submitted_by.name_local}}
                        </div>
                    </td>
                    <td v-else>
                        <div>
                            {{ 'Submitted At : ' + items.submitted_at + ', Submitted By : ' + items.submitted_by.name}}
                        </div>
                    </td>
                </tr>
                <tr v-for="item in items.stages" :key="item.id">
                    <td v-if="$i18n.locale == 'ar'">
                        <div>
                            {{ 'مسجل فى : ' + item.submitted_at + ', مسجل من قبل : ' + item.submitted_by.name_local}}
                        </div>
                        <div v-if="item.approved==1">
                            {{ 
                                `
                                ${$t('Global.department_approval')} في : ${item.department_approval_at} , 
                                ${$t('Global.faculty_approval')} في : ${item.faculty_approval_at} , 
                                ${$t('Global.university_approval')} في : ${item.university_approval_at}
                                `  
                            }}
                        </div>
                    </td>
                    <td v-else>
                        <div>
                            {{ item.stage.name + ' At: ' + item.submitted_at + ' , ' + item.stage.name +' By: ' + item.submitted_by.name}}
                        </div>
                        <div  v-if="item.approved==1">
                            {{ `${$t('Global.department_approval')} at : ${item.department_approval_at} , ${$t('Global.faculty_approval')} at : ${item.faculty_approval_at} , ${$t('Global.university_approval')} at : ${item.university_approval_at}`  }}
                        </div>
                    </td>
                </tr>
            </tbody>
            <b-modal id="modal" ref="modal">
                <validation-observer ref="simpleRules">
                    <form ref="form">
                        <b-form-group
                            label-for="department_approval"
                            :label="$t('Global.department_approval')"
                            class="mb-2"
                        >
                            <validation-provider
                                #default="{ errors }"
                                :name="$t('Global.department_approval')"
                                :rules="{
                                    required: true,
                                }"
                            >
                                <b-form-datepicker
                                    :label-no-date-selected="$t('Global.no_selected')"
                                    :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                                    id="department_approval"
                                    v-model="form.department_approval_at"
                                    :state="errors.length > 0 ? false : null"
                                    :placeholder="$t('Global.department_approval')"
                                />
                                <small
                                    class="text-danger"
                                    v-for="(error, index) in errors"
                                    :key="index"
                                >
                                {{
                                    $i18n.locale == "ar"
                                    ? `حقل ${$t("Global.department_approval")} مطلوب`
                                    : error
                                }}
                                </small>
                            </validation-provider>
                        </b-form-group>
                        <b-form-group
                            label-for="faculty_approval"
                            :label="$t('Global.faculty_approval')"
                            class="mb-2"
                        >
                            <validation-provider
                                #default="{ errors }"
                                :name="$t('Global.faculty_approval')"
                                :rules="{
                                    required: true,
                                }"
                            >
                                <b-form-datepicker
                                    :label-no-date-selected="$t('Global.no_selected')"
                                    :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                                    id="faculty_approval"
                                    v-model="form.faculty_approval_at"
                                    :state="errors.length > 0 ? false : null"
                                    :placeholder="$t('Global.faculty_approval')"
                                />
                                <small
                                    class="text-danger"
                                    v-for="(error, index) in errors"
                                    :key="index"
                                >
                                {{
                                    $i18n.locale == "ar"
                                    ? `حقل ${$t("Global.faculty_approval")} مطلوب`
                                    : error
                                }}
                                </small>
                            </validation-provider>
                        </b-form-group>
                        <b-form-group
                            label-for="university_approval"
                            :label="$t('Global.university_approval')"
                            class="mb-2"
                        >
                            <validation-provider
                                #default="{ errors }"
                                :name="$t('Global.university_approval')"
                                :rules="{
                                    required: true,
                                }"
                            >
                                <b-form-datepicker
                                    :label-no-date-selected="$t('Global.no_selected')"
                                    :locale="$i18n.locale == 'ar' ? 'ar' : 'en'"
                                    id="university_approval"
                                    v-model="form.university_approval_at"
                                    :state="errors.length > 0 ? false : null"
                                    :placeholder="$t('Global.university_approval')"
                                />
                                <small
                                    class="text-danger"
                                    v-for="(error, index) in errors"
                                    :key="index"
                                >
                                {{
                                    $i18n.locale == "ar"
                                    ? `حقل ${$t("Global.university_approval")} مطلوب`
                                    : error
                                }}
                                </small>
                            </validation-provider>
                        </b-form-group>
                    </form>
                </validation-observer>
                <template #modal-footer>
                    <div>
                        <b-button type="submit" variant="primary" class="mr-1" @click="approve()">
                            {{ $t('Global.save') }}
                        </b-button>
                        <b-button type="reset" variant="outline-secondary" @click="$refs.modal.hide();">
                            {{ $t('Global.cancel') }}
                        </b-button>
                    </div>
                </template>
            </b-modal>
            <div class="pt-5">
                <b-button
                    v-if="items.canRegister && hasPermission('register_student_thesis')"
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    type="submit"
                    variant="primary"
                    class="mr-1"
                    @click="register()"
                >
                    {{ $t("Global.register") }}
                </b-button>
                <b-button
                    v-if="items.canDiscuss && hasPermission('discuss_student_thesis')"
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    type="submit"
                    variant="primary"
                    class="mr-1"
                    @click="discuss()"
                >
                    {{ $t("Global.discuss") }}
                </b-button>
                <b-button
                    v-if="items.canChange && hasPermission('change_student_thesis')"
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    type="submit"
                    variant="primary"
                    class="mr-1"
                    @click="change()"
                >
                    {{ $t("Global.change") }}
                </b-button>
                <b-button
                    v-if="items.canApprove && hasPermission('approve_student_thesis')"
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    type="submit"
                    variant="success"
                    class="mr-1"
                    @click="approveModal()"
                >
                    {{ $t("Global.approve") }}
                </b-button>
                <b-button
                    v-if="items.canUndo && hasPermission('undo_student_thesis')"
                    v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                    type="reset"
                    variant="warning"
                    @click="undo()"
                >
                    {{ $t("Global.undo") }}
                </b-button>
            </div>
        </table>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import 
{
    BBadge,
    BLink,
    BTab,
    BTabs,
    BModal, 
    VBModal,
    BCard,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BForm,
    BButton,
    BFormTextarea,
    BSpinner,
    BPopover,
    BFormDatepicker,
    BFormCheckbox,
    BCardHeader
} from "bootstrap-vue";
import Edit from "@/views/quality/questionnaires_types/edit.vue";
import Ripple from 'vue-ripple-directive';
import ShowComponent from "@/views/components/info/show";
import {
  extend,
  ValidationProvider,
  ValidationObserver,
  localize,
} from "vee-validate";
import ValidationErrors from "@/views/components/common/ValidationErrors";

export default {
    name:'Show',
    data(){
        return {
            visitedTabs: [],
            tabIndex: 0,
            index: 0,
            form: {
                department_approval_at: null,
                faculty_approval_at: null,
                university_approval_at: null,
            }
        }
    },
    props:{
        items:{
            type: Object
        }
    },
    components:{
        ShowComponent,
        Edit,
        BBadge,
        BLink,
        BTab,
        BTabs,
        BCard,
        BModal, 
        BRow,
        BCol,
        BFormGroup,
        BFormInput,
        BForm,
        BButton,
        BFormTextarea,
        BSpinner,
        BPopover,
        BFormDatepicker,
        BFormCheckbox,
        ValidationProvider,
        ValidationObserver,
        ValidationErrors,
        VBModal,
        BCardHeader
    },
    directives: {
        'b-modal': VBModal,
        Ripple,
    },
    computed:{
        localLang() {
            return this.$i18n.locale;
        },
        id() {
            return this.$route.params.id ? this.$route.params.id : null;
        },
    },
    methods:{
        checkTabVisited(index) {
            return this.visitedTabs.includes(index);
        },
        saveStatus(index) {
            this.resetFilterQueryParams({});
            this.updateFilterQueryParams({
                tabNum: index,
                ...this.getTabFilterData(index),
            });
            this.visitedTabs.push(index);
        },
        register(){
            this.$store.dispatch("theses/register", this.id)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
                this.$emit('refresh');
            })
            .catch((error) => {
              this.$swal({
                icon: "error",
                text: `${error || this.$t("Global.errorMessage")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              const errors = [error.response.data.errors];
              errors.forEach((error, index) => {
                const error_data = Object.values(error)[index][0];
                this.errorsdata = error;
              });
            });
        },
        approveModal(){
            this.$refs.modal.show()
        },
        approve() {
            this.$refs.simpleRules.validate().then((success) => {
                if (success) {
                const payload = { id: this.id, query: this.form };
                this.$store
                    .dispatch("theses/approve", payload)
                    .then((response) => {
                        this.$swal({
                            icon: "success",
                            title: `${this.$t("Global.saved")}`,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        this.$emit("refresh");
                    })
                    .catch((error) => {
                        this.$swal({
                            icon: "error",
                            text: `${this.$t("Global.errorMessage")}`,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        const errors = [error.response.data.errors];
                        errors.forEach((error, index) => {
                            const error_data = Object.values(error)[index][0];
                            this.errorsdata = error;
                        });
                    });
                }
            });
        },
        change(){
            this.$store.dispatch("theses/change", this.id)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
                this.$emit('refresh');
            })
            .catch((error) => {
              this.$swal({
                icon: "error",
                text: `${error || this.$t("Global.errorMessage")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              const errors = [error.response.data.errors];
              errors.forEach((error, index) => {
                const error_data = Object.values(error)[index][0];
                this.errorsdata = error;
              });
            });
        },
        discuss(){
            this.$store.dispatch("theses/discuss", this.id)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
                this.$emit('refresh');
            })
            .catch((error) => {
              this.$swal({
                icon: "error",
                text: `${error || this.$t("Global.errorMessage")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              const errors = [error.response.data.errors];
              errors.forEach((error, index) => {
                const error_data = Object.values(error)[index][0];
                this.errorsdata = error;
              });
            });
        },
        undo(){
            this.$store.dispatch("theses/undo", this.id)
            .then((response) => {
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
                this.$emit('refresh');
            })
            .catch((error) => {
              this.$swal({
                icon: "error",
                text: `${error || this.$t("Global.errorMessage")}`,
                showConfirmButton: false,
                timer: 1500,
              });
              const errors = [error.response.data.errors];
              errors.forEach((error, index) => {
                const error_data = Object.values(error)[index][0];
                this.errorsdata = error;
              });
            });
        }
        // approve(){
        //     this.$store.dispatch("theses/approve", this.id)
        //     .then((response) => {
        //       this.$swal({
        //         icon: "success",
        //         title: `${this.$t("Global.saved")}`,
        //         showConfirmButton: false,
        //         timer: 1500,
        //       });
        //         this.$emit('refresh');
        //     })
        //     .catch((error) => {
        //       this.$swal({
        //         icon: "error",
        //         text: `${error || this.$t("Global.errorMessage")}`,
        //         showConfirmButton: false,
        //         timer: 1500,
        //       });
        //       const errors = [error.response.data.errors];
        //       errors.forEach((error, index) => {
        //         const error_data = Object.values(error)[index][0];
        //         this.errorsdata = error;
        //       });
        //     });
        // },
    },
    mounted() {
    }
}
</script>

<style scoped>
/deep/ label {
    color: #5e5873;
    font-size: inherit !important;
}
</style>