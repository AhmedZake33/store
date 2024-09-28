<template>
  <div id="tableWithTostar">
    <b-toast
      ref="hotTable-toast"
      :class="fullScreen ? 'centerToaster' : ''"
      variant="info"
      id="example-toast"
      :static="fullScreen ? true : false"
      toaster="b-toaster-top-center"
      no-auto-hide
    >
      <b-button size="sm" variant="info" class="btn-icon rounded-circle">
        <feather-icon size="15" icon="LoaderIcon" />
      </b-button>
      {{ $t("Global.saving") }}
    </b-toast>
    <hot-table
      ref="hotTableComponent"
      :afterRender="afterRender"
      :afterDocumentKeyDown="afterDocumentKeyDown"
      :beforeValidate="beforeValidate"
      id="hotTableId"
      v-if="tableKey"
      :data="data"
      :className="className"
      :afterChange="afterChange"
      :afterLoadData="afterLoadData"
      :dropdownMenu="true"
      :filters="true"
      :style="style"
      :settings="hotSettings"
      :manualRowResize="true"
      :rowHeaders="rerendreVar ? true : false"
      :colHeaders="true"
    >
     
      <hot-column
        :readOnly="true"
        :settings="codeSettings"
        :title="$t('Global.code')"
        data="code"
      >
      </hot-column>
      <hot-column
        class="student_cell"
        v-if="$i18n.locale == 'en'"
        :readOnly="true"
        label="name"
        :settings="studentColumnSettings"
        :title="$t('Global.name')"
        data="name"
      >
        <custom-renderer :data="data" hot-renderer></custom-renderer>
      </hot-column>
      <hot-column
        class="student_cell"
        v-if="$i18n.locale == 'ar'"
        label="name_local"
        :readOnly="true"
        :settings="studentColumnSettings"
        :title="$t('Global.name_local')"
        data="name_local"
      >
        <custom-renderer :data="data" hot-renderer></custom-renderer>
      </hot-column>

      <!-- <hot-column
        :readOnly="true"
        :settings="sectionColumnSettings"
        :title="$t('Global.section')"
        data="section"
      > -->
      <!-- </hot-column> -->
      <!-- <hot-column
        :readOnly="true"
        :settings="sectionColumnSettings"
        :title="$t('Global.group')"
        data="group"
      >
      </hot-column> -->

      <hot-column
 
        :settings="sectionColumnSettings"
        :title="$t('Global.grade')"
        data="grade"
      >
      </hot-column>

  

    
      <!-- <hot-column :readOnly="true" :settings="thirdColumnSettings" :title="$t('Global.GPA')" data="grade_type"></hot-column> -->
    </hot-table>
  </div>
</template>

<script>
import { BBadge } from "bootstrap-vue";
import { HotTable, HotColumn } from "@handsontable/vue";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.css";
import { mapGetters, mapActions } from "vuex";
import { registerLanguageDictionary, arAR, enUS } from "handsontable/i18n";

// import StudentCell from './StudentCell.vue'
// '<router-link to="/students/{{value.user_id}}">{{value.user_name}}</router-link><div class="custom_badge badge-primary badge badge-pill" v-for="(item,index) in value.status" :key="item.user_name" variant="light-danger" style="float:right; display:flex;" >{{item.name}}&nbsp;<br></div>',
const CustomRenderer = {
  template:
    '<div class="custom_name"><router-link :to="\'/students/\'+getData(data).student_id">{{getData(data).name.split("_")[0]}}</router-link> <div class="self"> <div :class="getbadge(item.name)" class="mx-03 mt-05 custom_badge badge-primary badge badge-pill" :key="item.name" v-for="(item,index) in getData(data).statusData.status" variant="light-danger" :style="$i18n.locale == \'en\' ? \'float:right; display:flex\': \'float:left; display:flex;\' ">  {{item.name}} </div>  </div> </div>',
  data() {
    return {
      // We'll need to define properties in our data object,
      // corresponding to all of the data being injected from
      // the BaseEditorComponent class, which are:
      // - hotInstance (instance of Handsontable)
      // - row (row index)
      // - col (column index)
      // - prop (column property name)
      // - TD (the HTML cell element)
      // - cellProperties (the cellProperties object for the edited cell)
      hotInstance: null,
      TD: null,
      row: null,
      col: null,
      prop: null,
      value: null,
      cellProperties: null,
    };
  },

  props: {
    data: Array,
  },
  methods: {
    // hotData(){
    //   // return this.hotInstance.getPlugin('filters').components.get('filter_by_value').elements[0];
    //   var elements = this.hotInstance.hot.getPlugin('filters').components.get('filter_by_value').elements[0];
    //   return elements.itemsBox.getSourceData();
    // },

    getData(filteredData) {
      if (this.data.length) {
        let data = {};
        let filteredData = filteredData;
        // .replace(/[0-9]/g, '');
        if (this.$i18n.locale == "en") {
          data = this.data.find((el) => el.name === this.value);
          if (data && data != "undefined") {
            data.name = data && data.name && data.name;
          }
          // if(this.TD.querySelector('div a')){
          //   this.TD.querySelector('div a').innerHTML = data.name.replace(/[0-9]/g, '');
          // }
        } else {
          data = this.data.find((el) => el.name_local === this.value);
          if (data && data != "undefined") {
            data.name = data && data.name_local && data.name_local;
          }
          // if(this.TD.querySelector('div a')){
          //   this.TD.querySelector('div a').innerHTML = data.name_local.replace(/[0-9]/g, '');
          // }
        }
        // data.name.replace(/[0-9]/g, '');
        // data.name_local.replace(/[0-9]/g, '');
        return data;
      }
    },
    getbadge(badge) {
      if (badge == "Registered") return "badge-info";
      else if (badge == "Fresh") return "badge-info";
      else if (badge == "Succeeded") return "badge-success";
      else if (badge == "Repeat") return "badge-secondary";
      else if (badge == "Improve") return "badge-primary";
      else if (badge == "Elective") return "badge-primary";
      else if (badge == "Drop Request") return "badge-warning";
      else if (badge == "Register Request") return "badge-warning";
      else if (badge == "Withdraw Request") return "badge-warning";
      else if (badge == "Dropped") return "badge-danger";
      else if (badge == "Failed") return "badge-danger";
      else if (badge == "Withdrawn") return "badge-danger";
    },
  },
};

const CustomGrade = {
  template:
    '<div class="text-center">{{getData(data) ? getData(data).name : ""}} {{getData(data) && getData(data).gpa  ?"(" +getData(data).gpa+ ")": ""}}</div>',
  data() {
    return {
      // We'll need to define properties in our data object,
      // corresponding to all of the data being injected from
      // the BaseEditorComponent class, which are:
      // - hotInstance (instance of Handsontable)
      // - row (row index)
      // - col (column index)
      // - prop (column property name)
      // - TD (the HTML cell element)
      // - cellProperties (the cellProperties object for the edited cell)
      hotInstance: null,
      TD: null,
      row: null,
      col: null,
      prop: null,
      value: null,
      cellProperties: null,
    };
  },

  props: {
    data: Array,
  },
  methods: {
    // hotData(){
    //   // return this.hotInstance.getPlugin('filters').components.get('filter_by_value').elements[0];
    //   var elements = this.hotInstance.hot.getPlugin('filters').components.get('filter_by_value').elements[0];
    //   return elements.itemsBox.getSourceData();
    // },
    getData(filteredData) {
      if (this.data.length) {
        let data = {};
        if (!this.value) return;
        if (typeof this.value === "object") return this.value;
        const filteredValue = this.value.includes("_")
          ? this.value.split("_")[1]
          : this.value;
        data = this.data.find((el) => el.grade_type_id == filteredValue);
        return data.grade_type_object ? data.grade_type_object : "";
      }
    },
    getbadge(badge) {
      if (badge == "Registered") return "badge-info";
      else if (badge == "Fresh") return "badge-info";
      else if (badge == "Succeeded") return "badge-success";
      else if (badge == "Repeat") return "badge-secondary";
      else if (badge == "Improve") return "badge-primary";
      else if (badge == "Elective") return "badge-primary";
      else if (badge == "Drop Request") return "badge-warning";
      else if (badge == "Register Request") return "badge-warning";
      else if (badge == "Withdraw Request") return "badge-warning";
      else if (badge == "Dropped") return "badge-danger";
      else if (badge == "Failed") return "badge-danger";
      else if (badge == "Withdrawn") return "badge-danger";
    },
  },
};

const CustomPercentage = {
  template: '<div class="text-center">{{preValue}}</div>',
  data() {
    return {
      // We'll need to define properties in our data object,
      // corresponding to all of the data being injected from
      // the BaseEditorComponent class, which are:
      // - hotInstance (instance of Handsontable)
      // - row (row index)
      // - col (column index)
      // - prop (column property name)
      // - TD (the HTML cell element)
      // - cellProperties (the cellProperties object for the edited cell)
      hotInstance: null,
      TD: null,
      row: null,
      col: null,
      prop: null,
      value: null,
      cellProperties: null,
    };
  },
  computed: {
    preValue() {
      if (this.value && this.value.toString().includes("%")) {
        return this.value;
      } else {
        return this.value + "%";
      }
    },
  },
};

const CustomTotal = {
  template: '<div class="text-center">{{preValue}}</div>',
  data() {
    return {
      // We'll need to define properties in our data object,
      // corresponding to all of the data being injected from
      // the BaseEditorComponent class, which are:
      // - hotInstance (instance of Handsontable)
      // - row (row index)
      // - col (column index)
      // - prop (column property name)
      // - TD (the HTML cell element)
      // - cellProperties (the cellProperties object for the edited cell)
      hotInstance: null,
      TD: null,
      row: null,
      col: null,
      prop: null,
      value: null,
      cellProperties: null,
    };
  },
  computed: {
    preValue() {
      return this.value;
    },
  },
};
// register Handsontable's modules
registerAllModules();
registerLanguageDictionary(arAR);
registerLanguageDictionary(enUS);
// const button = document.querySelector('#set-data-action');
// button.addEventListener('click', event => {
//   const selected = hot.getSelected() || [];
//   const target = event.target.id;

//   hot.suspendRender();

//   for (let index = 0; index < selected.length; index += 1) {
//     const [row1, column1, row2, column2] = selected[index];
//     const startRow = Math.max(Math.min(row1, row2), 0);
//     const endRow = Math.max(row1, row2);
//     const startCol = Math.max(Math.min(column1, column2), 0);
//     const endCol = Math.max(column1, column2);

//     for (let rowIndex = startRow; rowIndex <= endRow; rowIndex += 1) {
//       for (let columnIndex = startCol; columnIndex <= endCol; columnIndex += 1) {
//         hot.setDataAtCell(rowIndex, columnIndex, 'data changed');
//         hot.setCellMeta(rowIndex, columnIndex, 'className', 'c-red');
//       }
//     }
//   }

//   hot.render();
//   hot.resumeRender();
// });
export default {
  props: {
    data: Array,
    status: String,
    grades: Array,
    marks: [Array, String, Object, Boolean],
    offeringGradesHeaders: [Array, Object],
    offeringStudentsGrades: Array,
    max_total: Number,
    offeringMarks: Array,
  },
  components: {
    HotTable,
    HotColumn,
    CustomRenderer,
    CustomGrade,
    CustomTotal,
    CustomPercentage,
    BBadge,
    // StudentCell
  },
  data() {
    return {
      componentKey: true,
      ExcelMessage: "",
      maxtotal: 0,
      fullScreen: false,
      // fromCellChange:false,
      rerendreVar: true,
      tableKey: true,
      stop: true,
      columnsMax: {},
      marksColumns: [],
      max: false,
      negative: false,
      absentStudent: false,
      hotSettings: {
        licenseKey: "non-commercial-and-evaluation",
        startRows: 5,
        startCols: 5,
        colHeaders: true,
        stretchH: "all",
        filters: [2],
        manualColumnResize: true,
        columnSorting: {
          sortEmptyCells: true,
          initialConfig: {
            column: 2,
            sortOrder: "asc",
          },
        },
        youtDirection: this.$i18n.locale == "en" ? "ltr" : "rtl",
        // load an RTL language (e.g., Arabic)
        language: this.$i18n.locale == "en" ? "en-US" : "ar-AR",
        dropdownMenu: ["filter_by_value"],

        afterDropdownMenuShow(instance) {
          var elements = instance.hot
            .getPlugin("filters")
            .components.get("filter_by_value").elements[0];
          let existingButton;
          let filterClass;
          let studentBody = document.body.classList.contains("student_class");
          let clear = document.querySelector(
            ".htDropdownMenu .handsontable .htUIClearAll a"
          );
          if (clear) {
            clear.click();
          }
          if (studentBody) {
            filterClass = document.querySelector(
              ".htDropdownMenu .handsontable .wtHolder .htCore tr .htCustomMenuRenderer.htFiltersMenuCondition"
            );
            filterClass.remove();
          }
        },
        afterSelection: (
          row,
          column,
          row2,
          column2,
          preventScrolling,
          selectionLayerLevel
        ) => {
          // If set to `false` (default): when cell selection is outside the viewport,
          // Handsontable scrolls the viewport to cell selection's end corner.
          // If set to `true`: when cell selection is outside the viewport,
          // Handsontable doesn't scroll to cell selection's end corner.
          let existingButton;
          let studentBody = document.body.classList.contains("student_class");
          let studentClass;
          if (column == 2) {
            document.body.classList.add("student_class");
          } else {
            if (studentBody) {
              document.body.classList.remove("student_class");
            }
          }
        },
        // afterGetColHeader: function (col, TH) {
        //   var BUTTON_CLASS_NAME = 'changeType';
        //   var existingButton = TH.querySelector('.' + BUTTON_CLASS_NAME);
        //   if (col == 2) {
        //     var studentClass = existingButton.classList.add('student_class');
        //     if (studentClass) {
        //     }
        //   }
        // if (!this.enabled) {
        //   if (existingButton) {
        //     if (Object.prototype.toString.call( this.getSettings().filters ) === '[object Array]' && this.getSettings().filters.indexOf(col)) {
        //       // existingButton.parentNode.removeChild(existingButton);
        //       existingButton.classList.add('student_class')

        //     }
        //   }
        //   return;
        // }
        // },
      },
      secondColumnSettings: {
        width: 50,
      },
      sectionColumnSettings: {
        width: 90,
      },
      codeSettings: {
        initialConfig: {
          column: 2,
          sortOrder: "asc",
        },
      },
      thirdColumnSettings: {
        width: 90,
      },
      studentColumnSettings: {
        width: 400,
        className: "student_cell",
      },
      id: "my-custom-id",
      className: "htCenter",
      style: "height: 442px; overflow: hidden;",
    };
  },
  computed: {
    ...mapGetters({
      gradeItem: "Emtyaz/item",
      load: "Emtyaz/load",
    }),
    // fullScreen() {
    //   if ((window.fullScreen) ||
    //     (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
    //     return true
    //   } else {
    //     return false
    //   }
    // },
    comStatus() {
      if (this.status) {
        return this.status;
      } else if (this.gradeItem.status) {
        return this.gradeItem.status;
      } else {
        return null;
      }
    },
  },
  methods: {
    ...mapActions({
      offering_mark: "Emtyaz/offering_mark",
      updateStudentGradeFromExcel: "Emtyaz/updateStudentGradeFromExcel",
    }),
    afterRender(d) {},
    modifyRowHeight(height, row) {},
    getGrade() {
      //       {
      //     "id": 1490,
      //     "bylaw_id": 105,
      //     "name": "C+",
      //     "gpa": 2.3
      // }
    },
    camelize(str) {
      return str
        .replace(/_/g, " ")
        .replace(/activities/, "Activity")
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
          return index == 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, "");
    },
    checkPermissionAndStatus(grade, type = "edit") {
      let shortNameCamelCase = this.camelize(grade.short_name);
      let statusAsRole;
      if (!this.comStatus) return;
      if (this.comStatus.toLowerCase() == "draft") {
        statusAsRole = this.comStatus.toLowerCase();
      } else if (this.comStatus.toLowerCase() == "submitted") {
        statusAsRole = this.comStatus.toLowerCase().slice(0, -3);
      } else if (this.comStatus.toLowerCase() == "accepted") {
        statusAsRole = this.comStatus
          .toLowerCase()
          .slice(0, -2)
          .replace("accept", "review");
      } else if (this.comStatus.toLowerCase() == "approved") {
        statusAsRole = this.comStatus.toLowerCase().slice(0, -1);
      } else {
        statusAsRole = this.comStatus.toLowerCase().slice(0, -2);
      }
      if (shortNameCamelCase == "activity") {
        shortNameCamelCase = "studentActivity";
      }
      let permissionString;
      if (type == "show") {
        permissionString = statusAsRole + "_show" + "_" + shortNameCamelCase;
      } else {
        permissionString = statusAsRole + "_edit" + "_" + shortNameCamelCase;
      }
      if (this.hasPermission(permissionString)) {
        if (type == "show") return true;
        return false;
      } else {
        if (type == "show") return false;
        return true;
      }
    },
    // afterDropdownMenuShow(instance) {
    //   // this.$refs.hotTableComponent.hotInstance.loadData(this.data);
    //   var elements = instance.hot.getPlugin('filters').components.get('filter_by_value').elements[0];
    //   var data = elements.itemsBox.getSourceData();
    //   // return;
    //   let meta;
    //   data.forEach((item, index) => {
    //     if(item.visualValue.user_name){
    //       meta = item.visualValue.user_name;
    //     }else{
    //       meta = item.visualValue
    //     }
    //     if (meta.newValue) {
    //       elements.itemsBox.setSourceDataAtCell(index, 'visualValue', meta.newValue);
    //       elements.itemsBox.setSourceDataAtCell(index, 'value', meta.newValue);
    //     } else {
    //       elements.itemsBox.setSourceDataAtCell(index, 'visualValue', item.visualValue);
    //       elements.itemsBox.setSourceDataAtCell(index, 'value', item.visualValue);
    //     }
    //   });
    // },
    // afterFilter(instance){
    // },
    beforeFilter(instance) {
      if (instance.length) {
        let data = [];
        let filteredData = instance[0].conditions[0].args[0];
        data = this.data.filter((el) => {
          return filteredData.some((item) => {
            return item == el.name;
          });
        });
        setTimeout(() => {
          if (data.length) {
            this.$refs.hotTableComponent.hotInstance.loadData(data);
          }
        }, 50);
        // instance[0].conditions[0].args.forEach(el=>{
        //   this.data.forEach(item=>{
        //     if(el == item.name){
        //       data.push(item)
        //     }
        //   })
        // })
      }
    },
    afterDocumentKeyDown(event) {
      return;
      let rows = [];
      let cols = [];
      const selectedFrom =
        this.$refs.hotTableComponent.hotInstance.getSelectedRangeLast().from;
      const selectedTo =
        this.$refs.hotTableComponent.hotInstance.getSelectedRangeLast().to;

      if (
        selectedFrom.col == selectedTo.col &&
        selectedFrom.row == selectedTo.row
      ) {
        for (var i = selectedFrom.row; i <= selectedTo.row; i++) {
          rows.push(i);
        }
      } else if (
        selectedFrom.col == selectedTo.col &&
        selectedFrom.row != selectedTo.row
      ) {
        for (var i = selectedFrom.row; i <= selectedTo.row; i++) {
          rows.push(i);
        }
      }

      if (rows.length) {
        rows.forEach((element) => {
          this.submitCell(selectedFrom, element);
        });
      }
    },

    submitCell(selectedFrom, element) {
      let cell = this.$refs.hotTableComponent.hotInstance.getCellMeta(
        element,
        selectedFrom.col
      );
      let cellData = this.$refs.hotTableComponent.hotInstance.getDataAtCell(
        element,
        selectedFrom.col
      );
      const orderedData = this.$refs.hotTableComponent.hotInstance.getData();
      const dataValues = this.data.find(
        (el) => el.code == orderedData[cell.row][1]
      );
      const registration_id = dataValues.registration_id; // object of new value data
      const offering_mark_id = isNaN(cell.prop)
        ? Number(cell.prop.replace("mark_", ""))
        : null; // mark_1 => 1
      const { marksData } = dataValues;
      const totalIndex = Number(marksData.length + 5);
      let totalMax = this.max_total
      // marksData
      //   .map((el) => el.max_mark)
      //   .reduce((partialSum, a) => partialSum + a, 0);
      // if (dataValues && dataValues.markName == "Old Grade") {
      //   totalMax = totalMax - 100;
      // }
      const resource = {
        registration_id,
        offering_mark_id,
        value: "",
      };

      this.updateStudentGradeFromExcel(resource).then((response) => {
        setTimeout(() => {
          this.$emit("updateLoading", false);
          this.$bvToast.hide("example-toast");
        }, 4000);

        if (response.success) {
          if (response.success === "not_authorized") {
            window.setTimeout(this.$emit("message", "not_authorized"), 1000);
            if (resource.offering_mark_id == "extra") {
              this.$refs.hotTableComponent.hotInstance.setDataAtCell(
                element,
                totalIndex,
                cellData
              );
            }
            marksData.forEach((element, index) => {
              if (element.id == offering_mark_id) {
                this.$refs.hotTableComponent.hotInstance.setDataAtCell(
                  element,
                  index + 5,
                  cellData
                );
                // this.fromCellChange = true;
              }
            });
            return;
          } else if (response.success === "update_not_allowed") {
            window.setTimeout(
              this.$emit("message", "update_not_allowed"),
              3000
            );
            marksData.forEach((element, index) => {
              if (element.id == offering_mark_id) {
                this.$refs.hotTableComponent.hotInstance.setDataAtCell(
                  element,
                  index + 5,
                  cellData
                );
                // this.fromCellChange = true;
              }
            });
            return;
          } else {
            this.$emit("message", "success");
            if (response.success.grade_type) {
              let gradeCell = this.$refs.hotTableComponent.hotInstance.getCell(
                element,
                this.checkPermissionAndStatus({ short_name: "extra" }, "show")
                  ? totalIndex + 3
                  : totalIndex + 2
              );
              gradeCell.querySelector("div").innerHTML = response.success
                .grade_type
                ? response.success.grade_type.name
                : "";
              gradeCell.querySelector("div").innerHTML +=
                response.success.grade_type && response.success.grade_type.gpa
                  ? "(" + response.success.grade_type.gpa + ")"
                  : "";
              // this.$refs.hotTableComponent.hotInstance.setDataAtCell(element,this.checkPermissionAndStatus({ short_name: 'extra' },'show') ? totalIndex + 3 : totalIndex + 2, response.success.grade_type);
              // this.fromCellChange = true;
            }
            if (response.success.total != null) {
              let totalCell = this.$refs.hotTableComponent.hotInstance.getCell(
                element,
                this.checkPermissionAndStatus({ short_name: "extra" }, "show")
                  ? totalIndex + 1
                  : totalIndex
              );
              totalCell.querySelector("div").innerHTML = response.success.total;
              let percentageCell =
                this.$refs.hotTableComponent.hotInstance.getCell(
                  element,
                  this.checkPermissionAndStatus({ short_name: "extra" }, "show")
                    ? totalIndex + 2
                    : totalIndex + 1
                );
              percentageCell.querySelector("div").innerHTML = (
                (response.success.total / totalMax) *
                100
              ).toFixed(2);
              percentageCell.querySelector("div").innerHTML += "%";
              // this.$refs.hotTableComponent.hotInstance.setDataAtCell(element, this.checkPermissionAndStatus({ short_name: 'extra' },'show') ? totalIndex + 1 : totalIndex, response.success.total);
              // this.$refs.hotTableComponent.hotInstance.setDataAtCell(element, this.checkPermissionAndStatus({ short_name: 'extra' },'show') ? totalIndex + 2 :totalIndex + 1, (((Math.round(response.success.total) / totalMax) * 100)).toFixed(1));
              // this.fromCellChange = true;
            }
          }
        }
      });
    },
    updateData(changes, index, source) {
    
      let meta = {};
      if (changes) {
        meta.row = changes[index][0];
        meta.prop = changes[index][1];
        meta.oldValue = changes[index][2];
        meta.newValue = changes[index][3];
      }
      const orderedData = this.$refs.hotTableComponent.hotInstance.getData();
      const dataValues = this.data.find(
        (el) => el.code == orderedData[meta.row][0]
      );
      if (changes) {
        if (meta.oldValue == meta.newValue && meta.newValue != "") return;
        const registration_id = dataValues.id; // object of new value data
        const offering_mark_id = isNaN(meta.prop)
          ? meta.prop.replace("mark_", "")
          : null; // mark_1 => 1
        const { marksData } = dataValues; // to get max of updated cell
        const max =
          marksData.find((el) => el.id == offering_mark_id) &&
          marksData.find((el) => el.id == offering_mark_id).max_mark
            ? marksData.find((el) => el.id == offering_mark_id).max_mark
            : this.max_total;
        const studentStatus = dataValues?.statusData?.status;
        const resource = {
          registration_id,
          offering_mark_id,
          value: meta.newValue,
        };
        const re = /^\d+$/.test(resource.value);
        const space = new RegExp("^s*$");
        const { registration_marks } = this.offeringStudentsGrades.find(
          (el) => el.id == registration_id
        );
        let currentMark = marksData.find((el) => el.id == offering_mark_id);
        let cellValue = currentMark
          ? registration_marks.find((el) => el.id == currentMark.id)
          : null;
        let totalMax = marksData
          .map((el) => el.max_mark)
          .reduce((partialSum, a) => partialSum + a, 0);
        if (dataValues && dataValues.markName == "Old Grade") {
          totalMax = totalMax - 100;
        }
        this.$emit("message", null);
        if (meta.prop == "total" || meta.prop == "markPercentage") return;
        if (typeof resource.value === "object") return;
        const totalIndex = Number(marksData.length + 5);
        if (
          !resource.offering_mark_id ||
          (resource.offering_mark_id &&
            resource.offering_mark_id == "grade_type")
        )
          return;

        // const statusName = this.grades.find(
        //   (el) => el.id == resource.offering_mark_id
        // );
        // if (statusName && statusName.short_name == "final_exam") {
        //   marksData.forEach((element, index) => {
        //     if (element.id == offering_mark_id) {
        //       // this.$refs.hotTableComponent.hotInstance.setDataAtCell(
        //       //   meta.row,
        //       //   index + 3,
        //       //   ""
        //       // );
        //       let totalCell = this.$refs.hotTableComponent.hotInstance.getCell(
        //         meta.row,
        //         index + 3,
        //       );
        //       totalCell.innerHTML = null;
        //       // this.fromCellChange = true;
        //     }
        //   });
        //   window.setTimeout(this.$emit("message", "update_not_allowed"), 3000);
        //   return;
        // }
        this.$bvToast.show("example-toast");
        this.$emit("updateLoading", true);
        this.updateStudentGradeFromExcel(resource)
          .then((response) => {
            if (source == "CopyPaste.paste") {
              setTimeout(() => {
                this.$emit("updateLoading", false);
                this.$bvToast.hide("example-toast");
              }, 4000);
            } else {
              this.$emit("updateLoading", false);
              this.$bvToast.hide("example-toast");
            }
            let finalExam = marksData.find((el) => el.id == offering_mark_id);
            let absentStudent = studentStatus.some((el) => el.name == "Absent");
            if (response.success) {
              if (response.success === "not_authorized") {
                window.setTimeout(
                  this.$emit("message", "not_authorized"),
                  1000
                );
                if (resource.offering_mark_id == "extra") {
                  this.$refs.hotTableComponent.hotInstance.setDataAtCell(
                    meta.row,
                    totalIndex,
                    meta.oldValue
                  );
                }
                marksData.forEach((element, index) => {
                  if (element.id == offering_mark_id) {
                    this.$refs.hotTableComponent.hotInstance.setDataAtCell(
                      meta.row,
                      index + 5,
                      meta.oldValue
                    );
                    // this.fromCellChange = true;
                  }
                });
                return;
              } else if (response.success === "update_not_allowed") {
                window.setTimeout(
                  this.$emit("message", "update_not_allowed"),
                  3000
                );
                marksData.forEach((element, index) => {
                  if (element.id == offering_mark_id) {
                    this.$refs.hotTableComponent.hotInstance.setDataAtCell(
                      meta.row,
                      index + 5,
                      meta.oldValue
                    );
                    // this.fromCellChange = true;
                  }
                });
                return;
              } else {
                this.$emit("message", "success");
                if (response.success.grade_type) {
                  let gradeCell =
                    this.$refs.hotTableComponent.hotInstance.getCell(
                      meta.row,
                      this.checkPermissionAndStatus(
                        { short_name: "extra" },
                        "show"
                      )
                        ? totalIndex + 3
                        : totalIndex + 2
                    );
                  gradeCell.querySelector("div").innerHTML = response.success
                    .grade_type
                    ? response.success.grade_type.name
                    : "";
                  gradeCell.querySelector("div").innerHTML +=
                    response.success.grade_type &&
                    response.success.grade_type.gpa
                      ? "(" + response.success.grade_type.gpa + ")"
                      : "";
                  // this.$refs.hotTableComponent.hotInstance.setDataAtCell(meta.row,this.checkPermissionAndStatus({ short_name: 'extra' },'show') ? totalIndex + 3 : totalIndex + 2, response.success.grade_type);
                  // this.fromCellChange = true;
                }
                if (response.success.total != null) {
                  let totalCell =
                    this.$refs.hotTableComponent.hotInstance.getCell(
                      meta.row,
                      this.checkPermissionAndStatus(
                        { short_name: "extra" },
                        "show"
                      )
                        ? totalIndex + 1
                        : totalIndex
                    );
                  totalCell.querySelector("div").innerHTML =
                    response.success.total;
                  let percentageCell =
                    this.$refs.hotTableComponent.hotInstance.getCell(
                      meta.row,
                      this.checkPermissionAndStatus(
                        { short_name: "extra" },
                        "show"
                      )
                        ? totalIndex + 2
                        : totalIndex + 1
                    );
                  percentageCell.querySelector("div").innerHTML = (
                    (Math.round(response.success.total) / totalMax) *
                    100
                  ).toFixed(1);
                  percentageCell.querySelector("div").innerHTML += "%";
                  // this.$refs.hotTableComponent.hotInstance.setDataAtCell(meta.row, this.checkPermissionAndStatus({ short_name: 'extra' },'show') ? totalIndex + 1 : totalIndex, response.success.total);
                  // this.$refs.hotTableComponent.hotInstance.setDataAtCell(meta.row, this.checkPermissionAndStatus({ short_name: 'extra' },'show') ? totalIndex + 2 :totalIndex + 1, (((Math.round(response.success.total) / totalMax) * 100)).toFixed(1));
                  // this.fromCellChange = true;
                }
              }
            }
          })
          .catch((error) => {
            // if(absentStudent && dataValues && finalExam.short_name == "final_exam"){
            //     this.$emit("message", "absent");
            //     marksData.forEach((element, index) => {
            //       if (element.id == offering_mark_id) {
            //         this.$refs.hotTableComponent.hotInstance.setDataAtCell(
            //           meta.row,
            //           index + 3,
            //           meta.oldValue
            //         );
            //         // this.fromCellChange = true;
            //       }
            //     });
            //     return;
            //   }
            this.$bvToast.hide("example-toast");
            this.$emit("message", "update_not_allowed");
          });
      }
    },
    afterLoadData(sourceData, init, source) {
      if (init) {
        this.rerendreVar = false;
        setTimeout(() => {
          this.rerendreVar = true;
        }, 200);
        return;
      }
    },

    afterChange(changes, source) {
  
      if (source == "loadData" || source == undefined) return;
      if (source == "CopyPaste.paste" || source == "Autofill.fill") {
        changes.forEach((element, index) => {
          this.updateData(changes, index, source);
        });
      } else {
        this.updateData(changes, 0, source);
      }
    },

    getFinalExam(name) {},

    beforeValidate(value, row, prop) {
      // setTimeout(() => {
      const orderedData = this.$refs.hotTableComponent.hotInstance.getData();
      const dataValues = this.data.find((el) => el.code == orderedData[row][1]);
      const registration_id = dataValues.id; // object of new value data
      const offering_mark_id = isNaN(prop) ? prop.replace("mark_", "") : null; // mark_1 => 1
      let { marksData } = dataValues; // to get max of updated cell
      const max =
        marksData.find((el) => el.id == offering_mark_id) &&
        marksData.find((el) => el.id == offering_mark_id).max_mark
          ? marksData.find((el) => el.id == offering_mark_id).max_mark
          : this.max_total;
      const studentStatus = dataValues?.statusData?.status;
      const resource = {
        registration_id,
        offering_mark_id,
        value: value,
        max,
      };
      let finalExam = marksData.find((el) => el.id == offering_mark_id);
      let marksValues = [];
      for (var [key, value] of Object.entries(dataValues)) {
        if (Number(key.replace("mark_", "")) != offering_mark_id) {
          if (key.includes("mark_")) {
            marksValues.push(Number(value));
          }
        }
      }

      const re = /^\d+$/.test(resource.value);
      if (resource.value > resource.max) {
        this.$emit("message", "max");
        this.max = true;
        return;
      }
      if (resource.value < 0) {
        this.$emit("message", "negative");
        this.negative = true;
        return "";
      }

      // let absentStudent = studentStatus.some((el) => el.name == "Absent");
      // // var colHeaderList = this.$refs.hotTableComponent.hotInstance.getColHeader();
      // // var colData = this.$refs.hotTableComponent.hotInstance.getCell(row, this.$refs.hotTableComponent.hotInstance.propToCol(prop));
      // if (absentStudent && dataValues && finalExam.short_name == "final_exam") {
      //   this.$emit("message", "absent");
      //   this.absentStudent = true;
      //   return this.$emit("message", "absent");
      // }

      let input;
      if (resource && resource.value) {
        input = resource.value.toString().replace("%", "");
      } else {
        input = null;
      }
      if (input == null) return;
      marksValues.push(Number(input));
      const sumMarks = marksValues.reduce((partialSum, a) => partialSum + a, 0);

      let totalMax = marksData
        .map((el) => el.max_mark)
        .reduce((partialSum, a) => partialSum + a, 0);
      if (dataValues && dataValues.markName == "Old Grade") {
        totalMax = totalMax - 100;
      }
      const totalIndex = Number(marksData.length + 5);
      const markPercentage = (Math.round(sumMarks) / totalMax) * 100;
      const max_final_exam = this.offeringMarks.find((el) => el.is_final)?.pivot
        ?.max_mark;
      const latest_grade = max_final_exam * 0.3;
      let grade_type = {};
      if (0 <= Number(sumMarks) && Number(sumMarks) < 60) {
        grade_type = {
          name: "F",
          gpa: 0,
        };
        // grade_type = 0+'_'+dataValues.grade_type_id
      } else if (60 <= Number(sumMarks) && Number(sumMarks) < 65) {
        grade_type = {
          name: "D",
          gpa: 1.5,
        };
        // grade_type = 1.5+'_'+dataValues.grade_type_id
      } else if (65 <= Number(sumMarks) && Number(sumMarks) < 70) {
        grade_type = {
          name: "C",
          gpa: 2,
        };
        // grade_type = 2+'_'+dataValues.grade_type_id
      } else if (70 <= Number(sumMarks) && Number(sumMarks) < 75) {
        grade_type = {
          name: "C+",
          gpa: 2.3,
        };
        // grade_type = 2.3+'_'+dataValues.grade_type_id
      } else if (75 <= Number(sumMarks) && Number(sumMarks) < 80) {
        grade_type = {
          name: "B",
          gpa: 2.7,
        };
        // grade_type = 2.7+'_'+dataValues.grade_type_id
      } else if (80 <= Number(sumMarks) && Number(sumMarks) < 85) {
        grade_type = {
          name: "B+",
          gpa: 3,
        };
        // grade_type = 3+'_'+dataValues.grade_type_id
      } else if (85 <= Number(sumMarks) && Number(sumMarks) < 90) {
        grade_type = {
          name: "A-",
          gpa: 3.4,
        };
        // grade_type = 3.4+'_'+dataValues.grade_type_id
      } else if (90 <= Number(sumMarks) && Number(sumMarks) < 95) {
        grade_type = {
          name: "A",
          gpa: 3.7,
        };
        // grade_type = 3.7+'_'+dataValues.grade_type_id
      } else if (95 <= Number(sumMarks) && Number(sumMarks) < 100) {
        grade_type = {
          name: "A+",
          gpa: 4,
        };
        // grade_type = 4+'_'+dataValues.grade_type_id
      } else if (100 <= Number(sumMarks)) {
        grade_type = {
          name: "A+",
          gpa: 4,
        };
        // grade_type = 4+'_'+dataValues.grade_type_id
      }
      if (Number(input) > latest_grade) {
        // this.$refs.hotTableComponent.hotInstance.setDataAtCell(row, totalIndex, Math.round(Number(sumMarks)));
        // this.$refs.hotTableComponent.hotInstance.setDataAtCell(row, totalIndex + 1, Math.round(Number(markPercentage)));
        // this.$refs.hotTableComponent.hotInstance.setDataAtCell(row, totalIndex + 2, grade_type);
      } else {
        // this.$refs.hotTableComponent.hotInstance.setDataAtCell(row, totalIndex + 1, Math.round(Number(sumMarks)));
        // this.$refs.hotTableComponent.hotInstance.setDataAtCell(row, totalIndex, Math.round(Number(sumMarks)));
        // this.$refs.hotTableComponent.hotInstance.setDataAtCell(row, totalIndex + 2, { name: 'F', gpa: 0 });
      }
      // }, 70);
    },

    numberValid(value, callback) {
      // setTimeout(() => {
      const re = /^\d+$/.test(value);
      if (!re || this.max || this.negative || this.absentStudent) {
        if (value == "") {
          callback(true);
        } else {
          callback(false);
          this.max = false;
          this.negative = false;
          this.absentStudent = false;
          // if(this.absentStudent){
          //   this.tableKey = false;
          //   setTimeout(() => {
          //     this.tableKey = true;
          //   }, 50);
          // }
        }
      } else {
        callback(true);
      }
      // }, 0);
    },
  },
  mounted() {
    this.componentKey = false;
    this.$nextTick(() => {
      this.componentKey = true;
    });
  },
  created() {
    window.addEventListener("resize", (evt) => {
      if (window.innerWidth == screen.width) {
        this.fullScreen = true;
      } else {
        this.fullScreen = false;
      }
    });
  },
  watch: {
    "$i18n.locale"() {
      this.tableKey = false;
      setTimeout(() => {
        this.tableKey = true;
      }, 500);
    },
  },
};
</script>
<style lang="scss">
.custom_name {
  display: flex;
  flex-wrap: wrap;
  .self {
    align-self: flex-end;
  }
}
.handsontable th,
.handsontable td {
  white-space: unset !important;
}
.centerToaster {
  position: absolute;
  top: 10px;
  right: 50%;
  width: inherit;
  transform: translateX(200px);
}
#example-toast {
  &.toast {
    background-color: #00cfe8 !important;
    border: #ddd !important;
    color: white;
    font-size: 14px;
  }

  .toast-header {
    display: none;
  }
}

.mt-05 {
  margin-top: 2px;
}

.mx-03 {
  margin-right: 2px;
  margin-left: 2px;
}

.ht_clone_top,
.ht_clone_top_inline_start_corner,
.ht_clone_inline_start {
  z-index: 0 !important;
}

#hot-display-license-info {
  display: none;
}
</style>
