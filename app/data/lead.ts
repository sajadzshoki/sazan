import type {
  PreferredContactMethod,
  ProjectRequestBudgetRange,
  ProjectRequestFeature,
  ProjectRequestProjectType,
  ProjectRequestTimeline
} from '~~/types';

export type LeadOption<T extends string> = {
  value: T;
  labelKey: string;
  descriptionKey?: string;
};

export const projectTypeOptions = [
  { value: 'website', labelKey: 'startProject.options.projectTypes.website.label', descriptionKey: 'startProject.options.projectTypes.website.description' },
  { value: 'webApplication', labelKey: 'startProject.options.projectTypes.webApplication.label', descriptionKey: 'startProject.options.projectTypes.webApplication.description' },
  { value: 'mobileApplication', labelKey: 'startProject.options.projectTypes.mobileApplication.label', descriptionKey: 'startProject.options.projectTypes.mobileApplication.description' },
  { value: 'ecommerce', labelKey: 'startProject.options.projectTypes.ecommerce.label', descriptionKey: 'startProject.options.projectTypes.ecommerce.description' },
  { value: 'adminPanel', labelKey: 'startProject.options.projectTypes.adminPanel.label', descriptionKey: 'startProject.options.projectTypes.adminPanel.description' },
  { value: 'backendApi', labelKey: 'startProject.options.projectTypes.backendApi.label', descriptionKey: 'startProject.options.projectTypes.backendApi.description' },
  { value: 'somethingElse', labelKey: 'startProject.options.projectTypes.somethingElse.label', descriptionKey: 'startProject.options.projectTypes.somethingElse.description' },
  { value: 'notSure', labelKey: 'startProject.options.projectTypes.notSure.label', descriptionKey: 'startProject.options.projectTypes.notSure.description' }
] as const satisfies readonly LeadOption<ProjectRequestProjectType>[];

export const featureOptions = [
  { value: 'uiUxDesign', labelKey: 'startProject.options.features.uiUxDesign.label', descriptionKey: 'startProject.options.features.uiUxDesign.description' },
  { value: 'authentication', labelKey: 'startProject.options.features.authentication.label', descriptionKey: 'startProject.options.features.authentication.description' },
  { value: 'payments', labelKey: 'startProject.options.features.payments.label', descriptionKey: 'startProject.options.features.payments.description' },
  { value: 'dashboard', labelKey: 'startProject.options.features.dashboard.label', descriptionKey: 'startProject.options.features.dashboard.description' },
  { value: 'adminPanel', labelKey: 'startProject.options.features.adminPanel.label', descriptionKey: 'startProject.options.features.adminPanel.description' },
  { value: 'apiIntegration', labelKey: 'startProject.options.features.apiIntegration.label', descriptionKey: 'startProject.options.features.apiIntegration.description' },
  { value: 'ecommerce', labelKey: 'startProject.options.features.ecommerce.label', descriptionKey: 'startProject.options.features.ecommerce.description' },
  { value: 'aiFeatures', labelKey: 'startProject.options.features.aiFeatures.label', descriptionKey: 'startProject.options.features.aiFeatures.description' },
  { value: 'other', labelKey: 'startProject.options.features.other.label', descriptionKey: 'startProject.options.features.other.description' },
  { value: 'notSure', labelKey: 'startProject.options.features.notSure.label', descriptionKey: 'startProject.options.features.notSure.description' }
] as const satisfies readonly LeadOption<ProjectRequestFeature>[];

export const budgetOptions = [
  { value: 'under-2k', labelKey: 'startProject.options.budgets.under2k.label', descriptionKey: 'startProject.options.budgets.under2k.description' },
  { value: '2k-5k', labelKey: 'startProject.options.budgets.twoToFive.label', descriptionKey: 'startProject.options.budgets.twoToFive.description' },
  { value: '5k-10k', labelKey: 'startProject.options.budgets.fiveToTen.label', descriptionKey: 'startProject.options.budgets.fiveToTen.description' },
  { value: '10k-25k', labelKey: 'startProject.options.budgets.tenToTwentyFive.label', descriptionKey: 'startProject.options.budgets.tenToTwentyFive.description' },
  { value: '25k-plus', labelKey: 'startProject.options.budgets.twentyFivePlus.label', descriptionKey: 'startProject.options.budgets.twentyFivePlus.description' },
  { value: 'not-sure', labelKey: 'startProject.options.budgets.notSure.label', descriptionKey: 'startProject.options.budgets.notSure.description' }
] as const satisfies readonly LeadOption<ProjectRequestBudgetRange>[];

export const timelineOptions = [
  { value: 'asap', labelKey: 'startProject.options.timelines.asap.label', descriptionKey: 'startProject.options.timelines.asap.description' },
  { value: 'within-1-month', labelKey: 'startProject.options.timelines.within1Month.label', descriptionKey: 'startProject.options.timelines.within1Month.description' },
  { value: '1-3-months', labelKey: 'startProject.options.timelines.oneToThreeMonths.label', descriptionKey: 'startProject.options.timelines.oneToThreeMonths.description' },
  { value: 'flexible', labelKey: 'startProject.options.timelines.flexible.label', descriptionKey: 'startProject.options.timelines.flexible.description' },
  { value: 'not-sure', labelKey: 'startProject.options.timelines.notSure.label', descriptionKey: 'startProject.options.timelines.notSure.description' }
] as const satisfies readonly LeadOption<ProjectRequestTimeline>[];

export const preferredContactOptions = [
  { value: 'email', labelKey: 'startProject.options.contactMethods.email.label' },
  { value: 'whatsapp', labelKey: 'startProject.options.contactMethods.whatsapp.label' },
  { value: 'telegram', labelKey: 'startProject.options.contactMethods.telegram.label' },
  { value: 'phone', labelKey: 'startProject.options.contactMethods.phone.label' }
] as const satisfies readonly LeadOption<PreferredContactMethod>[];

export const projectTypeValues = projectTypeOptions.map((option) => option.value);
export const featureValues = featureOptions.map((option) => option.value);
export const budgetValues = budgetOptions.map((option) => option.value);
export const timelineValues = timelineOptions.map((option) => option.value);
export const preferredContactValues = preferredContactOptions.map((option) => option.value);
