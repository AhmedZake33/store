import Vue from 'vue'
import Cookies from 'js-cookie'
import { useUtils as useI18nUtils } from '@core/libs/i18n'
import ToastificationContent from '@core/components/toastification/ToastificationContent'
import Fuse from 'fuse.js'
import store from '@/store/index'
import { RegistrationStatus } from '@/mixins/enums'

const { t } = useI18nUtils()

Vue.mixin({
  computed: {
    importMigrationModal() {
      return store.getters['app/MigrationModal']
    },
    generalLoad() {
      return store.getters['app/generalLoad']
    },
    optionsTags() {
      return {
        'study_status': {
          'name': 'Study Status',
          'name_local': 'tr.Study Status',
          'tags': [
            {
              'id': 'study_status.32',
              'name': 'Studying'
            },
            {
              'id': 'study_status.16',
              'name': 'Graduated'
            },
            {
              'id': 'study_status.64',
              'name': 'Dismissed'
            },
            {
              'id': 'study_status.128',
              'name': 'Transferred Out'
            },
            {
              'id': 'study_status.65536',
              'name': 'Suspended'
            },
            {
              'id': 'study_status.8192',
              'name': 'Excused'
            },
            {
              'id': 'study_status.32768',
              'name': 'Frozen'
            }
          ]
        },
        'gender': {
          'name': 'Gender',
          'name_local': 'tr.Gender',
          'tags': [
            {
              'id': 'gender.1',
              'name': 'Male'
            },
            {
              'id': 'gender.2',
              'name': 'Female'
            },
            {
              'id': 'gender.null',
              'name': 'Gender Not Set'
            }
          ]
        },
        'military': {
          'name': 'Military',
          'name_local': 'tr.Military',
          'tags': [
            {
              'id': 'military.training_done',
              'name': 'Finished Military Training'
            },
            {
              'id': 'military.age_28',
              'name': 'Complete 28 Years'
            },
            {
              'id': 'military.2',
              'name': 'Exempted'
            },
            {
              'id': 'military.4',
              'name': 'Temporary Exempted'
            },
            {
              'id': 'military.8',
              'name': 'Military Done'
            },
            {
              'id': 'military.1048576',
              'name': 'Postponed'
            },
            {
              'id': 'military.4194304',
              'name': 'Postponing'
            },
            {
              'id': 'military.2097152',
              'name': 'Underage'
            },
            {
              'id': 'military.8388608',
              'name': 'Required'
            },
            {
              'id': 'military.33554432',
              'name': 'Not Required'
            },
            {
              'id': 'military.16777216',
              'name': 'Recruited'
            }
          ]
        },
        'excuses': {
          'name': 'Excuse',
          'name_local': 'tr.Excuse',
          'tags': [
            {
              'id': 'excuse.1',
              'name': 'Excuse Year'
            },
            {
              'id': 'excuse.2',
              'name': 'Excuse Term'
            }
          ]
        },
        'scholarships': {
          'name': 'Scholarship Type',
          'name_local': 'tr.Scholarship Type',
          'tags': [
            {
              'id': 'scholarships.1',
              'name': 'Full University Scholarship'
            },
            {
              'id': 'scholarships.2',
              'name': 'Social Scholarship'
            },
            {
              'id': 'scholarships.3',
              'name': 'Siblings Scholarship'
            },
            {
              'id': 'scholarships.4',
              'name': 'Excellence Scholarship'
            },
            {
              'id': 'scholarships.5',
              'name': 'First Rank Scholarship'
            },
            {
              'id': 'scholarships.6',
              'name': 'Second Rank Scholarship'
            },
            {
              'id': 'scholarships.7',
              'name': 'Third Rank Scholarship'
            },
            {
              'id': 'scholarships.8',
              'name': 'Children of Teaching Staff Scholarship'
            },
            {
              'id': 'scholarships.9',
              'name': 'Children of Staff Scholarship'
            },
            {
              'id': 'scholarships.10',
              'name': 'Jordanian Students Scholarship'
            },
            {
              'id': 'scholarships.11',
              'name': 'Yemeni Students Scholarship (Hadhramout Foundation)'
            },
            {
              'id': 'scholarships.12',
              'name': 'Syrian Students Scholarship'
            },
            {
              'id': 'scholarships.13',
              'name': 'Nigerian Students Scholarship'
            },
            {
              'id': 'scholarships.14',
              'name': 'Scholarship of United Nations High Commissioner for Refugees'
            },
            {
              'id': 'scholarships.15',
              'name': 'Postgraduate Scholarship'
            }
          ]
        },
        'pre_university_certificates': {
          'name': 'Scholarship Type',
          'name_local': 'tr.Scholarship Type',
          'tags': [
            {
              'id': 'pre_university_certificates.1',
              'name': 'National High School (Thanaweya Amma)'
            },
            {
              'id': 'pre_university_certificates.2',
              'name': 'Azhar High School'
            },
            {
              'id': 'pre_university_certificates.3',
              'name': 'International Degrees in Egypt'
            },
            {
              'id': 'pre_university_certificates.4',
              'name': 'STEM Schools'
            },
            {
              'id': 'pre_university_certificates.5',
              'name': 'Nile Schools'
            },
            {
              'id': 'pre_university_certificates.6',
              'name': 'Technical Diploma'
            },
            {
              'id': 'pre_university_certificates.7',
              'name': 'Technical Institute'
            },
            {
              'id': 'pre_university_certificates.8',
              'name': 'Saudi Arabia'
            },
            {
              'id': 'pre_university_certificates.9',
              'name': 'United Arab Emirates'
            },
            {
              'id': 'pre_university_certificates.10',
              'name': 'Kuwait'
            },
            {
              'id': 'pre_university_certificates.11',
              'name': 'Palestine'
            },
            {
              'id': 'pre_university_certificates.12',
              'name': 'Bahrain'
            },
            {
              'id': 'pre_university_certificates.13',
              'name': 'Jordan'
            },
            {
              'id': 'pre_university_certificates.14',
              'name': 'Oman'
            },
            {
              'id': 'pre_university_certificates.15',
              'name': 'Qatar'
            },
            {
              'id': 'pre_university_certificates.16',
              'name': 'Djebouti'
            },
            {
              'id': 'pre_university_certificates.17',
              'name': 'Other Country'
            },
            {
              'id': 'pre_university_certificates.18',
              'name': 'Sudan '
            },
            {
              'id': 'pre_university_certificates.19',
              'name': 'Libya '
            }
          ]
        },
        'custom_tags': {
          'name': 'Custom Tags',
          'name_local': 'tr.Custom Tags',
          'tags': [
            {
              'id': 'custom_tags.2',
              'name': 'ًWzara Done'
            }
          ]
        },
        'nationalities': {
          'name': 'Nationality',
          'name_local': 'tr.Nationality',
          'tags': [
            {
              'id': 'nationalities.64',
              'name': 'Egypt'
            },
            {
              'id': 'nationalities.44',
              'name': 'Chad'
            },
            {
              'id': 'nationalities.3',
              'name': 'Aland Islands'
            },
            {
              'id': 'nationalities.45',
              'name': 'Chile'
            },
            {
              'id': 'nationalities.46',
              'name': 'China'
            },
            {
              'id': 'nationalities.13',
              'name': 'Aruba'
            },
            {
              'id': 'nationalities.209',
              'name': 'Sudan'
            },
            {
              'id': 'nationalities.34',
              'name': 'Brunei Darussalam'
            },
            {
              'id': 'nationalities.19',
              'name': 'Bangladesh'
            },
            {
              'id': 'nationalities.47',
              'name': 'Christmas Island'
            },
            {
              'id': 'nationalities.48',
              'name': 'Cocos (Keeling) Islands'
            },
            {
              'id': 'nationalities.42',
              'name': 'Cayman Islands'
            },
            {
              'id': 'nationalities.23',
              'name': 'Belize'
            },
            {
              'id': 'nationalities.22',
              'name': 'Belgium'
            },
            {
              'id': 'nationalities.15',
              'name': 'Austria'
            },
            {
              'id': 'nationalities.215',
              'name': 'Syria'
            },
            {
              'id': 'nationalities.112',
              'name': 'Jordan'
            },
            {
              'id': 'nationalities.194',
              'name': 'Saudi Arabia'
            },
            {
              'id': 'nationalities.16',
              'name': 'Azerbaijan'
            },
            {
              'id': 'nationalities.20',
              'name': 'Barbados'
            },
            {
              'id': 'nationalities.245',
              'name': 'Yemen'
            },
            {
              'id': 'nationalities.171',
              'name': 'Palestine'
            },
            {
              'id': 'nationalities.24',
              'name': 'Benin'
            },
            {
              'id': 'nationalities.31',
              'name': 'Bouvet Island'
            },
            {
              'id': 'nationalities.203',
              'name': 'Somalia'
            },
            {
              'id': 'nationalities.38',
              'name': 'Cambodia'
            },
            {
              'id': 'nationalities.49',
              'name': 'Colombia'
            },
            {
              'id': 'nationalities.206',
              'name': 'South Sudan'
            },
            {
              'id': 'nationalities.163',
              'name': 'Nigeria'
            },
            {
              'id': 'nationalities.25',
              'name': 'Saint Barthelemy'
            },
            {
              'id': 'nationalities.18',
              'name': 'Bahrain'
            },
            {
              'id': 'nationalities.104',
              'name': 'Iraq'
            },
            {
              'id': 'nationalities.33',
              'name': 'British Indian Ocean Territory'
            },
            {
              'id': 'nationalities.32',
              'name': 'Brazil'
            },
            {
              'id': 'nationalities.17',
              'name': 'Bahamas'
            },
            {
              'id': 'nationalities.162',
              'name': 'Niger'
            },
            {
              'id': 'nationalities.210',
              'name': 'Suriname'
            },
            {
              'id': 'nationalities.1',
              'name': 'Afghanistan'
            },
            {
              'id': 'nationalities.39',
              'name': 'Cameroon'
            },
            {
              'id': 'nationalities.67',
              'name': 'Eritrea'
            },
            {
              'id': 'nationalities.126',
              'name': 'Libya'
            },
            {
              'id': 'nationalities.26',
              'name': 'Bermuda'
            },
            {
              'id': 'nationalities.123',
              'name': 'Lebanon'
            },
            {
              'id': 'nationalities.35',
              'name': 'Bulgaria'
            },
            {
              'id': 'nationalities.119',
              'name': 'Kuwait'
            },
            {
              'id': 'nationalities.36',
              'name': 'Burkina Faso'
            },
            {
              'id': 'nationalities.125',
              'name': 'Liberia'
            },
            {
              'id': 'nationalities.10',
              'name': 'Antigua and Barbuda'
            },
            {
              'id': 'nationalities.184',
              'name': 'Russian'
            },
            {
              'id': 'nationalities.6',
              'name': 'Andorra'
            },
            {
              'id': 'nationalities.233',
              'name': 'United Kingdom'
            },
            {
              'id': 'nationalities.234',
              'name': 'United States'
            },
            {
              'id': 'nationalities.4',
              'name': 'Algeria'
            },
            {
              'id': 'nationalities.7',
              'name': 'Angola'
            },
            {
              'id': 'nationalities.40',
              'name': 'Canada'
            },
            {
              'id': 'nationalities.151',
              'name': 'Morocco'
            },
            {
              'id': 'nationalities.21',
              'name': 'Belarus'
            },
            {
              'id': 'nationalities.107',
              'name': 'Italy'
            },
            {
              'id': 'nationalities.9',
              'name': 'Antarctica'
            },
            {
              'id': 'nationalities.28',
              'name': 'Bolivia'
            },
            {
              'id': 'nationalities.168',
              'name': 'Oman'
            },
            {
              'id': 'nationalities.11',
              'name': 'Argentina'
            },
            {
              'id': 'nationalities.58',
              'name': 'Czech Republic'
            },
            {
              'id': 'nationalities.59',
              'name': 'Denmark'
            },
            {
              'id': 'nationalities.65',
              'name': 'El Salvador'
            },
            {
              'id': 'nationalities.213',
              'name': 'Sweden'
            },
            {
              'id': 'nationalities.232',
              'name': 'United Arab Emirates'
            },
            {
              'id': 'nationalities.30',
              'name': 'Botswana'
            },
            {
              'id': 'nationalities.43',
              'name': 'Central African Republic'
            },
            {
              'id': 'nationalities.60',
              'name': 'Djibouti'
            },
            {
              'id': 'nationalities.5',
              'name': 'American Samoa'
            },
            {
              'id': 'nationalities.8',
              'name': 'Anguilla'
            },
            {
              'id': 'nationalities.27',
              'name': 'Bhutan'
            },
            {
              'id': 'nationalities.29',
              'name': 'Bosnia and Herzegovina'
            },
            {
              'id': 'nationalities.41',
              'name': 'Cape Verde'
            },
            {
              'id': 'nationalities.63',
              'name': 'Ecuador'
            },
            {
              'id': 'nationalities.141',
              'name': 'Mauritania'
            },
            {
              'id': 'nationalities.169',
              'name': 'Pakistan'
            },
            {
              'id': 'nationalities.14',
              'name': 'Australia'
            },
            {
              'id': 'nationalities.62',
              'name': 'Dominican Republic'
            },
            {
              'id': 'nationalities.81',
              'name': 'Germany'
            },
            {
              'id': 'nationalities.105',
              'name': 'Ireland'
            },
            {
              'id': 'nationalities.167',
              'name': 'Norway'
            },
            {
              'id': 'nationalities.204',
              'name': 'South Africa'
            },
            {
              'id': 'nationalities.12',
              'name': 'Armenia'
            },
            {
              'id': 'nationalities.37',
              'name': 'Burundi'
            },
            {
              'id': 'nationalities.160',
              'name': 'New Zealand'
            },
            {
              'id': 'nationalities.176',
              'name': 'Philippines'
            },
            {
              'id': 'nationalities.225',
              'name': 'Tunisia'
            },
            {
              'id': 'nationalities.231',
              'name': 'Ukraine'
            },
            {
              'id': 'nationalities.2',
              'name': 'Albania'
            },
            {
              'id': 'nationalities.50',
              'name': 'Comoros'
            },
            {
              'id': 'nationalities.57',
              'name': 'Curaçao'
            },
            {
              'id': 'nationalities.61',
              'name': 'Dominica'
            },
            {
              'id': 'nationalities.66',
              'name': 'Equatorial Guinea'
            },
            {
              'id': 'nationalities.73',
              'name': 'Finland'
            },
            {
              'id': 'nationalities.100',
              'name': 'India'
            },
            {
              'id': 'nationalities.114',
              'name': 'Kenya'
            },
            {
              'id': 'nationalities.132',
              'name': 'Macedonia'
            },
            {
              'id': 'nationalities.149',
              'name': 'Montenegro'
            },
            {
              'id': 'nationalities.157',
              'name': 'Netherlands'
            },
            {
              'id': 'nationalities.175',
              'name': 'Peru'
            },
            {
              'id': 'nationalities.181',
              'name': 'Qatar'
            },
            {
              'id': 'nationalities.183',
              'name': 'Romania'
            },
            {
              'id': 'nationalities.207',
              'name': 'Spain'
            },
            {
              'id': 'nationalities.218',
              'name': 'Tanzania'
            },
            {
              'id': 'nationalities.226',
              'name': 'Turkey'
            },
            {
              'id': 'nationalities_not.64',
              'name': 'Foreigner'
            },
            {
              'id': 'nationalities.null',
              'name': 'Nationality Not Set'
            }
          ]
        }
      }
    }
  },
  methods: {
    downloadURI(uri) {
      const link = document.createElement('a')
      link.download = true
      link.href = uri
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    loadDependentLookups(link, query) {
      store.dispatch('app/dependentLookupsAction', {
        link: link,
        query: query
      })
    },
    openAddAdmission() {
      window.open(`${store.getters['app/universityData'].admission_link}/${this.$i18n.locale}/addadmissionForm?auth_user_id=${this.authUser().id}`, '_blank')
    },
    getColors(index) {
      const colors = [
        '#1da8a2',
        '#29d358',
        '#3de2a3',
        '#c74506',
        '#ff183d',
        '#a1dd5c',
        '#c8c5e2',
        '#cd6408',
        '#63b624',
        '#e9250b',
        '#c56e39',
        '#f6b4c6',
        '#61dfb2',
        '#976715',
        '#bd9b73',
        '#9bad2a',
        '#26b1ab',
        '#344528',
        '#33bda0',
        '#2ab7ca',
        '#6b1096',
        '#aafa03',
        '#4a2fc0',
        '#2c8e2f',
        '#6dec4',
        '#74427e',
        '#1309de',
        '#347d42',
        '#ed8d1e',
        '#5bb8ae'
      ]
      return colors[index]
    },
    makeCategory(data) {
      let options = []
      let lastoptions = []
      let that = this
      if (!data) return []
      options = Object.keys(data)
        .map((key) => [data[key]])
        .map(el => el[0])
      options.forEach(function (element, i) {
        let obj = {}
        obj.category = element.name
        obj.color = that.getColors(i)
        obj.label = element.name + '_' + obj.color
        if (element.tags) {
          element.tags.forEach(item => {
            item['color'] = that.getColors(i)
          })
        }
        obj.tags = element.tags
        lastoptions.push(obj)
      })
      return lastoptions
    },
    getLabel(label) {
      if (label) {
        return label.split('_')[0]
      }
    },
    getColor(label) {
      if (label) {
        return label.split('_')[1]
      }
    },
    chunk(array, chunkSize) {
      const size = Math.ceil(array.length / chunkSize)
      const chunks = new Array(size).fill(0)
      return chunks.map((_, index) => {
        const start = index * chunkSize
        const end = (index + 1) * chunkSize
        return array.slice(start, end)
      })
    },
    toggleMigrationModal() {
      store.commit('app/UPDATE_MODAL', !this.importMigrationModal)
    },
    getLoadText(load) {
      if (!load) {
        return this.$t('Global.empty_text')
      } else {
        return this.$t('Global.inProgress')
      }
    },
    setPageTabs() {
      setTimeout(() => {
        let tab = document.querySelectorAll(
          '.tabs .nav-hidden .nav-tabs.flex-column li'
        )
        if (tab && tab.length) {
          let tabArr = Array.from(tab)
          let tabFormed = []
          tabArr.forEach((element, i) => {
            let text = element.querySelector('li:not(.d-none) a span')
            if (!text) return
            tabFormed[i] = {
              name: text.innerHTML,
              id: i
            }
          })
          if (tabFormed && tabFormed.length) {
            tabFormed = tabFormed.filter((a) => a)
            this.$store.commit('app/DROP_ARRAY', tabFormed)
          } else {
            this.$store.commit('app/DROP_ARRAY', false)
          }
        }
        if (this.$route.query) {
          if (this.$route.query.tabNum || this.$route.query.tabNum == '0') {
            this.setSelectedTab({
              name: '',
              id: Number(this.$route.query.tabNum),
            })
          }
        }
      }, 100)
    },
    setSelectedTab(num) {
      if (!num) return
      this.$store.commit('app/SELECTED_TAB_ID', num.id)
      this.$store.commit('app/UPDATE_RENDER', false)
      setTimeout(() => {
        this.$store.commit('app/UPDATE_RENDER', true)
      }, 30)
    },
    checkIfNeedDrop() {
      setTimeout(() => {
        let init = true
        if (init) {
          let actionBtn = document.querySelector('.customWidth div')
          if (!actionBtn) return
          let links = actionBtn.querySelectorAll('a:not(.dropdown-item)')
          if (links && links.length && links.length > 99) {
            this.$store.commit('app/UPDATE_NEED_DROP', false)
          } else {
            this.$store.commit('app/UPDATE_NEED_DROP', false)
          }
        }
        init = false
      }, 50)
    },
    checkActionBtn() {
      setTimeout(() => {
        let actionBtn = document.querySelectorAll('.customWidth div')
        actionBtn.forEach((element) => {
          if (actionBtn) {
            let links = element.querySelectorAll('a:not(.dropdown-item)')
            if (links && links.length && links.length > 99) {
              let dropdown = element.querySelector('.dropdown-menu')
              links.forEach((element, i) => {
                if (i > 2) {
                  element.classList.add('dropdown-item')
                  dropdown.appendChild(element)
                  let wrapper = document.createElement('li')
                  let parent = element.parentNode
                  parent.replaceChild(wrapper, element)
                  wrapper.appendChild(element)
                }
              })
            }
          }
        })
      }, 300)
    },
    handleResizeGlobal() {
      this.$store.commit('app/UPDATE_WIDTH', window.innerWidth)
      this.$store.commit('app/UPDATE_HEIGHT', window.innerHeight)
    },
    removeObject(data, excepts) {
      excepts.forEach(el => {
        delete data[el]
      })
      return data
    },
    getSelectLabel() {
      return this.$i18n.locale == 'en' ? 'name' : 'name_local'
    },
    setMoreDetails(data) {
      this.$store.commit('app/UPDATE_MORE_DETAILS', data)
    },
    shortMyText(text, n = null) {
      if (text) {
        if (n) {
          if (text.length <= n) return text
          return `${text.substr(0, n)}...`
        }
        if (text.length <= 15) return text
        return `${text.substr(0, 18)}...`
      }
    },
    fuseSearch(options, search) {
      const fuse = new Fuse(options, {
        keys: ['name', 'name_local', 'code'],
        shouldSort: true,
        threshold: 0.3
      })
      return search.length
        ? fuse.search(search)
          .map(({ item }) => item)
        : fuse.list
    },
    hasPermission(permission, checkFromUserAccess = false) {
      if (permission === 'public') return true

      const userAccessPermissions = store.getters['roles/userAccessPermissions']
      if (checkFromUserAccess) {
        return permissions.includes(permission)
      }

      return store.getters['roles/authUserRolesPermissionsName'].includes(permission) || store.getters['roles/authUserPermissionsName'].includes(permission) || (userAccessPermissions && userAccessPermissions.includes(permission))
    },
    hasNoPermission(permission) {
      return store.getters['roles/authUserRolesPermissionsName'].includes(permission)
    },
    getPath(init, to, data) {
      let path = JSON.parse(localStorage.getItem('path')) ? JSON.parse(localStorage.getItem('path')) :
        init.name ?
          [{
            name: init.name,
            path: init.path,
            params: init.query,
            root: true
          }] : []
      localStorage.removeItem('path')

      const pos = path.map(e => e.path)
        .indexOf(to.path)
      if (pos >= 0) {
        path.splice(pos, path.length - pos)
      }

      if (to.meta && to.meta.breadcrumb.length == 1) {
        path = []
      }

      // if (data) {
      //     path.push({name: this.$i18n.locale == 'ar' ? data.name_local : data.name, path: to.path});
      // } else {
      let breadcrumb = null //to.meta && to.meta.breadcrumb.length > 0 ? to.meta.breadcrumb.pop() : null
      path.push({
        name: breadcrumb && breadcrumb.text ? breadcrumb.text : to.name,
        path: to.path,
        params: to.query,
        root: to.params.id ? false : true
      })
      // }

      localStorage.setItem('path', JSON.stringify(path))

      return path
    },

    getPaths(pageDetails) {
      let paths = JSON.parse(localStorage.getItem('path')) ? JSON.parse(localStorage.getItem('path')) : []
      let last = paths[paths.length - 1]

      if (last && last.name.search('add') >= 0) {
        paths[paths.length - 1].name = `${this.$t('Global.add')}`

      } else if (last && last.path.search('edit') >= 0 && pageDetails) {
        if (last.name.search('course') >= 0) {
          paths[paths.length - 1].name = `${this.$t('Global.edit')}   : ${pageDetails.code ? pageDetails.code + ':' : ''}  ${pageDetails.name || pageDetails.name_local}  `
          paths[paths.length - 1].name_local = ` ${this.$t('Global.edit')} :  ${pageDetails.code ? pageDetails.code + ':' : ''}  ${pageDetails.name_local || pageDetails.name} `
        } else {
          paths[paths.length - 1].name = `${this.$t('Global.edit')}   : ${pageDetails.name || pageDetails.name_local}  `
          paths[paths.length - 1].name_local = ` ${this.$t('Global.edit')} :  ${pageDetails.name_local || pageDetails.name} `
        }

      } else if (last && pageDetails) {
        if (last.name.search('course') >= 0) {
          paths[paths.length - 1].name = `${pageDetails.code ? pageDetails.code + ':' : ''}  ${pageDetails.name || pageDetails.name_local}`
          paths[paths.length - 1].name_local = `${pageDetails.code ? pageDetails.code + ':' : ''}  ${pageDetails.name_local || pageDetails.name}`
        } else {
          paths[paths.length - 1].name = `${pageDetails.name || pageDetails.name_local}`
          paths[paths.length - 1].name_local = `${pageDetails.name_local || pageDetails.name}`
        }
      }

      let uniquePaths = []
      let unique_paths = []
      paths.filter(function (el) {
        const isDuplicate = uniquePaths.includes(el.path)
        if (!isDuplicate) {
          uniquePaths.push(el.path)
          unique_paths.push(el)
          return true
        }
        return false
      })

      localStorage.removeItem('path')
      localStorage.setItem('path', JSON.stringify(unique_paths))
      return unique_paths.splice(-4)
    },

    getOptions(lookups, option) {
      let data = []
      if (option && lookups) {
        if (lookups.some(el => el.id == option.id)) {
          data = lookups
        } else {
          data = [...lookups, option]
        }
      } else {
        data = lookups
      }
      return data
    },
    transform(item, includes, excepts) {
      if (includes && item) {
        let arKey
        arKey = Object.keys(item)
          .filter(param => param.includes('local'))
        let enKey
        enKey = arKey.map(key => key.toString()
          .replace('_local', ''))
        if (this.$i18n.locale == 'ar') {
          return Object.entries(item)
            .map(([key, value]) => ({
              key,
              value
            }))
            .filter(param => includes.includes(param.key) && !enKey.includes(param.key) && !param.key.includes('_id'))
        }
        return Object.entries(item)
          .map(([key, value]) => ({
            key,
            value
          }))
          .filter(param => includes.includes(param.key) && !arKey.includes(param.key) && !param.key.includes('_id'))
      }
      if (excepts && item) {
        let arKey
        arKey = Object.keys(item)
          .filter(param => param.includes('local'))
        let enKey
        enKey = arKey.map(key => key.toString()
          .replace('_local', ''))
        if (this.$i18n.locale == 'ar') {
          return Object.entries(item)
            .map(([key, value]) => ({
              key,
              value
            }))
            .filter(param => !excepts.includes(param.key) && !param.key.includes('_id'))
        }
        return Object.entries(item)
          .map(([key, value]) => ({
            key,
            value
          }))
          .filter(param => !excepts.includes(param.key) && !param.key.includes('_id'))
      }
    },
    avatarText(value) {
      if (!value) return ''
      return value.charAt(0)
        .toUpperCase()
    },
    user_photo(id) {
      return `${process.env.VUE_APP_BASE_URL}/photo/${id}?hash=${Math.random()}`
    },
    authUser() {
      if (Cookies.get('user')) {
        const auth = JSON.parse(Cookies.get('user'))
        if (auth) {
          return auth
        }
      }
      return {}
    },

    getStatus(status, state = 'removed') {
      if (state == 'status') {
        if (status === 0 || !status || status == 'incomplete') {
          return {
            color: 'danger',
            name: 'incomplete',
          }
        }
        if (status === 1 || status == 'incomplete') {
          return {
            color: 'danger',
            name: 'danger',
          }
        }
        if (status === 2 || status == 'submitted') {
          return {
            color: 'primary',
            name: 'submitted',
          }
        }
        if (status === 4 || status == 'feedback') {
          return {
            color: 'primary',
            name: 'feedback',
          }
        }
        if (status === 5 || status == 'updated') {
          return {
            color: 'warning',
            name: 'updated',
          }
        }
        if (status === 5 || status == 'examFeesRequired') {
          return {
            color: 'primary',
            name: 'exam fees required',
          }
        }
        if (status === 6 || status == 'examRequired') {
          return {
            color: 'primary',
            name: 'exam required',
          }
        }
        if (status === 7 || status == 'distributionRequired') {
          return {
            color: 'info',
            name: 'distribution required',
          }
        }
        if (status === 9 || status == 'finalFeesRequired') {
          return {
            color: 'primary',
            name: 'final fees required',
          }
        }
        if (status === 10 || status == 'accepted') {
          return {
            color: 'primary',
            name: 'accepted',
          }
        }
        if (status === 10 || status == 'rejected') {
          return {
            color: 'danger',
            name: 'rejected',
          }
        }
        if (status === 12 || status == 'approved') {
          return {
            color: 'success',
            name: 'approved',
          }
        }
      } else if (state == 'published') {
        if (status === 1) {
          return {
            color: 'success',
            name: `${t('Global.yes')}`,
          }
        }
        if (status === 0) {
          return {
            color: 'danger',
            name: `${t('Global.no')}`,
          }
        }
      } else {
        if (status === 2) {
          return {
            color: 'warning',
            name: 'pending',
          }
        }
        if (status === 5) {
          return {
            color: 'warning',
            name: 'pending',
          }
        }
        if (status == 1 || status == 'unpaid') {
          return {
            color: 'danger',
            name: `${t('Global.in_active')}`,
          }
        }
        if (status == 0 || !status || status == 'paid') {
          return {
            color: 'success',
            name: `${t('Global.active')}`,
          }
        }
        if (status == 'new') {
          return {
            color: 'primary',
            name: `${t('Global.active')}`,
          }
        }
      }

      return 'primary'
    },
    getStatusList(translate) {
      const list = [
        {
          label: translate ? 'active' : t('Global.active'),
          value: 0,
        },
        {
          label: translate ? 'in_active' : t('Global.in_active'),
          value: 1,
        },
        // {
        //   label: `${t('Global.pending')}`,
        //   value: 2,
        // },
      ]
      return list
    },
    getReviewsList(status) {
      if (status === 0) {
        return {
          color: 'success',
          name: 'active',
        }
      }
      if (status === 1) {
        return {
          color: 'danger',
          name: 'inactive',
        }
      }

      return 'primary'
    },
    getStatusList2() {
      const list = [
        {
          label: 'Activate',
          value: 0,
        },
        {
          label: 'Inactivate',
          value: 1,
        },
      ]
      return list
    },
    underPostGraduate(flag) {
      if (flag === 1) {
        return {
          color: 'success',
          name: `${t('Global.undergraduate')}`,
        }
      }
      if (flag === 2) {
        return {
          color: 'success',
          name: `${t('Global.postgraduate')}`,
        }
      }
    },
    isAuthUser(user_id) {
      const auth = JSON.parse(Cookies.get('user'))
      if (auth && user_id) {
        return auth.id === user_id
      }
    },

    isAuth(user) {
      const auth = JSON.parse(Cookies.get('user'))
      if (auth && user) {
        return auth.id === user.id
      }
    },
    isEqualStatus(s1, s2) {
      if (s1) {
        return s1.status === s2
      }
    },
    isEqualCurrentStatus(s1, s2) {
      if (s1) {
        return s1.current_status === s2
      }
    },
    isGthCurrentStatus(s1, s2) {
      if (s1) {
        return s1.current_status > s2
      }
    },
    isNotEqualStatus(s1, s2) {
      if (s1) {
        return s1.status !== s2
      }
    },
    isGthStatus(s1, s2) {
      if (s1) {
        return s1.status > s2
      }
    },
    isLthStatus(s1, s2) {
      if (s1) {
        return s1.status < s2
      }
    },
    isLthEqStatus(s1, s2) {
      if (s1) {
        return s1.status <= s2
      }
    },
    ntBr(string) {
      if (string) {
        return string.replace(/\n/g, '<br />')
      }
    },

    compare(oldReport, newReport) {
      let dif = ' '
      Diff.diffWords(oldReport, newReport)
        .forEach(part => {
          dif += part.added ? `<ins style="text-decoration: none; color: #00796B;background: #E0F2F1">${`${part.value} `}</ins>` : part.removed ? `<del style="color: #b30000;background: #fadad7">${`${part.value} `}</del>` : `<span>${`${part.value} `}</span>`
        })
      return dif
    },
    numberWithCommas(x) {
      return x ? x.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',') : x
    },
    toLocalDatetime(input, lang = 'ar', time = false, year = true) {
      const datetime = new Date(input)
      datetime.getTimezoneOffset()
      if (time) {
        if (year) {
          return datetime.toLocaleTimeString(`${lang == 'ar' ? 'ar-EG-u-nu-latn' : 'en-US'}`, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        }
        return datetime.toLocaleTimeString(`${lang == 'ar' ? 'ar-EG-u-nu-latn' : 'en-US'}`, {
          month: 'short',
          day: 'numeric',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        })
      }
      return datetime.toLocaleDateString(`${lang == 'ar' ? 'ar-EG-u-nu-latn' : 'en-US'}`, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },
    toLocalYear(input, lang = 'ar', time = false) {
      const datetime = new Date(input)
      datetime.getTimezoneOffset()
      if (time) {
        return datetime.toLocaleTimeString(`${lang == 'ar' ? 'ar-EG-u-nu-latn' : 'en-US'}`, {
          year: 'numeric',
        })
      }
      return datetime.toLocaleDateString(`${lang == 'ar' ? 'ar-EG-u-nu-latn' : 'en-US'}`, {
        year: 'numeric',
      })
    },
    isGthEqStatus(s1, s2) {
      if (s1) {
        return s1.status >= s2
      }
    },
    getTeamElements(team, role) {
      if (team) {
        const teamByRole = team.all_members.filter(member => member.team_job === role)
        switch (role) {
          case this.constants('LEADER'):
            return teamByRole[0] ? teamByRole[0].id : null
          case this.constants('MEMBER'):
            return teamByRole ? Array.from(teamByRole, member => member.id) : []
          case this.constants('COMMITTEE'):
            return teamByRole ? Array.from(teamByRole, member => member.id) : []
          case this.constants('OBSERVE'):
            return teamByRole ? Array.from(teamByRole, member => member.id) : []
          default:
            return teamByRole
        }
      }
    },
    getRepresentative(Representative) {
      if (Representative) {
        return Representative ? Representative.id : null
      }
    },
    getTrainers(trainers) {
      if (trainers && trainers.length) {
        return Array.from(trainers, member => member.pivot.member_id)
      }
      return []
    },
    getTeamMember(team, role) {
      if (team) {
        const teamByRole = team.all_members.filter(member => member.team_job === role)
        switch (role) {
          case this.constants('LEADER'):
            return teamByRole[0] ? teamByRole[0].id : null
          case this.constants('MEMBER'):
            return teamByRole ? Array.from(teamByRole, member => member.id) : []
          case this.constants('COMMITTEE'):
            return teamByRole ? Array.from(teamByRole, member => member.id) : []
          case this.constants('REVIEWERS'):
            return teamByRole ? Array.from(teamByRole, member => member.id) : []
          case this.constants('OBSERVE'):
            return teamByRole ? Array.from(teamByRole, member => member.id) : []
          default:
            return teamByRole
        }
      }
    },
    hideClass(className) {
      const elementName = this.$el.querySelectorAll(`${className}`)
      elementName.forEach(element => {
        element.style.display = 'none'
      })
    },
    // checkIfDone(){
    // //   let elementName = this.$el.querySelectorAll('#parent_true');

    // //   if(this.$store.getters['submission/allDocuments'][1].folders.length == elementName.length) return true;
    // },
    checkSubIfExist(uploadedDocs, subDocs) {
      const shortUploadedDocs = []
      const shortSubDocs = []
      uploadedDocs.forEach(element => {
        shortUploadedDocs.push(element.short_name)
      })
      subDocs.forEach(element => {
        shortSubDocs.push(element.short_name)
      })
      const found = shortUploadedDocs.some(r => shortSubDocs.indexOf(r) >= 0)
      return found
    },
    getCountOfUploadsFiles(uploadedDocs, short_names, form) {
      const count = []
      if (uploadedDocs) {
        short_names.forEach((element, index) => {
          const document = this.getDocByShortName(uploadedDocs, element.short_name)
          if (document && element.form == form) {
            count.push(document)
          }
        })
        return count.length
      }
    },
    getUploadsFiles(uploadedDocs, short_names) {
      if (uploadedDocs) {
        short_names.forEach((element, index) => {
          const document = this.getDocByShortName(uploadedDocs, element.short_name)
          short_names[index].document = document || false
        })
        return short_names
      }
    },
    documentsDone(uploadedDocs, short_names) {
      if (uploadedDocs) {
        let status = true
        short_names.forEach((element, index) => {
          const document = this.getDocByShortName(uploadedDocs, element.short_name)
          if (!document) {
            status = false
          }
        })
        return status
      }
    },
    checkIfExist(docs, short_name) {
      const existFiles = []
      docs.forEach(element => {
        existFiles.push(element.short_name)
      })
      return existFiles.includes(short_name)
    },
    getDocSize(docs, short_name) {
      let document = ''
      docs.forEach(element => {
        if (element.short_name == short_name) {
          document = `(${element.size})`
        }
      })
      return document
    },
    getDocDate(docs, short_name) {
      let document = ''
      docs.forEach(element => {
        if (element.short_name == short_name) {
          document = `(${this.toLocalDatetime(element.updated_at)})`
        }
      })
      return document
    },
    getDocId(docs, short_name) {
      let document = null
      docs.forEach(element => {
        if (element.short_name == short_name) {
          document = element.id
        }
      })
      return document
    },
    getDocByShortName(docs, short_name) {
      let document = false
      docs.forEach(element => {
        if (element.short_name === short_name) {
          document = element
        }
      })
      return document
    },
    getDocUrl(docs, short_name) {
      let document = null
      docs.forEach(element => {
        if (element.short_name == short_name) {
          document = element.url
        }
      })
      return document
    },
    documentType(index) {
      const APPROVAL_ORGANIZATION = 1
      const AUTHORIZATION_ORGANIZATION = 2
      const INTERNAL_FIRST_REGULATION = 3
      const FINANCIAL_LETTER = 4

      const STRATEGIC_PLAN = 5
      const SELF_STUDY = 6
      const PROGRAMS_FIRST_DESCRIPTION = 7
      const PROGRAM_REPORTS = 8
      const INTERNAL_REGULATION = 9
      const PROGRAMS_HIGH_DESCRIPTION = 10
      const YEAR_REPORTS = 11
      const ORGANIZATION_VIDEO = 12
      const EXTENSION_SELF_REPORT = 13
      const IMPROVEMENT_PLAN = 14
      const SUPPORT_FILE = 15

      switch (index) {
        case APPROVAL_ORGANIZATION:
          return 'APPROVAL_ORGANIZATION'
        case AUTHORIZATION_ORGANIZATION:
          return 'AUTHORIZATION_ORGANIZATION'
        case INTERNAL_FIRST_REGULATION:
          return 'INTERNAL_FIRST_REGULATION'
        case FINANCIAL_LETTER:
          return 'FINANCIAL_LETTER'
        case STRATEGIC_PLAN:
          return 'STRATEGIC_PLAN'
        case SELF_STUDY:
          return 'SELF_STUDY'
        case PROGRAMS_FIRST_DESCRIPTION:
          return 'PROGRAMS_FIRST_DESCRIPTION'
        case PROGRAM_REPORTS:
          return 'PROGRAM_REPORTS'
        case INTERNAL_REGULATION:
          return 'INTERNAL_REGULATION'
        case PROGRAMS_HIGH_DESCRIPTION:
          return 'PROGRAMS_HIGH_DESCRIPTION'
        case YEAR_REPORTS:
          return 'YEAR_REPORTS'
        case ORGANIZATION_VIDEO:
          return 'ORGANIZATION_VIDEO'
        case EXTENSION_SELF_REPORT:
          return 'EXTENSION_SELF_REPORT'
        case IMPROVEMENT_PLAN:
          return 'IMPROVEMENT_PLAN'
        case SUPPORT_FILE:
          return 'SUPPORT_FILE'
      }
    },
    mandatoryDocs(mandatoryFiles, uploadedFile) {
      const document = []
      if (mandatoryFiles[0]) {
        mandatoryFiles[0].documents.forEach(reqFile => {
          uploadedFile.forEach(uploadedFile => {
            if (reqFile.short_name == uploadedFile.short_name) {
              document.push(reqFile)
            }
          })
        })
      }
      return document
    },

    showConstants(type, key) {
      const showTypes = [
        {
          id: 1,
          name: 'DEFUALT_APPROVAL',
        },
        {
          id: 2,
          name: 'SUBMISSION_UPDATE',
        },
        {
          id: 3,
          name: 'FINANCE_UPDATE',
        },
        {
          id: 4,
          name: 'TEAM_UPDATE',
        },
        {
          id: 8,
          name: 'VISIT_UPDATE',
        },
        {
          id: 5,
          name: 'MEMBER_APPROVAL',
        },
        {
          id: 6,
          name: 'REPORT_APPROVAL',
        },
        {
          id: 7,
          name: 'REPORT_APPROVAL_TEAM_COMMITTEE',
        },
        {
          id: 9,
          name: 'LEADER_APPROVAL',
        },
        {
          id: 10,
          name: 'NO_CHANGE',
        },
      ]
      if (type == 'array') {
        return showTypes
      }
      if (type == 'num') {
        if (key) {
          const filtered = showTypes.find(el => el.id == key)
          return filtered.name
        }
      } else if (type == 'string') {
        if (key) {
          const filtered = showTypes.find(el => el.name == key)
          return filtered.id
        }
      }
    },

    // tr_taskConstants: function (type, key) {
    //     let tasks = [
    //         {id: 1, name: 'coach'},
    //         {id: 2, name: 'trainee'},
    //         {id: 3, name: 'plan_manager'},
    //     ];
    //     if (type == 'array') {
    //         return tasks;
    //     } else if (type == 'num') {
    //         if (key) {
    //             let filtered = tasks.find(el => el.id == key);
    //             return filtered.name;
    //         }
    //     } else if (type == 'string') {
    //         if (key) {
    //             let filtered = tasks.find(el => el.name == key);
    //             return filtered.id;
    //         }
    //     }
    // },

    taskConstants(type, key, system = 1) {
      let tasks = []
      if (system == 3) {
        tasks = [
          {
            id: 1,
            name: 'COACH_TASK',
          },
          {
            id: 2,
            name: 'TRAINEE_TASK',
          },
          {
            id: 14,
            name: 'TRAINING_MANAGER_TASK',
          },
          {
            id: 5,
            name: 'VICE_TASK',
          },
          {
            id: 6,
            name: 'PRESIDENT_TASK',
          },
          {
            id: 7,
            name: 'FINANCE_TASK',
          },
        ]
      } else {
        tasks = [
          {
            id: 1,
            name: 'TEAM_TASK',
          },
          {
            id: 2,
            name: 'ORGANIZATION_TASK',
          },
          {
            id: 3,
            name: 'COMMITTEE_TASK',
          },
          {
            id: 4,
            name: 'ACCREDITATION_TASK',
          },
          {
            id: 5,
            name: 'VICE_TASK',
          },
          {
            id: 6,
            name: 'PRESIDENT_TASK',
          },
          {
            id: 7,
            name: 'FINANCE_TASK',
          },
          {
            id: 8,
            name: 'MANAGER_TASK',
          },
          {
            id: 9,
            name: 'TEAM_COMMITTEE_TASK',
          },
          {
            id: 11,
            name: 'TEAM_LEADER_TASK',
          },
          {
            id: 12,
            name: 'MANAGER_ACCREDITATION_TASK',
          },
          {
            id: 13,
            name: 'PUBLIC_RELATIONS_LEADER_TASK',
          },
        ]
      }
      if (type == 'array') {
        return tasks
      }
      if (type == 'num') {
        if (key) {
          const filtered = tasks.find(el => el.id == key)
          return filtered.name
        }
      } else if (type == 'string') {
        if (key) {
          const filtered = tasks.find(el => el.name == key)
          return filtered.id
        }
      }
    },

    updateConstants(type, key) {
      const updates = [
        {
          id: 1,
          name: 'DOCUMENTS_UPDATE',
        },
        {
          id: 2,
          name: 'REPORT_UPDATE',
        },
        {
          id: 3,
          name: 'ADD_COMMENT',
        },
        {
          id: 4,
          name: 'TAKE_DECISION',
        },
        {
          id: 0,
          name: 'NO_CHANGE',
        },
      ]
      if (type == 'array') {
        return updates
      }
      if (type == 'num') {
        if (key) {
          const filtered = updates.find(el => el.id == key)
          return filtered.name
        }
      } else if (type == 'string') {
        if (key) {
          const filtered = updates.find(el => el.name == key)
          return filtered.id
        }
      }
    },

    evaluatorCheck(arr, system = 1) {
      const checkArray = this.evaluatorConstants('string', arr, system)
      const AuthArray = this.$store.state.evaluation.evaluator
      if (AuthArray) {
        return checkArray.some(type => AuthArray.some(f => f == type))
      }
    },

    createdByConstants(type, key, system = 1) {
      let evaluators = []
      if (system == 3) {
        evaluators = [
          {
            id: 1,
            name: 'COACH_TYPE',
          },
          {
            id: 2,
            name: 'TRAINEE_TYPE',
          },
          {
            id: 4,
            name: 'TRAINING_MANAGER_TYPE',
          },
          {
            id: 5,
            name: 'VICE_TYPE',
          },
          {
            id: 6,
            name: 'PRESIDENT_TYPE',
          },
          {
            id: 12,
            name: 'FINANCE_TYPE',
          },
        ]
      } else {
        evaluators = [
          {
            id: 1,
            name: 'TEAM_TYPE',
          },
          {
            id: 2,
            name: 'ORGANIZATION_TYPE',
          },
          {
            id: 3,
            name: 'COMMITTEE_TYPE',
          },
          {
            id: 4,
            name: 'ACCREDITATION_TYPE',
          },
          {
            id: 5,
            name: 'VICE_TYPE',
          },
          {
            id: 6,
            name: 'PRESIDENT_TYPE',
          },
          {
            id: 7,
            name: 'MANAGER_TYPE',
          },
          {
            id: 8,
            name: 'LEADER_TYPE',
          },
          {
            id: 9,
            name: 'MEMBER_TYPE',
          },
          {
            id: 10,
            name: 'REVIEWER_TYPE',
          },
          {
            id: 11,
            name: 'MANAGER_ACCREDITATION_TYPE',
          },
          {
            id: 12,
            name: 'FINANCE_TYPE',
          },
        ]
      }
      if (type == 'array') {
        return evaluators
      }
      if (type == 'num') {
        if (key) {
          const filtered = evaluators.find(el => el.id == key)
          return filtered.name
        }
      } else if (type == 'string' && typeof key === 'string') {
        if (key) {
          const filtered = evaluators.find(el => el.name == key)
          return filtered ? filtered.id : null
        }
      } else if (type == 'string' && Array.isArray(key)) {
        if (key) {
          const ids = evaluators.filter(type => key.some(f => f == type.name))
          return ids.map(el => el.id)
        }
        // if (key) {
        //   let filtered = evaluators.find(el => el.name == key);
        //   return filtered.id;
        // }
      }
    },

    evaluatorConstants(type, key, system = 1) {
      let evaluators = []
      if (system == 3) {
        evaluators = [
          {
            id: 1,
            name: 'COACH_TYPE',
          },
          {
            id: 2,
            name: 'TRAINEE_TYPE',
          },
          {
            id: 13,
            name: 'TRAINING_MANAGER_TYPE',
          },
          {
            id: 5,
            name: 'VICE_TYPE',
          },
          {
            id: 6,
            name: 'PRESIDENT_TYPE',
          },
          {
            id: 12,
            name: 'FINANCE_TYPE',
          },
        ]
      } else {
        evaluators = [
          {
            id: 1,
            name: 'TEAM_TYPE',
          },
          {
            id: 2,
            name: 'ORGANIZATION_TYPE',
          },
          {
            id: 3,
            name: 'COMMITTEE_TYPE',
          },
          {
            id: 4,
            name: 'ACCREDITATION_TYPE',
          },
          {
            id: 5,
            name: 'VICE_TYPE',
          },
          {
            id: 6,
            name: 'PRESIDENT_TYPE',
          },
          {
            id: 7,
            name: 'MANAGER_TYPE',
          },
          {
            id: 8,
            name: 'LEADER_TYPE',
          },
          {
            id: 9,
            name: 'MEMBER_TYPE',
          },
          {
            id: 10,
            name: 'REVIEWER_TYPE',
          },
          {
            id: 11,
            name: 'MANAGER_ACCREDITATION_TYPE',
          },
          {
            id: 12,
            name: 'FINANCE_TYPE',
          },
        ]
      }
      if (type == 'array') {
        return evaluators
      }
      if (type == 'num') {
        if (key) {
          const filtered = evaluators.find(el => el.id == key)
          return filtered.name
        }
      } else if (type == 'string' && typeof key === 'string') {
        if (key) {
          const filtered = evaluators.find(el => el.name == key)
          return filtered ? filtered.id : null
        }
      } else if (type == 'string' && Array.isArray(key)) {
        if (key) {
          const ids = evaluators.filter(type => key.some(f => f == type.name))
          return ids.map(el => el.id)
        }
        // if (key) {
        //   let filtered = evaluators.find(el => el.name == key);
        //   return filtered.id;
        // }
      }
    },

    constants(key) {
      const REFUSE_STATUS = 0
      const FILL_INFO_STATUS = 1
      const FINANCE_STATUS = 2
      const QUALITY_STATUS = 3
      const ACTIVE_VISIT_STATUS = 4
      const ACTIVE_TEAM_STATUS = 5
      const APPROVE_STATUS = 6
      const UPDATE_REQUIREMENT_STATUS = 7
      const REPRESENTATIVE_REFUSE_STATUS = 8
      const REPRESENTATIVE_APPROVE_VISIT_STATUS = 9
      const REPRESENTATIVE_APPROVE_TEAM_STATUS = 10
      const NOT_ACTIVE_TEAM_STATUS = 11
      const FINAL_APPROVE_STATUS = 12
      const PRESIDENT_APPROVE_STATUS = 13
      const PRESIDENT_REFUSE_STATUS = 14
      const FINANCE_APPROVE_STATUS = 15
      const FINANCE_REFUSE_STATUS = 16
      const NOT_EXCUSED__STATUS = 0
      const EXCUSED_STATUS = 1

      const PRE_APPROVE_STATUS = 1
      const PRE_REFUSE_STATUS = 0

      const LEADER = 1
      const MEMBER = 2
      const OBSERVE = 5
      const COMMITTEE = 6
      const REVIEWERS = 7

      switch (key) {
        case 'REFUSE_STATUS':
          return Number(REFUSE_STATUS)
        case 'PRESIDENT_APPROVE_STATUS':
          return Number(PRESIDENT_APPROVE_STATUS)
        case 'PRESIDENT_REFUSE_STATUS':
          return Number(PRESIDENT_REFUSE_STATUS)
        case 'FILL_INFO_STATUS':
          return FILL_INFO_STATUS
        case 'FINANCE_STATUS':
          return FINANCE_STATUS
        case 'QUALITY_STATUS':
          return QUALITY_STATUS
        case 'ACTIVE_VISIT_STATUS':
          return ACTIVE_VISIT_STATUS
        case 'ACTIVE_TEAM_STATUS':
          return ACTIVE_TEAM_STATUS
        case 'APPROVE_STATUS':
          return APPROVE_STATUS
        case 'UPDATE_REQUIREMENT_STATUS':
          return UPDATE_REQUIREMENT_STATUS
        case 'REPRESENTATIVE_REFUSE_STATUS':
          return REPRESENTATIVE_REFUSE_STATUS
        case 'REPRESENTATIVE_APPROVE_VISIT_STATUS':
          return REPRESENTATIVE_APPROVE_VISIT_STATUS
        case 'REPRESENTATIVE_APPROVE_TEAM_STATUS':
          return REPRESENTATIVE_APPROVE_TEAM_STATUS
        case 'FINANCE_APPROVE_STATUS':
          return Number(FINANCE_APPROVE_STATUS)
        case 'FINANCE_REFUSE_STATUS':
          return Number(FINANCE_REFUSE_STATUS)
        case 'NOT_ACTIVE_TEAM_STATUS':
          return NOT_ACTIVE_TEAM_STATUS
        case 'FINAL_APPROVE_STATUS':
          return FINAL_APPROVE_STATUS
        case 'NOT_EXCUSED__STATUS':
          return NOT_EXCUSED__STATUS
        case 'EXCUSED_STATUS':
          return EXCUSED_STATUS
        case 'PRE_APPROVE_STATUS':
          return PRE_APPROVE_STATUS
        case 'PRE_REFUSE_STATUS':
          return PRE_REFUSE_STATUS
        case 'LEADER':
          return LEADER
        case 'MEMBER':
          return MEMBER
        case 'OBSERVE':
          return OBSERVE
        case 'COMMITTEE':
          return COMMITTEE
        case 'REVIEWERS':
          return REVIEWERS
        default:
          return null
      }
    },
    getTypeOfUser(type) {
      switch (type) {
        case 1:
          return `${this.$t('Global.member')}`
        case 2:
          return `${this.$t('Global.Creator')}`
        case 3:
          return `${this.$t('Global.committee_type')}`
        case 4:
          return `${this.$t('Global.ACCREDITATION_TYPE')}`
        case 5:
          return `${this.$t('Global.VICE_TYPE')}`
        case 6:
          return `${this.$t('Global.PRESIDENT_TYPE')}`
        case 7:
          return `${this.$t('Global.MANAGEMENT_TYPE')}`
        case 8:
          return `${this.$t('Global.team')}`
        default:
          return null
      }
    },
    getTypeOfReq(key) {
      switch (key) {
        case 'TRAINEE_COORDINATOR':
          return 1
        case 'PRE_UNIVERSITY_COORDINATOR':
          return 2
        case 'HIGHER_EDUCATION_COORDINATOR':
          return 3
        case 'HIGH_REVIEWER':
          return 4
        case 'PRE_REVIEWER':
          return 5
        default:
          return null
      }
    },

    evConstants(key) {
      const REJECT_STATUS = 0
      const TEAM_TYPE = 1
      const ORGANIZATION_TYPE = 2
      const COMMITTEE_TYPE = 3
      const ACCREDITATION_TYPE = 4
      const VICE_TYPE = 5
      const PRESIDENT_TYPE = 6
      const MANAGER_TYPE = 7
      const REVIEWER_TYPE = 10

      switch (key) {
        case 'APPROVE_STATUS':
          return APPROVE_STATUS
        case 'REJECT_STATUS':
          return REJECT_STATUS
        case 'TEAM_TYPE':
          return TEAM_TYPE
        case 'ORGANIZATION_TYPE':
          return ORGANIZATION_TYPE
        case 'COMMITTEE_TYPE':
          return COMMITTEE_TYPE
        case 'ACCREDITATION_TYPE':
          return ACCREDITATION_TYPE
        case 'VICE_TYPE':
          return VICE_TYPE
        case 'PRESIDENT_TYPE':
          return PRESIDENT_TYPE
        case 'MANAGER_TYPE':
          return MANAGER_TYPE
        case 'REVIEWER_TYPE':
          return REVIEWER_TYPE
        default:
          return null
      }
      const APPROVE_STATUS = 1
    },

    isImage(ex) {
      if (ex) {
        const extension = ex.toLowerCase()
        if (extension == 'jpg' || extension == 'png' || extension == 'gif' || extension == 'tif' || extension == 'jpeg' || extension == 'bmp') {
          return true
        }
      }
    },

    validation(message = null, type = 0) {
      let Valid = []
      if (!message) {
        message = `${this.$t('Validation.selectFiled')}`
      }
      if (message) {
        message = this.$t(`${message}`)
      }
      if (type == 0) {
        Valid = {
          rule: 'required',
          message
        }
      }
      if (type == 1) {
        Valid = {
          rule: 'required',
          message
        }
      }
      if (type == 'textarea') {
        Valid = {
          rule: { regex: /\S$|\S[\s\S]*\S+/ },
          message
        }
      }
      if (type == 'checkbox') {
        Valid = {
          rule: 'required',
          message
        }
      }
      if (type == 'n_id') {
        Valid = {
          rule: { regex: /[0-9]{14,14}/ },
          message
        }
      }
      if (type == 'email') {
        Valid = {
          rule: { regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ },
          message
        }
      }
      if (type == 'phone') {
        Valid = {
          rule: {
            regex: /^[0-9]{7,15}$/,
            message: 'test'
          },
          message
        }
      }
      if (type == 'ssn') {
        Valid = {
          regex: /^.{1,3}$/,
        }
      }
      return Valid
    },
    validationMessages(message = null) {
      if (!message) {
        message = `${this.$t('Validation.selectFiled')}`
      }
      return this.$t(message)
      // this.$t(message)
    },
    validationRules(type = 0) {
      let rules = null
      if (type == 0 || type == 1) {
        rules = 'required'
      }
      if (type == 'textarea') {
        rules = { regex: /\S$|\S[\s\S]*\S+/ }
      }
      if (type == 'checkbox') {
        rules = 'required'
      }
      if (type == 'n_id') {
        rules = { regex: /[0-9]{14,14}/ }
      }
      if (type == 'email') {
        rules = { regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ }
      }
      if (type == 'phone') {
        rules = {
          regex:
            /(297|93|244|1264|358|355|376|971|54|374|1684|1268|61|43|994|257|32|229|226|880|359|973|1242|387|590|375|501|1441|591|55|1246|673|975|267|236|1|61|41|56|86|225|237|243|242|682|57|269|238|506|53|5999|61|1345|357|420|49|253|1767|45|1809|1829|1849|213|593|20|291|212|34|372|251|358|679|500|33|298|691|241|44|995|44|233|350|224|590|220|245|240|30|1473|299|502|594|1671|592|852|504|385|509|36|62|44|91|246|353|98|964|354|972|39|1876|44|962|81|76|77|254|996|855|686|1869|82|383|965|856|961|231|218|1758|423|94|266|370|352|371|853|590|212|377|373|261|960|52|692|389|223|356|95|382|976|1670|258|222|1664|596|230|265|60|262|264|687|227|672|234|505|683|31|47|977|674|64|968|92|507|64|51|63|680|675|48|1787|1939|850|351|595|970|689|974|262|40|7|250|966|249|221|65|500|4779|677|232|503|378|252|508|381|211|239|597|421|386|46|268|1721|248|963|1649|235|228|66|992|690|993|670|676|1868|216|90|688|886|255|256|380|598|1|998|3906698|379|1784|58|1284|1340|84|678|681|685|967|27|260|263)(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{4,14}$/,
        }
      }
      if (type == 'ssn') {
        rules = {
          regex: /^.{1,3}$/,
          message: 'oh no oh no',
        }
      }

      return rules
    },

    getLevelText(level) {
      return `approvals_status_${level}_ensure`
    },
    getRefuseText(level) {
      return `refuse_status_${level}`
    },
    getLastReportStatus(evNote, allNotes, noteId) {
      if (allNotes.length > 1) {
        const note = allNotes.find(note => note.level == evNote.level)
        if (note.id == noteId) {
          return true
        }
        return false
      }
      return false
    },
    oneLineToLines(N, string) {
      if (string) {
        const app = string.split(' ')
        const arrayApp = []
        let stringApp = ''
        app.forEach((sentence, index) => {
          stringApp += `${sentence} `

          if ((index + 1) % N === 0) {
            arrayApp.push(stringApp)
            stringApp = ''
          } else if (app.length === index + 1 && stringApp !== '') {
            arrayApp.push(stringApp)
            stringApp = ''
          }
        })
        return arrayApp
      }
    },
    getLastStatus(current, lastStatus) {
      if (lastStatus && current.status in [1, 2, 3, 4, 5, 12]) {
        return true
      }
      return false
    },
    getLevelOut(level) {
      return `approvals_status_${level}`
    },
    getpreAnswer(index) {
      switch (index) {
        case 1:
          return {
            name: `${this.$t('Global.level_1')}`,
            type: 'success',
            color: '#2eb85c',
          }
        case 2:
          return {
            name: `${this.$t('Global.level_2')}`,
            type: 'info',
            color: '#39f',
          }
        case 3:
          return {
            name: `${this.$t('Global.level_3')}`,
            type: 'warning',
            color: '#f9b115',
          }
        case 4:
          return {
            name: `${this.$t('Global.level_4')}`,
            type: 'danger',
            color: '#e55353',
          }
        default:
          return {
            name: `${this.$t('Global.noAnswer')}`,
            type: 'danger',
            color: '#e2e2e2',
          }
          break
      }
    },
    getpreAnswerAsk(index) {
      switch (index) {
        case 1:
          return {
            name: `${this.$t('Global.level_1')}`,
            type: 'info',
            color: '#2eb85c',
          }
        case 2:
          return {
            name: `${this.$t('Global.level_2')}`,
            type: 'danger',
            color: '#39f',
          }
        case 3:
          return {
            name: `${this.$t('Global.level_3')}`,
            type: 'warning',
            color: '#f9b115',
          }
        case 4:
          return {
            name: `${this.$t('Global.level_4')}`,
            type: 'danger',
            color: '#e55353',
          }
        default:
          return {
            name: `${this.$t('Global.noAnswer')}`,
            type: 'danger',
            color: '#e2e2e2',
          }
          break
      }
    },
    getPreAnswer(index) {
      switch (index) {
        case 1:
          return {
            name: `${this.$t('Global.ok')}`,
            type: 'success',
            color: '#2eb85c',
          }
        case 0:
          return {
            name: `${this.$t('Global.notOk')}`,
            type: 'danger',
            color: '#e55353',
          }
        default:
          return {
            name: `${this.$t('Global.noAnswer')}`,
            type: 'danger',
            color: '#e2e2e2',
          }
          break
      }
    },
    getAnswer(index) {
      switch (index) {
        case 1:
          return {
            name: `${this.$t('Global.ok')}`,
            type: 'success',
            color: '#2eb85c',
          }
        case 0:
          return {
            name: `${this.$t('Global.notOk')}`,
            type: 'danger',
            color: '#e55353',
          }
        case 30:
          return {
            name: `${this.$t('Global.agree')}`,
            type: 'success',
            color: '#2eb85c',
          }
        case 31:
          return {
            name: `${this.$t('Global.midagree')}`,
            type: 'info',
            color: '#39f',
          }
        case 32:
          return {
            name: `${this.$t('Global.disagree')}`,
            type: 'warning',
            color: '#f9b115',
          }
        case 33:
          return {
            name: `${this.$t('Global.disApply')}`,
            type: 'danger',
            color: '#e55353',
          }
        default:
          return {
            name: `${this.$t('Global.noAnswer')}`,
            type: 'danger',
            color: '#e2e2e2',
          }
          break
      }
    },
    getLogo(type) {
      switch (type) {
        case 1:
          return '/img/avatars/uni.png'
        case 2:
          return '/img/avatars/uni.png'
        case 3:
          return '/img/avatars/prog.png'
        default:
          return '/img/avatars/prog.png'
          break
      }
    },

    errorToast(message) {
      if (typeof message === 'object' && (message.en || message.ar)) {
        message = this.$i18n.locale == 'en' ? message.en : message.ar
      }
      this.$toast({
        component: ToastificationContent,
        position: this.$i18n.locale == 'en' ? 'top-left' : 'top-right',
        props: {
          title: this.$t('error'),
          variant: 'danger',
          text: `${this.$t(message) || this.$t('Global.errorMessage')}`,
        },
      })
    },
    convertToArray(obj) {
      if (obj) {
        return Object.keys(obj)
          .map((key) => [key, obj[key]])
      }

    },
    convertArrayToObject(arr) {
      var object = arr.reduce(
        (obj, item) => Object.assign(obj, { [item.name]: item.value }), {})
      return object
    },
    collectData(arr) {
      if (arr) {
        let result = []
        let numOr0 = n => isNaN(n) ? 0 : n
        arr.forEach(element => {
          let temp = {}
          temp['faculty'] = element[0]
          temp['faculty_local'] = element[1]
          let arr2 = element[1]
          temp['programs'] = arr2.filter(x => !(x.eg_paid_studing == null && x.eg_total_studing == null && x.eg_unpaid_studing == null))
          temp['programsGrad'] = arr2.filter(x => !(x.eg_paid_grad == null && x.eg_total_grad == null && x.eg_unpaid_grad == null))

          // let eg_paid_grad = arr2.map(data => {
          //     return data['eg_paid_grad'];
          // }).reduce((a, b) => numOr0(a) + numOr0(b), 0)
          // let eg_total_grad = arr2.map(data => {
          //     return data['eg_total_grad'];
          // }).reduce((a, b) => numOr0(a) + numOr0(b), 0)

          let eg_paid_studing = arr2.map(data => {
            return data['eg_paid_studing']
          })
            .reduce((a, b) => numOr0(a) + numOr0(b), 0)

          let eg_total_studing = arr2.map(data => {
            return data['eg_total_studing']
          })
            .reduce((a, b) => numOr0(a) + numOr0(b), 0)
          let eg_unpaid_studing = arr2.map(data => {
            return data['eg_unpaid_studing']
          })
            .reduce((a, b) => numOr0(a) + numOr0(b), 0)
          let eg_total_students_paid_studing = arr2.map(data => {
            return data['eg_total_students_paid_studing']
          })
            .reduce((a, b) => numOr0(a) + numOr0(b), 0)
          let eg_total_students_studing = arr2.map(data => {
            return data['eg_total_students_studing']
          })
            .reduce((a, b) => numOr0(a) + numOr0(b), 0)
          let eg_total_students_partiallypaid_studing = arr2.map(data => {
            return data['eg_total_students_partiallypaid_studing']
          })
            .reduce((a, b) => numOr0(a) + numOr0(b), 0)
          let eg_total_students_notpaid_studing = arr2.map(data => {
            return data['eg_total_students_notpaid_studing']
          })
            .reduce((a, b) => numOr0(a) + numOr0(b), 0)
          let E_wallet = arr2.map(data => {
            return data['E_wallet']
          })
            .reduce((a, b) => numOr0(a) + numOr0(b), 0)
          // let eg_total_grad_students = arr2.map(data => {
          //     return data['eg_total_grad_students'];
          // }).reduce((a, b) => numOr0(a) + numOr0(b), 0)
          // let eg_paid_grad_students = arr2.map(data => {
          //     return data['eg_paid_grad_students'];
          // }).reduce((a, b) => numOr0(a) + numOr0(b), 0)
          // let eg_notpaid_grad_students = arr2.map(data => {
          //     return data['eg_notpaid_grad_students'];
          // }).reduce((a, b) => numOr0(a) + numOr0(b), 0)
          // let eg_partiallypaid_grad_students = arr2.map(data => {
          //     return data['eg_partiallypaid_grad_students'];
          // }).reduce((a, b) => numOr0(a) + numOr0(b), 0)

          temp['eg_paid_studing'] = eg_paid_studing
          temp['eg_unpaid_studing'] = eg_unpaid_studing
          temp['eg_total_studing'] = eg_total_studing
          temp['E_wallet'] = E_wallet
          // temp['eg_paid_grad'] = eg_paid_grad
          // temp['eg_unpaid_grad'] = eg_unpaid_grad
          // temp['eg_total_grad'] = eg_total_grad
          temp['eg_total_students_paid_studing'] = eg_total_students_paid_studing
          temp['eg_total_students_studing'] = eg_total_students_studing
          temp['eg_total_students_partiallypaid_studing'] = eg_total_students_partiallypaid_studing
          temp['eg_total_students_notpaid_studing'] = eg_total_students_notpaid_studing
          // temp['eg_total_grad_students'] = eg_total_grad_students
          // temp['eg_paid_grad_students'] = eg_paid_grad_students
          // temp['eg_notpaid_grad_students'] = eg_notpaid_grad_students
          // temp['eg_partiallypaid_grad_students'] = eg_partiallypaid_grad_students

          result.push(temp)

        })
        return result

      }
    },
    collectDataGrad(arr) {
      if (arr) {
        let result = []
        let numOr0 = n => isNaN(n) ? 0 : n
        arr.forEach(element => {
          let temp = {}
          temp['faculty'] = element[0]
          let arr2 = element[1]
          temp['programs'] = arr2.filter(x => !(x.eg_paid_grad == null && x.eg_paid_studing == null && x.eg_total_grad == null && x.eg_total_studing == null && x.eg_unpaid_grad == null && x.eg_unpaid_studing == null))
          temp['programsGrad'] = arr2.filter(x => !(x.eg_paid_grad == null && x.eg_total_grad == null && x.eg_unpaid_grad == null))

          let eg_unpaid_grad = arr2.map(data => {
            return data['eg_unpaid_grad']
          })
            .reduce((a, b) => numOr0(a) + numOr0(b), 0)
          let eg_paid_grad = arr2.map(data => {
            return data['eg_paid_grad']
          })
            .reduce((a, b) => numOr0(a) + numOr0(b), 0)
          let eg_total_grad = arr2.map(data => {
            return data['eg_total_grad']
          })
            .reduce((a, b) => numOr0(a) + numOr0(b), 0)
          let eg_total_grad_students = arr2.map(data => {
            return data['eg_total_grad_students']
          })
            .reduce((a, b) => numOr0(a) + numOr0(b), 0)
          let eg_paid_grad_students = arr2.map(data => {
            return data['eg_paid_grad_students']
          })
            .reduce((a, b) => numOr0(a) + numOr0(b), 0)
          let eg_notpaid_grad_students = arr2.map(data => {
            return data['eg_notpaid_grad_students']
          })
            .reduce((a, b) => numOr0(a) + numOr0(b), 0)
          let eg_partiallypaid_grad_students = arr2.map(data => {
            return data['eg_partiallypaid_grad_students']
          })
            .reduce((a, b) => numOr0(a) + numOr0(b), 0)

          temp['eg_paid_grad'] = eg_paid_grad
          temp['eg_unpaid_grad'] = eg_unpaid_grad
          temp['eg_total_grad'] = eg_total_grad
          temp['eg_total_grad_students'] = eg_total_grad_students
          temp['eg_paid_grad_students'] = eg_paid_grad_students
          temp['eg_notpaid_grad_students'] = eg_notpaid_grad_students
          temp['eg_partiallypaid_grad_students'] = eg_partiallypaid_grad_students

          result.push(temp)

        })
        return result

      }
    },
    successToast(message) {
      this.$toast({
        component: ToastificationContent,
        position: this.$i18n.locale == 'en' ? 'top-left' : 'top-right',
        props: {
          title: this.$t('Success'),
          variant: 'success',
          text: `${this.$t(message) || this.$t('Global.successMessage')}`,
        },
      })
    },
    errorPopupWithBack(message) {
      this.$swal({
        text: `${this.$t(message)}`,
        icon: 'error',
        confirmButtonText: `${this.$t('Go Back')}`,
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      })
        .then(result => {
          if (result.value) {
            this.$router.go(-1)
          }
        })
    },
    sanitizeArabic($event) {
      const arabic = /[\u0600-\u06FF0-9_(@./#&+,:;.،"') IVXivx]/
      if (!arabic.test($event.key)) {
        $event.preventDefault()
      }
    },
    // only accept letters
    isLetter($event) {
      const char = /^[\u0600-\u06FFA-Za-z]+$/
      if (!char.test($event.key)) {
        $event.preventDefault()
      }
    },
    // only letters and space
    isEnglishLettersAndSpace($event) {
      const char = /^[A-Za-z ]+$/
      if (!char.test($event.key)) {
        $event.preventDefault()
      }
    },
    isArabicLettersAndSpace($event) {
      const char = /^[\u0600-\u06FF ]+$/
      if (!char.test($event.key)) {
        $event.preventDefault()
      }
    },
    writeNumber($event) {
      const numbers = /[0-9.]/
      if (!numbers.test($event.key)) {
        $event.preventDefault()
      }
    },
    writeNumberDecimal($event) {
      const numbers = /[0-9.]/
      if (!numbers.test($event.key)) {
        $event.preventDefault()
      }
    },
    sanitizeNumber($event) {
      const numbers = /[0-9]/
      if (numbers.test($event.key)) {
        $event.preventDefault()
      }
    },
    sanitizeEnglish($event) {
      const arabic = /[\u0600-\u06FF]/
      if (arabic.test($event.key)) {
        $event.preventDefault()
      }
    },
    clean(obj) {
      for (var propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined) {
          delete obj[propName]
        }
      }
      return obj
    },
    sanitizePhone($event) {
      const numbers = /[0-9+]/
      if (!numbers.test($event.key)) {
        $event.preventDefault()
      }
    },
    handleBackendError(errors) {
      return errors
    },
    getBackendFieldError(errors, fieldName) {
      const errorMessage = errors ? (errors[fieldName] ? errors[fieldName][0][this.$i18n.locale] : '') : ''
      return errorMessage
    },
    isEqual(obj1, obj2) {
      var props1 = Object.getOwnPropertyNames(obj1)
      var props2 = Object.getOwnPropertyNames(obj2)
      if (props1.length != props2.length) {
        return false
      }
      for (var i = 0; i < props1.length; i++) {
        let val1 = obj1[props1[i]]
        let val2 = obj2[props1[i]]
        let isObjects = this.isObject(val1) && this.isObject(val2)
        if (isObjects && !isEqual(val1, val2) || !isObjects && val1 !== val2) {
          return false
        }
      }
      return true
    },
    isObject(object) {
      return object != null && typeof object === 'object'
    },
    //  we will use this function to store filter in Query params of screens
    updateFilterQueryParams(filter, type) {
      //For not rerequest api again when change order or direction
      if (type != 'sort') {
        delete filter['order_by']
        delete filter['order_direction']
      }

      let query = { ...this.$route.query, ...filter }
      Object.keys(query)
        .forEach(key => {
          if (query[key] === null || query[key] === '' || (query[key] && query[key].length == 0)) {
            delete query[key]
          }
        })
      this.$router.replace({ 'query': query })
        .catch(() => {
        })
    },
    resetFilterQueryParams(except) {
      let currentTerm
      let query = { ...this.$route.query, ...{} }
      if (except) {
        currentTerm = except.find(el => {
          return Object.keys(query)
            .some(qu => {
              return el == qu
            })
        })
      }
      Object.keys(query)
        .forEach(key => {
          if (key != currentTerm && key != 'removed' && key != 'export') {
            delete query[key]
          }
        })
      this.$router.replace({ 'query': query })
        .catch(() => {
        })
    },
    getFilterFromQueryParams(filter, page = 1, perPage = 10, search = '') {
      const containsAll = ['removed', 'export'].every(element => {
        return Object.keys(this.$route.query)
          .includes(element)
      })
      if ((Object.keys(this.$route.query).length && (this.$route.query['page'] || this.$route.query['perPage'])) || Object.keys(this.$route.query).length && (Object.keys(this.$route.query).length > 2 || (Object.keys(this.$route.query).length == 2 && !containsAll))) {
        // to fill filter object
        let routeParamValue
        let filterUpdated = false
        if (filter != undefined) {
          for (const [key] of Object.entries(filter)) {
            routeParamValue = this.$route.query[key]
            if (routeParamValue || routeParamValue == 0) {
              filterUpdated = true
              if (Array.isArray(filter[key])) {
                if (Array.isArray(routeParamValue)) {
                  routeParamValue.forEach(element => {
                    filter[key].push(this.getIntValue(element))
                  })
                } else {
                  filter[key].push(this.getIntValue(routeParamValue))
                }
              } else {
                filter[key] = this.getIntValue(routeParamValue)
              }
            }
          }
        }

        // for page and perPage filter
        if (this.$route.query['page']) {
          page = this.$route.query['page']
        }
        if (this.$route.query['perPage']) {
          perPage = this.$route.query['perPage']
        }
        // for search text
        if (this.$route.query['search']) {
          search = this.$route.query['search']
          filterUpdated = true
        }
        return {
          page: page,
          perPage: perPage,
          search: search,
          filterUpdated: filterUpdated
        }
      }
      return false
    },
    // == 'faculty' ? 'faculty_id' : ctx.sortBy
    sortingChanged(ctx) {
      this.updateFilterQueryParams({
        order_by: ctx.sortBy,
        order_direction: this.$route.query['order_direction'] ? this.$route.query['order_direction'] == 'DESC' ? 'ASC' : 'DESC' : ctx.sortDesc ? 'DESC' : 'ASC'
      }, 'sort')
    },
    getIntValue(val) {
      return val >= 0 ? parseInt(val) : val
    },
    getTranslatedName(object) {
      if (!object) return '-'
      if (this.$i18n.locale == 'en') {
        return object.name
      }
      return object.name_local
    },
    getTranslatedNameFromObject(object) {
      if (!object) return '-'
      if (this.$i18n.locale == 'en') {
        return object.name
      }
      return object.name_local
    },
    getTranslatedNameFound(object) {
      let name = '-'
      if (this.$i18n.locale == 'en') {
        if (object.name) {
          name = object.name
        } else if (object.name_local) name = object.name_local
      } else {
        if (object.name_local) {
          name = object.name_local
        } else if (object.name) name = object.name
      }
      return name
    },
    handleStatusNaming(lookups, id) {
      let statusName = null
      lookups.statuses.forEach(element => {
        if (this.$i18n.locale == 'ar' && element.name_local) {
          element.id == id ? statusName = element.name_local : false
        } else {
          element.id == id ? statusName = element.name : false
        }
      })
      return statusName
    },
    handleColorNaming(lookups, id) {
      let color = null
      lookups.statuses.forEach(element => {
        element.id == id ? color = element.color : 'light-primary'
      })
      return color
    },
    handleNewInstallmentCalculation(installments, total, key = 'value_local', changedInstallment = 0) {
      let otherInstallment = changedInstallment == 0 ? 1 : 0

      if (!installments[0][key]) {
        installments[changedInstallment][key] = total
        installments[otherInstallment][key] = 0
      } else {
        /* if (installments[changedInstallment][key] - installments[otherInstallment][key] >= 0) {
                     installments[changedInstallment][key] = total - installments[otherInstallment][key]
                 }*/

        /*if (installments[otherInstallment][key] - installments[changedInstallment][key] >= 0) {
                    installments[otherInstallment][key] = total - installments[changedInstallment][key]
                }*/

        /*if(installments[0][key] > total){
                    installments[0][key] = total
                }else if(installments[0][key] < 0){
                    installments[0][key] = 0
                }

                if(installments[1][key] > total){
                    installments[1][key] = total
                }else if(installments[1][key] < 0){
                    installments[1][key] = 1
                }*/

        if (total - installments[changedInstallment][key] >= 0) {
          installments[otherInstallment][key] = total - installments[changedInstallment][key]
        }

        if (installments[changedInstallment][key] > total) {
          installments[changedInstallment][key] = total
          installments[otherInstallment][key] = 0
        }

      }
      return installments
    },
    getTabFilterData(index) {
      const data = store.getters['app/tabsFilter']
      return data['' + index] ?? {}
    },
    resetTabFilterData() {
      store.dispatch('app/resetTabsFilter')

    },
    getUserLiveData() {
      store.dispatch('app/GET_USER_LIVE_DATA')
        .then(response => {
        })
    },
    getUniversityData() {
      store.dispatch('app/GET_UNIVERSITY_DATA')
        .then(response => {
          const favicon = document.getElementById('favicon')
          if (response && response.data && response.data.length) {
            response.data.forEach(element => {
              if (element.name === 'favicon') {
                favicon.href = element.value
              }
            })
          }

          return response
        })
    },
    getFileTypeClass(type) {
      switch (type) {
        case 'pdf':
          return 'pdf-type'
        case 'xls':
        case 'xlsx':
          return 'excel-type'
        case 'doc':
        case 'docx':
          return 'word-type'
        case 'ppt':
        case 'pptx':
          return 'powerpoint-type'
        case 'jpeg':
        case 'jpg':
        case 'png':
        case 'gif':
          return 'image-type'
        default:
          return 'unknown-type'
      }
    },
    isValidURL(string) {
      var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)
      return (res !== null)
    },
    getTicketStatusBadge(status) {
      let className = ''
      switch (status.id) {
        case 0:
          className = 'primary'
          break
        case 1:
        case 2:
          className = 'warning'
          break
        case 4:
          className = 'success'
          break
        case 3:
          className = 'danger'
          break
        default:
          className = 'default'
      }

      return {
        label: this.getTranslatedName(status),
        class: className,
      }
    },
    deleteConfirmPopup(callbackFunctionConfirm) {
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
      })
        .then(result => {
          if (result.value) {
            callbackFunctionConfirm()
          }
        })
    },
    successDeleteAlert() {
      this.$swal({
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        title: this.$t('Global.deleted'),
      })
    },
    errorDeleteAlert(timer = 1500, errorMessage = this.$t('Global.deleted')) {
      this.$swal({
        icon: 'error',
        timer: timer,
        showConfirmButton: false,
        title: errorMessage,
      })
    },
    getRegistrationStatusBadgeColor(status) {
      switch (status) {
        case RegistrationStatus.Improve: // improve
        case RegistrationStatus.Complete: // complete
          return 'info'
        case RegistrationStatus.Repeat: // repeat
          return 'light-danger'
        case RegistrationStatus.Fresh: // fresh
          return 'light-dark'
        case RegistrationStatus.Registered: // registered
          return 'success'
        case RegistrationStatus.RegisterRequest:
        case RegistrationStatus.AddRequest:
        case RegistrationStatus.DropRequest:
        case RegistrationStatus.ExcuseRequest:
        case RegistrationStatus.WithdrawRequest:
          return 'warning'
        case RegistrationStatus.Withdrawn:
        case RegistrationStatus.Dropped:
        case RegistrationStatus.Excused:
        case RegistrationStatus.Incomplete:
        case RegistrationStatus.Absent:
        case RegistrationStatus.Punished:
        case RegistrationStatus.Banned:
        case RegistrationStatus.Audit:
        case RegistrationStatus.ForcedWithdrawn:
          return 'danger'
        default:
          return 'dark'
      }
    },
    wrapText(text) {
      if (typeof text == 'string') {
        if (store.getters['app/width'] <= 1800 && store.getters['app/width'] > 1540 && store.getters['app/width'] != 0) {
          if (text.length >= 25 && store.state.appConfig.layout.isRTL) {
            return `${text.substr(0, 22)}...`
          } else {
            return `${text.substr(0, 17)}...`
          }
        } else if (store.getters['app/width'] <= 1540 && store.getters['app/width'] > 770 && store.getters['app/width'] > 990 && store.getters['app/width'] != 0) {
          if (text.length >= 25 && store.state.appConfig.layout.isRTL) {
            return `${text.substr(0, 22)}...`
          } else if (text.length >= 15 && !store.state.appConfig.layout.isRTL) {
            return `${text.substr(0, 12)}...`
          }
        } else if (store.getters['app/width'] <= 990 && store.getters['app/width'] > 770 && store.getters['app/width'] != 0) {
          if (text.length >= 20 && store.state.appConfig.layout.isRTL) {
            return `${text.substr(0, 17)}...`
          } else if (text.length >= 12 && !store.state.appConfig.layout.isRTL) {
            return `${text.substr(0, 9)}...`
          }
        } else if (store.getters['app/width'] <= 770 && store.getters['app/width'] > 640 && store.getters['app/width'] != 0) {
          if (text.length >= 10 && store.state.appConfig.layout.isRTL) {
            return `${text.substr(0, 7)}...`
          } else if (text.length >= 8 && !store.state.appConfig.layout.isRTL) {
            return `${text.substr(0, 5)}...`
          }
        }

        return `${text}`;
      } else {
        return text;
      }
    }
  },
})
