import { FormEvent, useEffect, useState } from "react"
import Input from "../../Containers/Input"
import Button from "../../Containers/Button"
import { ChevronLeft, ChevronRight, CircleX, MapPin, PenSquare, Plus, Trash2 } from "lucide-react"
import RadioButton from "../../Containers/Radiobutton"
import Select from "../../Containers/Select"
import { axiosInst } from "../../axios/axios"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../Redux/store"
import { toast } from "react-toastify"
import { getRoles } from "../../Redux/RecruiterRedux/SerachRoles/getRoles"
import { IJobData, IJobSections, IJobTypes } from "../../Interfaces/interface"
import { useNavigate } from "react-router-dom"
import DeleteModal from "../../Containers/DeleteModal"
import { useTranslation } from "react-i18next"

const PostJob = () => {
  const [pageNum, setPageNum] = useState(1);
  const [jobModal, setJobModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const pageSize = 5
  const [pageNumbers, setPageNumbers] = useState<any>([]);
  const [jobTypes, setJobTypes] = useState<IJobTypes[]>([]);
  const [jobSections, setJobSections] = useState<IJobSections[]>([]);
  const [jobId, setJobId] = useState(0);
  const jobs = useSelector((state: RootState) => state.roles.roles)
  const lang = useSelector((state: RootState) => state.lang.lang)
  const { t } = useTranslation()
  const totalPages = useSelector((state: RootState) => state.pageCount.totalPages)
  const token = useSelector((state: RootState) => state.token.token)
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate()
  const [jobForm, setJobForm] = useState({
    id: 0,
    ar_name: "",
    en_name: "",
    section_id: 1,
    type_id: 1,
    comment: "",
    agency_name: "",
    working_from: "",
    duration: "",
    experience: "",
    salary_range: "",
    placement_fee: "",
    getPaid_fee: "",
    notice_period: "",
    noOf_vacancy: 0,
    cv_limit: 0,
    agency_limit: 0,
    special_notes: "",
    job_description: "",
    location: "",
    isPriority: false,
  })

  const getJobTypes = async () => {
    const res = await axiosInst.get('/api/Common/GetAllJobTypes')
    if (res.status === 200) {
      setJobTypes(res.data.data)
    }
  }
  const getJobSections = async () => {
    const res = await axiosInst.get('/api/Common/GetAllJobSections')
    if (res.status === 200) {
      setJobSections(res.data.data)
    }
  }
  useEffect(() => {
    getJobTypes()
    getJobSections()
  }, [])

  const [errors, setErrors] = useState<Partial<Record<keyof typeof jobForm, string>>>({});
  const range = (start: number, end: number): number[] => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };
  const getPageNumbers = (
    pageNum: number,
    totalPages: number
  ): (number | string)[] => {
    let nums: (number | string)[] = [];

    if (totalPages <= 5) {
      nums = Array.from({ length: totalPages }, (_, index) => index + 1);
    } else {
      nums.push(1);

      if (pageNum > 3) {
        nums.push("...");
      }

      if (pageNum >= totalPages - 2) {
        nums.push(...range(Math.max(totalPages - 3, 2), totalPages - 1));
      } else {
        nums.push(
          ...range(
            Math.max(pageNum - 1, 2),
            Math.min(pageNum + 1, totalPages - 1)
          )
        );
      }

      if (pageNum < totalPages - 2) {
        nums.push("...");
      }

      nums.push(totalPages);
    }

    return nums;
  };
  useEffect(() => {
    const updatedPageNumbers = getPageNumbers(pageNum!, totalPages);
    setPageNumbers(updatedPageNumbers);
  }, [pageNum, totalPages]);
  useEffect(() => {
    dispatch(getRoles(pageNum, pageSize))
  }, [dispatch, pageNum])
  // ✅ تعريف دالة التحقق من البيانات
    const validateForm = () => {
      const newErrors: Partial<Record<keyof typeof jobForm, string>> = {};

      const requiredFields: (keyof typeof jobForm)[] = [
        "ar_name",
        "en_name",
        "section_id",
        "type_id",
        "comment",
        "agency_name",
        "working_from",
        "duration",
        "experience",
        "salary_range",
        "placement_fee",
        "getPaid_fee",
        "notice_period",
        "noOf_vacancy",
        "cv_limit",
        "agency_limit",
        "special_notes",
        "job_description",
        "location",
        "isPriority",
      ];

      // ✅ تحقق من الحقول المطلوبة
      requiredFields.forEach((key) => {
        const value = jobForm[key];
        const isEmpty =
          value === null ||
          value === undefined ||
          (typeof value === "string" && value.trim() === "");

        if (isEmpty) {
          const label = key
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          newErrors[key] = `${label} is required`;
        }
      });

      // ✅ Regex للتحقق من experience (مثلاً: 1-3)
      const experienceRegex = /^\d+\s*-\s*\d+$/;
      if (jobForm.experience && !experienceRegex.test(jobForm.experience.trim())) {
        newErrors.experience = "Experience must be in format e.g. 1-3";
      }

      // ✅ Regex للتحقق من salary_range (مثلاً: 1000-3000)
      const salaryRegex = /^\d+\s*-\s*\d+$/;
      if (jobForm.salary_range && !salaryRegex.test(jobForm.salary_range.trim())) {
        newErrors.salary_range = "Salary range must be in format e.g. 1000-3000";
      }

      // ✅ الحقول الرقمية فقط (numbers only)
      const numberOnlyFields: (keyof typeof jobForm)[] = [
        "placement_fee",
        "getPaid_fee",
        "notice_period",
        "noOf_vacancy",
        "cv_limit",
        "agency_limit",
      ];

      numberOnlyFields.forEach((key) => {
        const value = jobForm[key];
        if (value && !/^\d+$/.test(value.toString().trim())) {
          const label = key
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          newErrors[key] = `${label} must be a number`;
        }
      });

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

  const submit = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

  
    const isValid = validateForm();
    if (!isValid) {
      console.warn("Validation failed", errors);
      return;
    }

    try {

      if (jobId > 0) {
        const res = await axiosInst.post('/api/Job/Edit', jobForm, {
          headers: {
            'Content-Type': `application/json`,
            'Authorization': `Bearer ${token}`
          }
        })
        if (res.status === 200) {
          toast.success("Job updated successfully")
        }
      } else {
        const res = await axiosInst.post('/api/Job/Create', jobForm, {
          headers: {
            'Content-Type': `application/json`,
            'Authorization': `Bearer ${token}`
          }
        })
        if (res.status === 200) {
          toast.success("Job added successfully")
        }
      }


      setJobForm({
        id: 0,
        ar_name: "",
        en_name: "",
        section_id: 1,
        type_id: 1,
        comment: "",
        agency_name: "",
        working_from: "",
        duration: "",
        experience: "",
        salary_range: "",
        placement_fee: "",
        getPaid_fee: "",
        notice_period: "",
        noOf_vacancy: 0,
        cv_limit: 0,
        agency_limit: 0,
        special_notes: "",
        job_description: "",
        location: "",
        isPriority: false,
      })
      setJobId(0)
      dispatch(getRoles(pageNum, pageSize))
      setJobModal(!jobModal)
    } catch (error) {
      console.error("Error while submitting job:", error);
    }
  };






  const handleCheckBoxChange = (field: keyof typeof jobForm, checked: boolean) => {
    setJobForm((prev) => ({
      ...prev,
      [field]: checked
    }));
  };
  const handleChange = (field: keyof any, value: any) => {
    setJobForm({
      ...jobForm,
      [field]: value
    })
  }
  const getJobById = (jobId: number) => {
    setJobId(jobId!)
    setJobModal(!jobModal)
    const findJob = jobs.find((job: IJobData) => job.id === jobId)
    if (findJob) {
      setJobForm({
        ...jobForm,
        id: jobId,
        ar_name: findJob.ar_name,
        en_name: findJob.en_name,
        section_id: findJob.section_id,
        type_id: findJob.type_id,
        comment: findJob.comment,
        agency_name: findJob.agency_name,
        working_from: findJob.working_from,
        duration: findJob.duration,
        experience: findJob.experience,
        salary_range: findJob.salary_range,
        placement_fee: findJob.placement_fee,
        getPaid_fee: findJob.getPaid_fee,
        notice_period: findJob.notice_period,
        noOf_vacancy: findJob.noOf_vacancy,
        cv_limit: findJob.cv_limit,
        agency_limit: findJob.agency_limit,
        special_notes: findJob.special_notes,
        job_description: findJob.job_description,
        location: findJob.location,
        isPriority: findJob.isPriority,
      })
    }
  }
  const closeModal = () => {
    setJobModal(!jobModal)
    setJobForm({
      id: 0,
      ar_name: "",
      en_name: "",
      section_id: 1,
      type_id: 1,
      comment: "",
      agency_name: "",
      working_from: "",
      duration: "",
      experience: "",
      salary_range: "",
      placement_fee: "",
      getPaid_fee: "",
      notice_period: "",
      noOf_vacancy: 0,
      cv_limit: 0,
      agency_limit: 0,
      special_notes: "",
      job_description: "",
      location: "",
      isPriority: false,
    })
    setJobId(0)
  }
  const deleteJob = async () => {
    const res = await axiosInst.delete(`/api/Job/Delete?id=${jobId}`, {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      }
    })
    if (res.status === 200) {
      toast.success("Job deleted successfully!")
      setJobId(0)
      dispatch(getRoles(pageNum, pageSize))
      setDeleteModal(!deleteModal)
    }
  }

  return (
    <div>
      <div className="w-full px-6">
        {deleteModal && (
          <DeleteModal isOpen={deleteModal} onConfirm={deleteJob} name={"job " + jobs.find(
            (job: IJobData) => job.id === jobId
          )?.en_name} onCancel={() => setDeleteModal(!deleteModal)} />
        )}
        <div className="flex items-center justify-end h-auto mb-5">
          <Button
            onClick={() => setJobModal(!jobModal)}
            btnTitle={t("Post Job")}
            buttonContent={<div className="flex gap-1 px-10 items-center bg-sky-900 text-white p-3">
              <Plus size={18} />  {t("Post Job")}
            </div>}
            className="rounded-md p-2  transition-all duration-300"
          />
        </div>
        {jobModal &&
          <div className="fixed inset-0 z-50 bg-gray-900/75 flex justify-center p-10">
            <div className="px-5 animate__animated animate__fadeInDown col-span-12 bg-white p-5 rounded-xl  overflow-y-auto scrollbar-hide lg:w-xl w-md">
              <form onSubmit={submit}>
                <div className="col-span-12  flex justify-between">
                  <h1 className="text-2xl font-bold text-sky-800">{t("Post Job")}</h1>
                  <div className="flex items-center justify-end">
                    <Button
                      onClick={closeModal}
                      btnTitle={t("Close")}
                      buttonContent={<div className="flex gap-1  items-center">
                        <CircleX size={18} className="text-red-500" />
                      </div>}

                    />
                  </div>
                </div>
                <div className="lg:col-span-4 col-span-12 p-3">
                  <Input
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    label={t("Arabic name")}
                    labelClass="text-sky-900"
                    onChange={(e) => handleChange("ar_name", e.target.value)}
                    errorMessage={errors.ar_name}
                    value={jobForm.ar_name}
                  />
                </div>
                <div className="lg:col-span-4 col-span-12 p-3">
                  <Input
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    label={t("English name")}
                    labelClass="text-sky-900"
                    onChange={(e) => handleChange("en_name", e.target.value)}
                    errorMessage={errors.en_name}
                    value={jobForm.en_name}
                  />
                </div>
                <div className="lg:col-span-4 col-span-12 p-3">
                  <Select
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    label={t("Job section")}
                    labelClassname="text-sky-900"
                    onChange={(e) => handleChange("section_id", e.target.value)}
                    errorMessage={errors.section_id}
                    value={jobForm.section_id}
                    oneValue={
                      <>
                        {jobSections.map((sec: IJobSections, index: number) => {
                          return (
                            <option key={index} value={sec.id}>
                              {lang === "en" ? sec.en_name : sec.ar_name}
                            </option>
                          );
                        })}
                      </>
                    }
                  />
                </div>
                <div className="lg:col-span-4 col-span-12 p-3">
                  <Select
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    label={t("Job type")}
                    labelClassname="text-sky-900"
                    onChange={(e) => handleChange("type_id", e.target.value)}
                    errorMessage={errors.type_id}
                    value={jobForm.type_id}
                    oneValue={
                      <>
                        {jobTypes.map((type: IJobTypes, index: number) => {
                          return (
                            <option key={index} value={type.id}>
                              {lang === "en" ? type.en_name : type.ar_name}
                            </option>
                          );
                        })}
                      </>
                    }
                  />
                </div>
                <div className="lg:col-span-4 col-span-12 p-3">
                  <Input
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    label={t("Comment")}
                    labelClass="text-sky-900"
                    onChange={(e) => handleChange("comment", e.target.value)}
                    errorMessage={errors.comment}
                    value={jobForm.comment}
                  />
                </div>
                <div className="lg:col-span-4 col-span-12 p-3">
                  <Input
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    label={t("Agency name")}
                    labelClass="text-sky-900"
                    onChange={(e) => handleChange("agency_name", e.target.value)}
                    errorMessage={errors.agency_name}
                    value={jobForm.agency_name ?? ""}
                  />
                </div>
                <div className="lg:col-span-4 col-span-12 p-3">
                  <Input
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    label={t("Working from")}
                    labelClass="text-sky-900"
                    onChange={(e) => handleChange("working_from", e.target.value)}
                    errorMessage={errors.working_from}
                    value={jobForm.working_from}
                  />
                </div>
                <div className="lg:col-span-4 col-span-12 p-3">
                  <Input
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    label={t("Duration")}
                    labelClass="text-sky-900"
                    onChange={(e) => handleChange("duration", e.target.value)}
                    errorMessage={errors.duration}
                    value={jobForm.duration}
                  />
                </div>
                <div className="lg:col-span-4 col-span-12 p-3">
                  <Input
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    label={t("Experience")}
                    labelClass="text-sky-900"
                    onChange={(e) => handleChange("experience", e.target.value)}
                    errorMessage={errors.experience}
                    value={jobForm.experience}
                  />
                </div>
                <div className="lg:col-span-4 col-span-12 p-3">
                  <Input
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    label={t("Salary Range")}
                    labelClass="text-sky-900"
                    onChange={(e) => handleChange("salary_range", e.target.value)}
                    errorMessage={errors.salary_range}
                    value={jobForm.salary_range}
                  />
                </div>
                <div className="lg:col-span-4 col-span-12 p-3">
                  <Input
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    label={t("Placement Fee")}
                    labelClass="text-sky-900"
                    onChange={(e) => handleChange("placement_fee", e.target.value)}
                    errorMessage={errors.placement_fee}
                    value={jobForm.placement_fee}
                  />
                </div>
                <div className="lg:col-span-4 col-span-12 p-3">
                  <Input
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    label={t("Get paid fee")}
                    labelClass="text-sky-900"
                    onChange={(e) => handleChange("getPaid_fee", e.target.value)}
                    errorMessage={errors.getPaid_fee}
                    value={jobForm.getPaid_fee}
                  />
                </div>
                <div className="lg:col-span-4 col-span-12 p-3">
                  <Input
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    label={t("Notice period")}
                    labelClass="text-sky-900"
                    onChange={(e) => handleChange("notice_period", e.target.value)}
                    errorMessage={errors.notice_period}
                    value={jobForm.notice_period}
                  />
                </div>
                <div className="lg:col-span-4 col-span-12 p-3">
                  <Input
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    label={t("Vacancies no")}
                    labelClass="text-sky-900"
                    onChange={(e) => handleChange("noOf_vacancy", e.target.value)}
                    errorMessage={errors.noOf_vacancy}
                    value={jobForm.noOf_vacancy}
                  />
                </div>
                <div className="lg:col-span-4 col-span-12 p-3">
                  <Input
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    label={t("Cv limit")}
                    labelClass="text-sky-900"
                    onChange={(e) => handleChange("cv_limit", e.target.value)}
                    errorMessage={errors.cv_limit}
                    value={jobForm.cv_limit}
                  />
                </div>
                <div className="lg:col-span-4 col-span-12 p-3">
                  <Input
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    label={t("Agency limit")}
                    labelClass="text-sky-900"
                    onChange={(e) => handleChange("agency_limit", e.target.value)}
                    errorMessage={errors.agency_limit}
                    value={jobForm.agency_limit}
                  />
                </div>
                <div className="lg:col-span-4 col-span-12 p-3">
                  <Input
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    label={t("Special notes")}
                    labelClass="text-sky-900"
                    onChange={(e) => handleChange("special_notes", e.target.value)}
                    errorMessage={errors.special_notes}
                    value={jobForm.special_notes}
                  />
                </div>
                <div className="lg:col-span-4 col-span-12 p-3">
                  <Input
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    label={t("Job description")}
                    labelClass="text-sky-900"
                    onChange={(e) => handleChange("job_description", e.target.value)}
                    errorMessage={errors.job_description}
                    value={jobForm.job_description}
                  />
                </div>
                <div className="lg:col-span-4 col-span-12 p-3">
                  <Input
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    label={t("Location")}
                    labelClass="text-sky-900"

                    onChange={(e) => handleChange("location", e.target.value)}
                    errorMessage={errors.location}
                    value={jobForm.location}
                  />
                </div>
                <div className="lg:col-span-4 col-span-12 p-3">
                  <div className="flex justify-between">
                    <p>{t("Priority")}</p>

                    <RadioButton
                      checked={jobForm.isPriority === true}
                      onChange={() => handleCheckBoxChange("isPriority", true)}
                      label={t("Yes")}

                      name="isPriority"
                      value="true"
                    />

                    <RadioButton
                      checked={jobForm.isPriority === false}
                      onChange={() => handleCheckBoxChange("isPriority", false)}
                      label={t("No")}
                      name="isPriority"
                      value="false"
                    />

                  </div>
                </div>
                <div className="lg:col-span-4 col-span-12 p-3">
                  <div className="flex items-center justify-center h-auto">
                    <Button
                      btnTitle="Submit"
                      btnType="submit"
                      buttonContent={<div className="flex gap-1 px-10 items-center">
                        <Plus size={18} /> {jobId === 0 ? "Add job" : "Update job"}
                      </div>}
                      className=" hover:shadow-md shadow-sky-300 text-sky-600 shadow-sm border border-sky-200 rounded-full p-2 mt-5 transition-all duration-300"
                    />
                  </div>
                </div>

              </form>

            </div>
          </div>

        }

        <div className="mx-auto">
          <div className="bg-white text-sm rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              {/* Table Head */}
              <thead className="bg-sky-800 text-gray-700 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-medium text-white">{t("Job Title")}</th>
                  <th className="px-6 py-3 font-medium text-white">{t("Priority")}</th>
                  <th className="px-6 py-3 font-medium text-white">{t("Agency name")}</th>
                  <th className="px-6 py-3 font-medium text-white">{t("Placement Fee")}</th>
                  <th className="px-6 py-3 font-medium text-white">{t("Location")}</th>
                  <th className="px-6 py-3 font-medium text-white">{t("Sector")}</th>
                  <th className="px-6 py-3 font-medium text-white">{t("Job Type")}</th>
                  <th className="px-6 py-3 font-medium text-white">{t("Actions")}</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-200">
                {jobs.map((job: IJobData, index: number) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Job Title / Date / Job ID */}
                    <td className="px-6 py-4 align-top">
                      <h3 className="text-sky-700 font-medium hover:text-sky-800 cursor-pointer line-clamp-2"
                        onClick={() => navigate(`/dashboard/roleDetails?role=${job.id}`)}>
                        {lang === "en" ? job.en_name : job.ar_name}
                      </h3>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4">
                      <span className={`inline-block ${job.isPriority ? "bg-green-500" : "bg-red-500"} text-white text-xs px-2 py-1 rounded mt-1 font-medium`}>
                        {job.isPriority ? t("Yes") : t("No")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span>
                        {job.agency_name}
                      </span>
                    </td>

                    {/* Fee/End Rate */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{job.placement_fee}</span>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{job.location}</div>
                          <div className="text-gray-500">{job.location}</div>
                        </div>
                      </div>
                    </td>

                    {/* Sector */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{lang === "en" ? job?.job_Sections?.en_name : job?.job_Sections?.ar_name}</span>
                    </td>

                    {/* Job Type */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{lang === "en" ? job?.job_Types?.en_name : job?.job_Types?.ar_name}</span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => getJobById(job.id)}
                          className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition duration-200"
                        >
                          <PenSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setDeleteModal(!deleteModal), setJobId(job.id!) }}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
            <div className="flex  justify-between items-center gap-4 p-5 bg-white border-t border-gray-100 rounded-b-lg">


              {/* Pagination controls */}
              <div className="flex items-center">
                {/* Previous button */}
                <button
                  className={`flex items-center justify-center h-10 w-10 rounded-lg mr-2 transition-colors duration-200 ${pageNum > 1
                    ? "text-gray-600 hover:bg-sky-50 hover:text-sky-600 border border-gray-200"
                    : "text-gray-300 cursor-not-allowed border border-gray-100"
                    }`}
                  onClick={() => pageNum > 1 && setPageNum(pageNum - 1)}
                  disabled={pageNum === 1}
                  aria-label="Previous page"
                >
                  {lang === "en" ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>

                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                  {pageNumbers.map((pageNo: string, index: number) => (
                    <button
                      key={index}
                      className={`flex items-center justify-center h-10 w-10 rounded-lg mx-1 transition-all duration-200 ${Number(pageNo) === pageNum
                        ? "bg-sky-600 text-white font-medium shadow-sm"
                        : pageNo === "..."
                          ? "text-gray-400 cursor-default"
                          : "text-gray-700 hover:bg-sky-50 hover:text-sky-600 border border-gray-200"
                        }`}
                      onClick={() => {
                        if (pageNo !== "...") {
                          setPageNum(Number(pageNo));
                          localStorage.setItem("page", pageNo.toString());
                        }
                      }}
                      disabled={pageNo === "..."}
                    >
                      <span dir="rtl">
                        {typeof pageNo === "string"
                          ? pageNo.toLocaleString()
                          : pageNo}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Next button */}
                <button
                  className={`flex items-center justify-center h-10 w-10 rounded-lg ml-2 transition-colors duration-200 ${pageNum < totalPages
                    ? "text-gray-600 hover:bg-sky-50 hover:text-sky-600 border border-gray-200"
                    : "text-gray-300 cursor-not-allowed border border-gray-100"
                    }`}
                  onClick={() =>
                    pageNum < totalPages && setPageNum(pageNum + 1)
                  }
                  disabled={pageNum === totalPages}
                  aria-label="Next page"
                >
                  {lang === "en" ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostJob
