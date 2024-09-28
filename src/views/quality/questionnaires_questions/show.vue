<template>
  <div>
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
                    <span>{{ $t("Global.basic_info") }}</span>
                </template>
                <Edit 
                    v-if="edit" 
                    @hide="cancel()"
                    @refresh="init"
                    :inline="true"
                    :tabNumber="0" 
                    :data="
                        id ? item : 
                        {
                            'question':'', 
                            'question_local':'', 
                            'id':'',
                            'type': ''
                        }
                    "   
                >
                </Edit>
                <div v-if="item && !edit">
                    <ShowComponent 
                        :loading="load"
                        :data="item" 
                        :only="[
                                'question',
                                'question_local',
                                'id',
                                'type'
                            ]" 
                        >
                        <template #question="{ data }">
                            <th scope="row" :width="'20%'">
                              {{ $t(`Global.english_question`) }}
                            </th>
                            <td>
                              {{ data.question }}
                            </td>
                        </template>
                        <template #question_local="{ data }">
                            <th scope="row" :width="'20%'">
                                {{ $t(`Global.arabic_question`) }}
                            </th>
                            <td >
                                {{ data.question_local }}
                            </td>
                        </template>
                        <template #id="{ data }">
                            <th scope="row" :width="'20%'" v-if="$i18n.locale == 'ar'">
                                {{ $t(`Global.english_question`) }}
                            </th>
                            <td v-if="$i18n.locale == 'ar'">
                                {{ data.question }}
                            </td>
                            <th scope="row" :width="'20%'" v-if="$i18n.locale == 'en'">
                                {{ $t(`Global.arabic_question`) }}
                            </th>
                            <td v-if="$i18n.locale == 'en'">
                                {{ data.question_local }}
                            </td>
                        </template>
                        <template #type="{ data }">
                            <th scope="row" :width="'20%'">
                                {{ $t(`Global.type`) }}
                            </th>
                            <td >
                                {{ $i18n.locale == 'ar' ? data.type.name_local : data.type.name }}
                            </td>
                        </template>
                        <template #edit v-if="item.can_edit == true">
                            <div class="mt-0 mb-1">
                            <feather-icon v-if="hasPermission('edit_exam')" @click="openEdit()" style="cursor: pointer"
                                icon="EditIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.edit')" />
                            </div>
                        </template>
                    </ShowComponent>
                </div>
            </b-tab>

        </b-tabs>
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
    BCard
} from "bootstrap-vue";
import Edit from "@/views/quality/questionnaires_questions/edit.vue";
import ShowComponent from "@/views/components/info/show";


export default {
    name:'Show',
    data(){
        return {
            edit: false,
            visitedTabs: [],
            tabIndex: 0,
            index: 0,
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
    },
    computed:{
        ...mapGetters({
            item: "questionnairesQuestions/item",
            load: "questionnairesQuestions/load",
        }),
        localLang() {
            return this.$i18n.locale;
        },
        id() {
            return this.$route.params.id ? this.$route.params.id : null;
        },
    },
    methods:{
        init(id) {
            if(this.id || id){
                this.$store.dispatch("questionnairesQuestions/get", this.id);
                this.edit = this.$route.query.inline == 'false' ? false : this.$route.query.inline;
            }else{
                this.edit = true
            }
        },
        openEdit() {
            this.edit = true;
            this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: true });
        },
        cancel() {
            this.edit = false;
            this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: false });
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

</style>