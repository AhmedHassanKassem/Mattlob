export interface ICVAttach {
  name: string;
  size: string;
  type: string;
  LastModifiedDate: string;
  FileAsBase64: string;
}
export interface ICandidateLogin {
  account_email: string;
  account_password: string;
}
export interface IPreviousDesignation {
  id_previous?:number
  previous_designation?: string;
  previous_company?: string;
  from_month?: number;
  from_year?: number;
  to_month?: number;
  to_year?: number;
}
export interface ICandidate {
  full_name: string;
  userTypeId: number;
  CV_Attach: ICVAttach;
  account_email: string;
  account_password: string;
  mobile: string;
  Working_From_Month?: number;
  Working_From_Year?: number;
  Working_To_Year?: string;
  isPresent?: boolean;
  country_id: number;
  Experience_Year: number;
  Experience_Month: number;
  Is_Permentant: boolean;
  Is_Contract: boolean;
  Current_Designation: string;
  Current_Company: string;
  Current_Annual_Salary: number;
  Current_Location: string;
  Preferred_Location: string;
  Notice_Period_ID: number;
  Skills: string;
  Edu_Type_ID: number;
  University_Name: string;
  FormDate: string;
  ToDate: string;
  Subject: string;
  Grade_ID: number;
  previousEmploymentData: IPreviousDesignation[];
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
  country_id: number;
  country_ar_name: string;
  country_en_name: string;
  state: boolean;
}
