import Vue from 'vue';
import Vuex from 'vuex';

// Modules
import app from './app';
import appConfig from './app-config';
import verticalMenu from './vertical-menu';

//quality
import courseFileModule from './modules/quality/courseFile/courseFile';

// users
import usersModule from './modules/user_settings/users/user';
import studentModule from './modules/student/students/student';
import employeeModule from './modules/user_settings/employees/employee';
import instructorModule from './modules/user_settings/instructors/instructor';
import equivalentReportModule from './modules/student/reports/equivalent.js';

// program
import programModule from './modules/academic_settings/programs/program';
import facultyModule from './modules/academic_settings/faculities/faculity';
import bylawModule from './modules/academic_settings/bylaws/bylaw';
import courseModule from './modules/academic_settings/courses/course';
import departmentModule from './modules/academic_settings/departments/departments';

// study

import offeringModule from './modules/study/offerings/offering';
import termModule from './modules/study/terms/term';
import registrationModule from './modules/study/registrations/registration';
import sectionModule from './modules/study/sections/section';

// examination

import examModule from './modules/examination/exams/exams';
import examSlotModule from '@/store/modules/administration/exam_slots/slots';
import examsSchedulesModule from '@/store/modules/examination/exams_schedules/exams_schedules';
import examsDeliveryModule from '@/store/modules/examination/exams_delivery/exams_delivery';
import examsAbsencesModule from '@/store/modules/examination/exams_absences/exams_absences';
import examsPunishmentsModule from '@/store/modules/examination/exams_punishments/exams_punishments';
import examsBarcodesModule from '@/store/modules/examination/exams_barcodes/exams_barcodes';
import examPapersTypeModule from '@/store/modules/examination/papers_types/papers_types.js';
import trainingsModule from '@/store/modules/student_activities/trainings';
import tagsModule from '@/store/modules/administration/tags/tags'

// financial

import paymentModule from './modules/student/payments/payment';
import transactionModule from './modules/student/transactions/transaction';
import creditModule from './modules/student/credits/credit';

// system
import roleModule from './modules/user_settings/roles/role';
import logModule from './modules/administration/logs/log';
import markCategoryModule from './modules/administration/markCategories/markCategory';
import BankModule from './modules/administration/banks/bank';
import currencyModule from './modules/administration/banks/currency';
import bankInfoModule from './modules/administration/banks/bankInfo';
import markModule from './modules/administration/marks/mark';
import dashboardModule from './modules/system/dashboard';
import lookupsModule from './modules/system/lookups';
import archiveModule from './modules/administration/archive/archive';
import certificateModule from '@/store/modules/student/certificates/certificate';
import applicantModule from '@/store/modules/student/applicants/applicant';
import applicantNewModule from '@/store/modules/student/applicants/applicantNew';
import questionModule from '@/store/modules/quality/questions/question';
import formModule from '@/store/modules/quality/forms/form';
import graduate_questionnaireModule from '@/store/modules/quality/graduateQuestionnaires/questionnaire';
import student_questionnaireModule from '@/store/modules/quality/studentQuestionnaires/questionnaire';
import faculty_questionnaireModule from '@/store/modules/quality/facultyQuestionnaires/questionnaire';
import projectModule from '@/store/modules/research/projects/projects';
import publicationModule from '@/store/modules/research/publications/publications';
import thesesModule from '@/store/modules/research/theses/theses';
import termStageModule from './modules/administration/termStage/termStage';
import settingModule from './modules/administration/management/settings';
import ticketGroupsModule from './modules/administration/ticket_groups/ticket_groups';
import chatModule from './modules/request/chat/chat';
import groupModule from './modules/administration/groups/group';
import yearModule from './modules/system/year';
import yearPaymentModule from './modules/payments/year';

//Quality
import questionnairesTypesModule from '@/store/modules/quality/questionnaires_types/questionnaires_types';
import questionnairesQuestionsModule from '@/store/modules/quality/questionnaires_questions/questionnaires_questions';
import questionnairesModule from '@/store/modules/quality/questionnaires/questionnaires';
import outcomesModule from '@/store/modules/quality/coursespecs/outcomes';
import topicsModule from './modules/quality/coursespecs/topics';
import methodsModule from './modules/quality/coursespecs/methods';
import assessmentModule from './modules/quality/coursespecs/assessments';

// students modules
import offeringsRegistrationModule from './modules/student/registrations/offerings_registration';
import scholarshipsModule from './modules/student/scholarships/scholarships';

// services module
import serviceModules from './modules/student/services/service';

// Services Settings moudles
import certificateSettingsModule from './modules/services_settings/certificates_settings/certificates_settings'
import certificatesDatesModule from './modules/services_settings/certificates_settings/certificates_dates'

//Excuse Module
import excuseModule from '@/store/modules/study/excuses/excuses';

//Excuse Module
import buildingModule from '@/store/modules/administration/buildings/buildings';
import locationModule from '@/store/modules/administration/locations/locations';
import slotModule from '@/store/modules/administration/slots/slots';
import calendarScheduleModule from '@/store/modules/study/calendars/schedule';
import academicAdvisorsModule from '@/store/modules/study/academic_advisors/academic_advisors';

//Control Module
import courseOfferingModule from './modules/control/course_offerings/course_offering';
import controlStudentModule from './modules/control/students/student';
import internalTransferModule from './modules/study/transfer/internalTransfer';
import externalTransferModule from './modules/study/transfer/externalTransfer';
import paymentItemsModule from './modules/student/payments/payment_items';
import controlResultsModule from './modules/control/control_results/control_results';
import gradesRecheckModule from './modules/control/grades_recheck/grades_recheck';

//my work space
import myOfferingModule from './modules/my_work_space/offerings/offerings';

// hotels module
import Hotelmodule from './modules/hotel/hotel';

//report module
import reportModule from './modules/reports/report';

//emtyaz
import EmtyazModlue from './modules/emtyaz/emtyaz';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        packageVersion: process.env.PACKAGE_VERSION || '0'
    },
    getters: {
        appVersion: (state) => {
            return state.packageVersion
        }
    },
    modules: {
        app,
        appConfig,
        verticalMenu,
        users: usersModule,
        employees: employeeModule,
        students: studentModule,
        years: yearModule,
        yearPayments: yearPaymentModule,
        instructors: instructorModule,
        programs: programModule,
        faculties: facultyModule,
        courses: courseModule,
        bylaws: bylawModule,
        chats: chatModule,
        roles: roleModule,
        log: logModule,
        settings: settingModule,
        dashboard: dashboardModule,
        archive: archiveModule,
        offerings: offeringModule,
        courseFile: courseFileModule,
        terms: termModule,
        registrations: registrationModule,
        offeringsRegistrations: offeringsRegistrationModule,
        exams: examModule,
        payments: paymentModule,
        lookups: lookupsModule,
        transactions: transactionModule,
        credits: creditModule,
        departments: departmentModule,
        certificates: certificateModule,
        applicants: applicantModule,
        applicantsNew: applicantNewModule,
        questions: questionModule,
        forms: formModule,
        graduate_questionnaires: graduate_questionnaireModule,
        student_questionnaires: student_questionnaireModule,
        faculty_questionnaires: faculty_questionnaireModule,
        projects: projectModule,
        publications: publicationModule,
        theses: thesesModule,
        sections: sectionModule,
        markCategories: markCategoryModule,
        marks: markModule,
        termStages: termStageModule,
        certificateSettings: certificateSettingsModule,
        excuses: excuseModule,
        buildings: buildingModule,
        locations: locationModule,
        slots: slotModule,
        examSlots: examSlotModule,
        calendars: calendarScheduleModule,
        groups: groupModule,
        banks: BankModule,
        bankInfos: bankInfoModule,
        currencies: currencyModule,
        academicAdvisors: academicAdvisorsModule,
        courseOfferings: courseOfferingModule, //control course offering
        controlStudents: controlStudentModule, //control students
        controlResults : controlResultsModule,
        examsSchedules: examsSchedulesModule,
        examsDelivery: examsDeliveryModule,
        examsAbsences: examsAbsencesModule,
        examsPunishments: examsPunishmentsModule,
        questionnairesTypes: questionnairesTypesModule,
        questionnairesQuestions: questionnairesQuestionsModule,
        questionnaires: questionnairesModule,
        internalTransfer: internalTransferModule,
        externalTransfer : externalTransferModule,
        trainings: trainingsModule,
        examsBarcodes :examsBarcodesModule,
        ticketGroups : ticketGroupsModule,
        paymentItems: paymentItemsModule,
        outcomes:outcomesModule,
        topics:topicsModule,
        methods:methodsModule,
        assessments:assessmentModule,
        myOfferings : myOfferingModule,
        services :serviceModules,
        gradesRecheck: gradesRecheckModule,
        Hotel: Hotelmodule,
        Report:reportModule,
        papersTypes : examPapersTypeModule,
        equivalentReport:equivalentReportModule,
        scholarships:scholarshipsModule,
        tags: tagsModule,
        certificatesDates: certificatesDatesModule,
        Emtyaz:EmtyazModlue,
    },
})
