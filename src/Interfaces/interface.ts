import { RefObject } from "react";
import { MessageType } from "./Enums";
export interface IExperience {
  id?: number
  role: IJobTiltes;
  company: string;
  from_year: string;
  to_year: string;
  from_month: string;
  to_month: string;
  address_info: string;
  remote: boolean;
  employmentType: boolean;
  present: boolean;
  country: ICountry;
  city: IGovernment;
  province: IDepartment;
  village: IVillage;
  details: string;
}
export interface IVolunteer {
  id?: number
  role: string;
  company: string;
  from_year: string;
  to_year: string;
  from_month: string;
  to_month: string;
  country: ICountry;
  city: IGovernment;
  details?: string;
}
export interface ICourse {
  id?: number
  course_name: string;
  institution: string;
  course_type: boolean;
  from_year: string;
  to_year: string;
  from_month: string;
  to_month: string;
  country: ICountry;
  city: IGovernment;
  details: string;
}
export interface ILanguage {
  id?: number
  language?: string;
  proficiency?: string
}
export interface ICertification {
  id?: number
  name?: string;
  issuer?: string;
  date?: string;
}
export interface IUniversityAndInsts {
  id?: number,
  ar_name?: string,
  en_name?: string,
  edu_type_id?: number
}
export interface ISpecialty {
  id?: number,
  ar_name?: string,
  en_name?: string,
  education_id?: number,
  institute_id?: number
}
export interface IJobTitleDescription {
  id?: number,
  ar_name?: string,
  en_name?: string,
  jobTitle_Id?: number,
}
export interface IEducation {
  id?: number
  edu_level: string;
  edu_type: boolean;
  university: IUniversityAndInsts;
  institute: IUniversityAndInsts;
  specialty: ISpecialty;
  college: IUniversityAndInsts;
  country: ICountry;
  city: IGovernment;
  from_year: string;
  to_year: string;
}
export interface ILinks {
  id?: number
  link: string;
}

export interface IResume {
  full_name?: string;
  city?: IGovernment;
  country?: ICountry
  village?: IVillage
  province?: IDepartment
  address_info?: string
  phone?: string
  email?: string
  summary?: string;
  birth_date?: number | string;
  birth_place?: string;
  nationality?: string;
  marital_status?: string;
  military_status?: string;
  proficiency?: string;
  languages?: ILanguage[]
  work_History?: IExperience[];
  volunteers?: IVolunteer[];
  courses?: ICourse[];
  skills?: ISkills[];
  education?: IEducation[];
  personal_Links?: string[];
  image?: IImage
  attach?: ICVAttach
  certifications?: ICertification[];
}
export interface tempProps {
  ref?: RefObject<HTMLDivElement | null>;
  selectedTempId?: number
  resume?: IResume
  disableScale?: boolean
  color?: string,
  accentColor?: string,
  image?: IImage
  withCol?: boolean,
  withImg?: boolean,
  userTemps?: any[]
}
export interface ICVAttach {
  id?: number
  attach_type_id?: number
  path?: string
}
export interface ICandidateLogin {
  email: string;
  password: string;
}
export interface IPreviousDesignation {
  id_previous?: number
  previous_designation?: string;
  previous_company?: string;
  from_month?: number;
  from_year?: number;
  to_month?: number;
  to_year?: number;
}
export interface ICandidateRegister {
  Name?: string;
  Email?: string;
  Mobile?: string;
  Password?: string;
  role_id?: number;
  Confirm_Password?: string;
}

export interface IGrade {
  id?: number;
  Grade_Name?: string;
}
export interface IEduType {
  id?: number;
  Ar_Name?: string;
  En_Name?: string;
}
export interface INotifyPeriod {
  id?: number;
  NoticePeriod?: string;
}

export interface ICountry {
  id?: number;
  ar_name?: string;
  en_name?: string;
}
export interface ICity {
  id?: number;
  ar_name?: string;
  en_name?: string;
}
export interface IDepartment {
  id?: number;
  ar_name?: string;
  en_name?: string;
  city_id?: number;
}
export interface ISpecialty {
  id?: number;
  ar_name?: string;
  en_name?: string;
  education_id?: number;
  institute_id?: number;
}
export interface IJobTiltes {
  id?: number;
  ar_name?: string;
  en_name?: string;
}
export interface IGovernment {
  id?: number;
  ar_name?: string;
  en_name?: string;
}
export interface IVillage {
  id?: number;
  ar_name?: string;
  en_name?: string;
}
export interface IQualifs {
  id?: number;
  ar_name?: string;
  en_name?: string;
}
export interface IQualifsType {
  id?: number;
  ar_name?: string;
  en_name?: string;
  edu_type_id?: number;

}
export interface ISkills {
  id?: number;
  ar_Name?: string;
  en_Name?: string;
}
export interface IRole {
  id?: number;
  roleArName?: string;
  roleEnName?: string;
  is_active?: boolean
}

export interface ICVData {
  temp_id?: number,
  color?: string
  heading?: string,
  work_History?: string,
  education?: string,
  languages?: string,
  courses?: string,
  skills?: string,
  personal_Links?: string,
  is_paid?: boolean
  image?: IImage
  attach?: ICVAttach
}
export interface IImage {
  title?: string,
  description?: string,
  base64Image?: string,
  fileExtension?: string
}

export const EMAIL_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
export const NAME_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';

export interface IUser {
  user_id?: number
  name?: string;
  email?: string;
  role_id?: number
}
export interface IMessageDetail {
  code: number
  message: string
}

export interface IApiResponseMessage {
  messageType: MessageType
  messageTypeName: string
  messages: IMessageDetail[]
}

export interface IJobSections {
  id: number,
  ar_name: string,
  en_name: string,
}
export interface IJobTypes {
  id: number,
  ar_name: string,
  en_name: string,
}
export interface IJobData {
  id: number,
  ar_name: string,
  en_name: string,
  agency_name: string,
  section_id: number,
  type_id: number,
  comment: string,
  working_from: string,
  duration: string,
  experience: string,
  salary_range: string,
  placement_fee: string,
  getPaid_fee: string,
  notice_period: string,
  noOf_vacancy: number,
  cv_limit: number,
  agency_limit: number,
  special_notes: string,
  location: string,
  isPriority: boolean,
  job_description: string,
  job_Sections: IJobSections,
  job_Types: IJobTypes
}


export interface ICandidateJobs {
  id?: number,
  job_id?: number,
  status_id?: number,
  status_ar_name?: string,
  status_en_name?: string

}
export interface ICandidate {
  id?: number,
  jobs?: ICandidateJobs[]
  ar_name?: string,
  en_name?: string,
  email?: string,
  mobile_number?: string,
  city?: string,
  current_company?: string,
  current_job_title?: string,
  experience_month?: number,
  experience_year?: number,
  current_salary?: string,
  nationality?: string,
  notice_period?: string,
  cv?: null,
  job_ar_name?: string,
  job_en_name?: string,
  agency_name?: string,
  status_id?: number,
  is_viewed?: boolean,
  status_ar_name?: string,
  status_en_name?: string
  image?: {
    title?: string,
    description?: string,
    base64Image?: string,
    fileExtension?: string
  }
}


export interface IDuration {
  id?: number,
  ar_name?: string,
  en_name?: string,
  days?: number
}
export interface IDurationPrices {
  id?: number,
  ar_name?: string,
  en_name?: string,
  price?: number,
  discount?: number,
  duration_id?: number,
  description?: string
}
