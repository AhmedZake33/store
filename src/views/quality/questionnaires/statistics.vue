<template>
  <div>
    <!-- <b-card class="mb-2 pt-1" v-if="lookups && lookups.length != 0">
        <b-row>
            <b-col cols="12" md="3" v-if="lookups.departments">
                <v-select
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    v-model="filter.department_id"
                    :options="lookups.departments"
                    :label="'name'.replaceAll('_', ' ')"
                    class="w-100 mb-1"
                    :reduce="(val) => val.id"
                    :placeholder="$t('Global.departments')"
                >
                <template v-slot:option="option">
                    {{
                    $i18n.locale == "ar"
                        ? option.name_local.replaceAll("_", " ")
                        : option.name.replaceAll("_", " ")
                    }}
                </template>
                <template #selected-option="{ name, name_local }">
                    <div style="display: flex; align-items: baseline">
                    <strong v-if="$i18n.locale == 'ar'"
                        >{{ name_local.replaceAll("_", " ") }}
                    </strong>
                    <strong v-else>{{ name.replaceAll("_", " ") }}</strong>
                    </div>
                </template>
                <template #no-options>
                    {{ $t('noMatching') }}
                </template>
                </v-select>
            </b-col>
            <b-col cols="12" md="3" v-if="lookups.faculties">
                <v-select
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    v-model="filter.faculty_id"
                    :options="lookups.faculties"
                    :label="'name'.replaceAll('_', ' ')"
                    class="w-100 mb-1"
                    :reduce="(val) => val.id"
                    :placeholder="$t('faculties')"
                >
                <template v-slot:option="option">
                    {{
                    $i18n.locale == "ar"
                        ? option.name_local.replaceAll("_", " ")
                        : option.name.replaceAll("_", " ")
                    }}
                </template>
                <template #selected-option="{ name, name_local }">
                    <div style="display: flex; align-items: baseline">
                    <strong v-if="$i18n.locale == 'ar'"
                        >{{ name_local.replaceAll("_", " ") }}
                    </strong>
                    <strong v-else>{{ name.replaceAll("_", " ") }}</strong>
                    </div>
                </template>
                <template #no-options>
                    {{ $t('noMatching') }}
                </template>
                </v-select>
            </b-col>
            <b-col cols="12" md="3" v-if="lookups.bylaws">
                <v-select
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    v-model="filter.bylaw_id"
                    :options="lookups.bylaws"
                    :disabled="filter.faculty_id == null"
                    :label="'name'.replaceAll('_', ' ')"
                    class="w-100 mb-1"
                    :reduce="(val) => val.id"
                    :placeholder="$t('Global.bylaws')"
                >
                <template v-slot:option="option">
                    {{
                    $i18n.locale == "ar"
                        ? option.name_local.replaceAll("_", " ")
                        : option.name.replaceAll("_", " ")
                    }}
                </template>
                <template #selected-option="{ name, name_local }">
                    <div style="display: flex; align-items: baseline">
                    <strong v-if="$i18n.locale == 'ar'"
                        >{{ name_local.replaceAll("_", " ") }}
                    </strong>
                    <strong v-else>{{ name.replaceAll("_", " ") }}</strong>
                    </div>
                </template>
                <template #no-options>
                    {{ $t('noMatching') }}
                </template>
                </v-select>
            </b-col>
            <b-col cols="12" md="3" v-if="lookups.programs">
                <v-select
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                    v-model="filter.program_id"
                    :options="lookups.programs"
                    :disabled="filter.bylaw_id == null"
                    :label="'name'.replaceAll('_', ' ')"
                    class="w-100 mb-1"
                    :reduce="(val) => val.id"
                    :placeholder="$t('Global.programs')"
                >
                <template v-slot:option="option">
                    {{
                    $i18n.locale == "ar"
                        ? option.name_local
                        : option.name
                    }}
                </template>
                <template #selected-option="{ name, name_local }">
                    <div style="display: flex; align-items: baseline">
                    <strong v-if="$i18n.locale == 'ar'"
                        >{{ name_local }}
                    </strong>
                    <strong v-else>{{ name }}</strong>
                    </div>
                </template>
                <template #no-options>
                    {{ $t('noMatching') }}
                </template>
                </v-select>
            </b-col>
        </b-row>
    </b-card> -->
    <b-row>
        <b-col cols="12" md="8">
            <b-card class="mb-2 pb-0">
                <div>
                    <ShowComponent 
                        :loading="load"
                        :data="item" 
                        :only="[
                                'questionnaire_type',
                                'destination',
                                'starts_at',
                                'ends_at',
                                'type',
                                'anonymous_url'
                            ]" 
                        >
                        <template #questionnaire_type="{ data }">
                            <th scope="row" :width="'20%'">
                                {{ $t(`Global.questionnaire_type`) }}
                            </th>
                            <td>
                                {{ $i18n.locale == 'ar' ? data.questionnaire_type.name_local : data.questionnaire_type.name }}
                            </td>
                        </template>
                        <template #destination="{ data }">
                            <th scope="row" :width="'20%'">
                                {{ $t(`Global.destination`) }}
                            </th>
                            <td>
                                <div class="d-flex" v-if="data.destination">
                                    <span 
                                        v-for="item in data.destination"
                                        :key="item.id"
                                    >
                                        {{ $i18n.locale == 'ar' ? item.name_local : item.name }}, &nbsp;
                                    </span>
                                </div>
                            </td>
                        </template>
                        <template #starts_at="{ data }">
                            <th scope="row" :width="'20%'">
                                {{ $t(`Global.start_date`) }}
                            </th>
                            <td>
                                {{ data.starts_at }}
                            </td>
                        </template>
                        <template #ends_at="{ data }">
                            <th scope="row" :width="'20%'">
                                {{ $t(`Global.end_date`) }}
                            </th>
                            <td>
                                {{ data.ends_at }}
                            </td>
                        </template>
                        <template #type="{ data }">
                            <th scope="row" :width="'20%'">
                                {{ $t(`Global.type`) }}
                            </th>
                            <td>
                                {{ $i18n.locale == 'ar' ? data.type.name_local : data.type.name }}
                            </td>
                        </template>
                        <template #anonymous_url="{ data }">
                            <th scope="row" :width="'20%'">
                                {{ $t(`Global.url`) }}
                            </th>
                            <td>
                                <a v-if="data.anonymous_url" class="btn btn-primary" :href="data.anonymous_url" target="_blank">
                                    {{ $i18n.locale == 'ar' ? 'الذهاب للإستبيان' : 'Open Questionaire' }}    
                                </a>
                                <p v-else>_</p>
                            </td>
                        </template>
                        <template #comments_count="{ data }">
                            <th scope="row" :width="'20%'">
                                {{ $t(`Global.comments_count`) }}
                            </th>
                            <td>
                                {{ $i18n.locale == 'ar' ? data.comments_count : data.comments_count }}
                            </td>
                        </template>
                    </ShowComponent>
                </div>
            </b-card>
        </b-col>
        <b-col cols="12" md="4">
            <b-card class="mb-2">
                <b-row class="match-height">
                    <b-col>
                        <ecommerce-goal-overview :data="{ series: [item.score ? item.score : 0 ] , participants: item.count }" />
                    </b-col>
                </b-row>
            </b-card>
        </b-col>
    </b-row>
    <b-row>
        <b-col>
            <b-card class="mb-0">
                <b-tabs
                    v-model="tabIndex"
                    @input="saveStatus"
                    vertical
                    nav-wrapper-class="nav-hidden"
                    align="left"
                >
                    <b-tab>
                        <template #title>
                            <feather-icon icon="BookOpenIcon" />
                            <span>{{ $t("Global.evaluation_questions") }}</span>
                        </template>
                        <div>
                            <ShowComponent 
                                :loading="load"
                                :data="item" 
                                :only="[
                                        'id',
                                        'answers_evaluation'
                                    ]" 
                                >

                                <template #id="{ data }">
                                    
                                </template>
                                <template #answers_evaluation="{ data }">
                                    <table v-if="data.answers_evaluation.length > 0" style="width: 100% !important">
                                        <tbody>
                                            <tr>
                                                <th>
                                                    {{ $t("Global.question") }}
                                                </th>
                                                <th v-if="hasPermission('show_Aanonymous_questionnaireStats')">
                                                    {{$t("Global.user_score")}}
                                                </th>
                                                <th>
                                                    {{$t("Global.score")}}
                                                </th>
                                            </tr>
                                            <tr v-for="(answer, index) in evaluationAnswers" :key="answer.id">
                                                <td>
                                                    {{ $i18n.locale == 'ar' ? answer.question_local : answer.question }}
                                                </td>
                                                <td style="width: 40%" v-if="hasPermission('show_Aanonymous_questionnaireStats')">
                                                    <tr v-for="user in answer.user_answers" :key="user.id">
                                                        <b-link
                                                            class="font-weight-bold custom_link d-block text-primary cursor-pointer"
                                                            :to="{
                                                                name: 'student-show',
                                                                params: { id: user.user.id },
                                                            }"
                                                        >
                                                            {{ $i18n.locale == 'ar' ? `- ${user.user.name_local} (${user.score})` : `- ${user.user.name} (${user.score})`}}
                                                        </b-link>
                                                    </tr>
                                                </td>
                                                <td width="10%">
                                                    <span v-if="data.answers_evaluation[index] && data.answers_evaluation[index].average_score">
                                                        {{ $i18n.locale == 'ar' ? data.answers_evaluation[index].average_score : data.answers_evaluation[index].average_score }}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </template>
                            </ShowComponent>
                        </div>
                    </b-tab>
                    <b-tab>
                        <template #title>
                            <feather-icon icon="BookOpenIcon" />
                            <span>{{ $t("Global.yes_no_questions") }}</span>
                        </template>
                        <div>
                            <ShowComponent 
                                :loading="load"
                                :data="item" 
                                :only="[
                                        'id',
                                        'answers_yes_no'
                                    ]" 
                                >
                                <template #id="{ data }">
                                    
                                </template>
                                <template #answers_yes_no="{ data }">
                                    <table v-if="data.answers_yes_no.length > 0" style="width: 100% !important">
                                        <tbody>
                                            <tr>
                                                <th>
                                                    {{ $t("Global.question") }}
                                                </th>
                                                <th v-if="hasPermission('show_Aanonymous_questionnaireStats')">
                                                    {{$t("Global.user_answer")}}
                                                </th>
                                                <th :width="'20%'">
                                                    {{$i18n.locale == 'ar' ? 'عدد اجوبة نعم/لا' : 'Yes/No count'}}
                                                </th>
                                            </tr>
                                                <!-- {{yesOrNoAnswers}} -->
                                            <tr v-for="(answer, index) in yesOrNoAnswers" :key="answer.id">
                                                <td>
                                                    {{ $i18n.locale == 'ar' ? answer.question_local : answer.question }}
                                                </td>
                                                <td style="width: 25%" v-if="hasPermission('show_Aanonymous_questionnaireStats')">
                                                    <tr v-for="user in answer.user_answers" :key="user.id">
                                                        {{ $i18n.locale == 'ar' ? `${user.user.name_local} (${user.answer == 1 ? 'نعم' : 'لا'})` : `${user.user.name} (${user.answer == 1 ? 'Yes' : 'No'})`}}
                                                    </tr>
                                                </td>
                                                <td width="10%">
                                                    {{ $i18n.locale == 'ar' ? data.answers_yes_no[index].yes_count : data.answers_yes_no[index].yes_count }} / {{ $i18n.locale == 'ar' ? data.answers_yes_no[index].no_count : data.answers_yes_no[index].no_count }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </template>
                            </ShowComponent>
                        </div>
                    </b-tab>
                    <b-tab>
                        <template #title>
                            <feather-icon icon="BookOpenIcon" />
                            <span>{{ $t("Global.text_questions") }}</span>
                        </template>
                        <div>
                            <div>
                                <div v-if="item.answers_text.length > 0">
                                    <div v-for="answer in textAnswers" :key="answer.id">
                                        <div class="striped-custom">
                                            {{ $i18n.locale == 'ar' ? answer.question_local : answer.question }}
                                        </div>
                                        <div>
                                            <ol>
                                                <li v-for="(comment,index) in answer.comments" :key="index" class="py-1 li-custom">
                                                    <span v-if="hasPermission('show_Aanonymous_questionnaireStats')">
                                                        {{ $i18n.locale == 'ar' ? `${comment.user.name_local}: ${comment.comment}`  : `${comment.user.name}: ${comment.comment}` }}
                                                    </span>
                                                    <span v-else>
                                                        {{ $i18n.locale == 'ar' ? `${comment.comment}`  : `${comment.comment}` }}
                                                    </span>
                                                </li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </b-tab>
                </b-tabs>
            </b-card>
        </b-col>
    </b-row>
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
    BRow,
    BCol,
    BCard
} from "bootstrap-vue";
import ShowComponent from "@/views/components/info/show";
import EcommerceGoalOverview from './components/EcommerceGoalOverview.vue'
import vSelect from 'vue-select';

export default {
    name:'Show',
    data(){
        return {
            visitedTabs: [],
            tabIndex: 0,
            index: 0,
            evaluationAnswers: [],
            yesOrNoAnswers:[],
            textAnswers:[],
            filter:{
                department_id: null,
                program_id: null,
                bylaw_id: null,
                faculty_id: null
            }
        }
    },
    components:{
        ShowComponent,
        BBadge,
        BLink,
        BTab,
        BTabs,
        BCard,
        BRow,
        BCol,
        vSelect,
        EcommerceGoalOverview
    },
    watch:{
        'filter.department_id'(val){
            this.init(this.filter)
        },
        'filter.program_id'(val){
            this.init(this.filter)
        },
        'filter.bylaw_id'(val){
            this.filter.program_id = null
            this.init(this.filter)
        },
        'filter.faculty_id'(val){
            this.filter.bylaw_id = null
            this.filter.program_id = null
            this.init(this.filter)
        },
    },
    computed:{
        ...mapGetters({
            item: "questionnaires/item",
            load: "questionnaires/load",
            lookups: 'questionnaires/lookups',
        }),
        localLang() {
            return this.$i18n.locale;
        },
        id() {
            return this.$route.params.id ? this.$route.params.id : null;
        },
    },
    methods:{
        init(val) {
            this.$store.dispatch("questionnaires/getQuestionnaireStatistics", { query : val ? val : null , id: this.id})
            const payload = {id: this.id}
            this.$store.dispatch("questionnaires/getUsersAnswers", payload).then(res=>{
                this.evaluationAnswers = res.data.filter(item=>{
                    if( item.type.id == 1 ){
                        return item
                    }
                })
                this.yesOrNoAnswers = res.data.filter(item=>{
                    if( item.type.id == 3 ){
                        return item
                    }
                })
                this.textAnswers = res.data.filter(item=>{
                    if( item.type.id == 2 ){
                        return item
                    }
                })
            })
        },
        checkTabVisited(index) {
            return this.visitedTabs.includes(index);
        },
        saveStatus(index) {
            this.edit = false;
            this.resetFilterQueryParams({});
            this.updateFilterQueryParams({
                tabNum: index,
                ...this.getTabFilterData(index),
            });
            this.visitedTabs.push(index);
        },
    },
    mounted() {
      this.init();
    }
}
</script>

<style scoped>
.striped-custom{
    background-color: #fafafc;
    padding: 0.72rem 15px;
    border-top: 1px solid #e1e1e1;
    border-bottom: 1px solid #e1e1e1;
    color: #746D69;
    font-weight: 600;
}
.li-custom{
    border-top: 1px solid #e1e1e1;
    margin-left: -38px;
    padding-left: 38px;
}

ol{
    list-style-position: inside !important;
}
/deep/ .card{
    margin-bottom: 0px !important;
}
</style>