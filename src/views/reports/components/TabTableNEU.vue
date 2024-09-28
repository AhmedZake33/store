<template>
    <b-table-lite hover :items="data" :fields="tableFields" striped responsive="responsive" class="custom-table"></b-table-lite>
  </template>
  
  <script>
  import { number } from '@/@core/utils/validations/validations';
import BCardCode from '@core/components/b-card-code/BCardCode.vue'
  import { BTableLite } from 'bootstrap-vue'
  
  export default {
    components: {
      BCardCode,
      BTableLite,
    },
    data() {
      return {
        lang: this.$i18n.locale,
        items:[],
        tableFields: [],
      }
    },
    props: {
        data:[],
        removeSum : Boolean,
        tableKey :Number,
    },
    
    mounted() {
    // Get all unique keys from the items array
    const columnSums = {};
const allKeys = this.data.reduce((keys, item) => {
  Object.keys(item).forEach(key => {
    if (!keys.includes(key) && key !== "total" && key !== "details" && key !== "FacultyName" && key !== "FacultyNameAr") {
      keys.push(key);
    }
  });
  return keys;
}, []);
allKeys.sort();
allKeys.forEach(key => {
  this.data.forEach(item => {
    columnSums[key] = (columnSums[key] || 0) + (parseFloat(item[key]) || 0);
  });
  columnSums[key] = Math.round(columnSums[key] * 100) / 100;
});


const totalSum = this.data.reduce((sum, item) => {
  return sum + (parseFloat(item.total) || 0);
}, 0);

const roundedTotalSum = Math.round(totalSum * 100) / 100;

if (this.$i18n.locale === 'en') {
  this.tableFields = [
    { key: "FacultyName" },
    ...allKeys.map(key => ({ key })),
    { key: "total", label: "Total" }
  ];
} else {
  this.tableFields = [
    { key: "FacultyNameAr", label: "أسم الكليه" },
    ...allKeys.map(key => ({ key })),
    { key: "total", label: "مجموع" }
  ];
}

const totalRow = {};
allKeys.forEach(key => {
  totalRow[key] = columnSums[key];
});

totalRow.FacultyName = "Total";
totalRow.total = roundedTotalSum;
if(this.removeSum == false){
  this.data.push(totalRow);
}

this.items = this.data;


    
  },
  methods:{
    async column(){
      this.items = this.data;
      if(this.$i18n.locale == 'en'){
        const allKeys = this.data.reduce((keys, item) => {
        Object.keys(item).forEach(key => {
            if (!keys.includes(key) && key !== "total" && key !== "details"&& key!== "FacultyName" && key!='FacultyNameAr') {
            keys.push(key);
            }
        });
        return keys;
        }, []);
        allKeys.sort();
        // Include the "total" key at the end of the tableFields array
        this.tableFields = [
        { key: "FacultyName" },
        ...allKeys.map(key => ({ key })),
        { key: "total", label: "Total" },
      ];
      }else{
        const allKeys = this.data.reduce((keys, item) => {
        Object.keys(item).forEach(key => {
            if (!keys.includes(key) && key !== "total" && key !== "details"&& key!== "FacultyName" && key!="FacultyNameAr") {
            keys.push(key);
            }
        });
        return keys;
        }, []);
        allKeys.sort();
        // Include the "total" key at the end of the tableFields array
        this.tableFields = [
        { key: "FacultyNameAr" ,label : "أسم الكليه"},
        ...allKeys.map(key => ({ key })),
        { key: "total", label: "مجموع" },
      ];
      }
    }
  },
  watch:{
    '$i18n.locale'(val){
      this.column();
      // this.localize(val);
    },
  }
  }
  </script>
  <style>
    .table-container {
        /* max-height: 400px; Set the desired height */
        overflow-y: auto; /* Enable vertical scrolling */
    }
    .custom-table td{
        border: 1px solid #dee2e6;
        padding: 2rem 1rem 0;
        /* padding: 4px; */
        text-align: center !important;
        padding-inline-start: 0 !important;
        margin: 5px;
    }
    .custom-table th {
        border: 1px solid #dee2e6;
        /* padding: 0.7rem 0; */
        /* padding: 8px; */
        text-align: center !important;
        /* padding-inline-start: unset !important; */
        padding: 2rem 1rem 0;
        padding-inline-start: 0 !important;
        margin: 5px;
    }
    .custom-table th {
        background-color: #f5f5f5;
        text-align: center !important; /* Center align the content horizontally */
    }
    .custom-table th div {
        padding: 0rem 0.5rem;
    }
    .custom-table thead tr th:nth-child(1) div {
    padding: 0 10rem;
    }
    /* .custom-table1 td{
        padding:8px !important;
        vertical-align:middle !important;
        text-align: center !important; /* Center align the content horizontally 
    }
    .custom-table1 th {
        border: 1px solid #dee2e6; /* Vertical and horizontal lines 
        padding: 5px;
        vertical-align: middle !important; /* Align content in the middle vertically 
        text-align: center !important;
    }
    .custom-table1 th {
        background-color: #f5f5f5;
        text-align: center !important; /* Center align the content horizontally 
    } */
</style>