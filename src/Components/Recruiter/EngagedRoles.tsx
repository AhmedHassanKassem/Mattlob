import { useEffect, useState } from 'react';
import { Briefcase, Check, ChevronLeft, ChevronRight, User, X } from 'lucide-react';
import ButtonSelect from '../../Containers/ButtonSelect';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../Redux/store';
import { getEngagedRoles } from '../../Redux/RecruiterRedux/EngagedJobs/getEngagedJobs';
import { ICandidate, ICandidateJobs, IJobData } from '../../Interfaces/interface';
import { axiosInst } from '../../axios/axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { HashLoader } from 'react-spinners';


const EngagedRoles = () => {
  const [keywordSearch, setKeywordSearch] = useState('');
  const [employerSearch, setEmployerSearch] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const token = useSelector((state: RootState) => state.token.token)
  const loading = useSelector((state: RootState) => state.engagedRoles.loading)
  const engagedRoles = useSelector((state: RootState) => state.engagedRoles.engagedRoles)
  const totalPages = useSelector((state: RootState) => state.pageCount.totalPages)
  const lang = useSelector((state: RootState) => state.lang.lang)
  const dispatch: AppDispatch = useDispatch();
  const [canChoiceModal, setCanChoiceModal] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [jobId, setJobId] = useState(0);
  const pageSize = 5
  const [pageNumbers, setPageNumbers] = useState<any>([]);
  const [selectedCands, setSelectedCands] = useState<ICandidate[]>([]);
  const { t } = useTranslation()



  useEffect(() => {
    dispatch(getEngagedRoles(pageNum, pageSize))
    getAllCands()
  }, [dispatch])

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

  const actionsList = [
    t("Submit candidate"),
    t("Message"),
    t("disengage")
  ]
  const disengageJob = async (id: number) => {
    let res;
    try {
      // اعمل الـ API call بتاعك هنا
      res = await axiosInst.post(`/api/Job/Disengage?jobId=${id}`, {headers : {
        Authentication : `Bearer ${token}`
      }});
      if (res?.status === 200) {
        toast.success("Job disengaged successfully")
        dispatch(getEngagedRoles(pageNum, pageSize))

      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const updatedPageNumbers = getPageNumbers(pageNum!, totalPages);
    setPageNumbers(updatedPageNumbers);
  }, [pageNum, totalPages]);

  const handleSelectAction = (value: string, jobId: number) => {
    if (value === t("Submit candidate")) {
      setJobId(jobId)
      setCanChoiceModal(!canChoiceModal)
    }
    if (value === t("Message")) {

    }
    if (value === t("disengage")) {
      disengageJob(jobId);
    }
  };

  const getAllCands = async () => {
    const res = await axiosInst.get(`/api/Candidate/GetAllCandidates`, {
      headers: {
        'Content-Type': 'Application/json',
        Authorization: `Bearer ${token}`
      }
    })
    if (res.status === 200) {
      setSelectedCands(res.data.data)
  
    }
  }
  const submitCandidate = async (canId?: number) => {
    if (!canId) return;
    try {
      setLoadingSubmit(true);
      const res = await axiosInst.post('/api/Candidate/SubmitJob',
        { job_id: jobId, candidate_id: canId },
      );

      if (res.status === 200) {
        toast.success('Candidate added to this job successfully');
        getAllCands();
      }
    } catch (err) {
      toast.error('Something went wrong while adding candidate');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const deleteSubmission = async (subId?: number) => {
    if (!subId) return;
    try {
      setLoadingSubmit(true); // ⏳ بداية التحميل

      const res = await axiosInst.delete(`/api/Candidate/DeleteSubmission?id=${subId}`);

      if (res.status === 200) {
        toast.success('Candidate deleted from this job successfully');
        getAllCands();
      }
    } catch (err) {
      toast.error('Something went wrong while deleting candidate');
    } finally {
      setLoadingSubmit(false); // ✅ نهاية التحميل
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {canChoiceModal && (
        <div className='fixed inset-0 flex justify-center items-center bg-black/75 z-50 p-4'>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col'>

            {/* Header */}
            <div className='flex items-center justify-between p-6 border-b border-gray-200'>
              <div className='flex items-center gap-3'>
                <div className='bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-xl'>
                  <Briefcase className='text-white' size={24} />
                </div>
                <div>
                  <h1 className='font-bold text-xl text-gray-900'>{t("Choose Candidates")}</h1>
                 {selectedCands.filter((c: ICandidate) => c.jobs?.some((j: ICandidateJobs) => j.job_id === jobId)).length > 0 &&
                  <p className='text-sm text-gray-500 mt-0.5'>  
                     { t("Selected candidates to this role") + "  : " + 
                     selectedCands.filter((c: ICandidate) => c.jobs?.some((j: ICandidateJobs) => j.job_id === jobId)).length}
                  </p>}
                </div>
              </div>

              <button
                onClick={() => setCanChoiceModal(false)}
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
              >
                <X size={20} className='text-gray-600' />
              </button>
            </div>

            {/* Content */}
            <div className='overflow-y-auto p-6 space-y-3'>
              {selectedCands.map((can: ICandidate, index: number) => {
                const isAssigned = can.jobs?.some((j: ICandidateJobs) => j.job_id === jobId);
                const findCanJob = can.jobs?.find((j: ICandidateJobs) => j.job_id === jobId);

                return (
                  <div
                    key={index}
                    onClick={() => {
                      isAssigned ? deleteSubmission(findCanJob?.id!) : submitCandidate(can.id!);
                    }}
                    className={`
                group relative overflow-hidden rounded-xl p-4 cursor-pointer
                transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg
                ${isAssigned
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300'
                        : 'bg-gradient-to-r from-blue-50 to-sky-50 border-2 border-transparent hover:border-blue-200'
                      }
              `}
                  >
                    <div className='flex items-center justify-between relative z-10'>
                      <div className='flex items-center gap-4'>
                        <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    ${isAssigned ? 'bg-green-100' : 'bg-blue-100'}
                  `}>
                          <User size={20} className={isAssigned ? 'text-green-600' : 'text-blue-600'} />
                        </div>
                        <div>
                          <p className={`font-semibold text-lg ${isAssigned ? 'text-green-900' : 'text-gray-900'}`}>
                            {lang === 'en' ? can.en_name : can.ar_name}
                          </p>
                          
                        </div>
                      </div>

                      <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                  ${isAssigned
                          ? 'bg-green-500 scale-100'
                          : 'bg-white border-2 border-gray-300 scale-90 group-hover:scale-100 group-hover:border-blue-400'
                        }
                `}>
                        {isAssigned && (
                          <Check size={18} className='text-white' />
                        )}
                      </div>
                    </div>

                    {/* Decorative gradient overlay */}
                    <div className={`
                absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                ${isAssigned
                        ? 'bg-gradient-to-r from-green-100/50 to-emerald-100/50'
                        : 'bg-gradient-to-r from-blue-100/50 to-sky-100/50'
                      }
              `} />
                  </div>
                );
              })}
            </div>
            {loadingSubmit ? <div className='fixed inset-0 z-50 items-center flex justify-center backdrop-blur-sm'>
              <HashLoader size={30} color='#024a70'/>
            </div> : null}

          </div>
        </div>
      )}
      <div className="bg-white px-4 md:px-6 py-6 rounded-xl shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                placeholder="Keyword Search"
                value={keywordSearch}
                onChange={(e) => setKeywordSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-gray-600"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Search by Employer Name (Start typing Client name and you will receive the list in the dropdown)"
                value={employerSearch}
                onChange={(e) => setEmployerSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-gray-500"
              />
            </div>
            <div>
              <button className="w-full bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition-colors font-medium">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Results Summary */}
      <div className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-normal text-gray-800">
            {t("Total Active/Engaged Roles")}: {engagedRoles.length}
          </h2>
        </div>
      </div>

      {/* Engaged Jobs Table */}
      <div className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border border-gray-200 overflow-hidden overflow-x-auto rounded-lg shadow-sm">
            <table className="w-full text-left border-collapse text-sm min-w-[900px]">
              {/* Table Head */}
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-medium">
                <tr>
                  <th className="px-6 py-3 w-2/12">{t("Agency")}</th>
                  <th className="px-6 py-3 w-2/12">{t("Job Title")}</th>
                  <th className="px-6 py-3 w-1/12">{t("Actions")}</th>
                  <th className="px-6 py-3 w-1/12">{t("Vacancies")}</th>
                  <th className="px-6 py-3 w-1/12">{t("Placement Fee")}</th>
                  <th className="px-6 py-3 w-2/12">{t("Location")}</th>
                  <th className="px-6 py-3 w-2/12">{t("Salary Range")}</th>
                  <th className="px-6 py-3 w-1/12">{t("Experience")}</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-200">
                {loading ? <tr>
                  <td colSpan={8}>
                    <div className='flex justify-center py-5'>
                      <HashLoader size={30} color='#024a71' />
                    </div>
                  </td>
                </tr> : engagedRoles.length > 0 ? engagedRoles.map((job: IJobData) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">

                    {/* Agency */}
                    <td className="px-6 py-4 align-top">
                      <div className="text-sky-700 font-medium hover:text-sky-800 cursor-pointer">
                        {lang === "en" ? job.agency_name : job.ar_name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {t("Sector")}: {lang === "en" ? job.job_Sections?.en_name : job.job_Sections.ar_name ?? "-"}
                      </div>
                    </td>

                    {/* Job Title */}
                    <td className="px-6 py-4 align-top">
                      <div className="text-sky-700 font-medium hover:text-sky-800 cursor-pointer mb-1">
                        {lang === "en" ? job.en_name : job.ar_name}
                      </div>
                      {job.isPriority && (
                        <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded font-medium">
                          {t("Priority")}
                        </span>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {t("Type")}: {lang === "en" ? job.job_Types?.en_name : job.job_Types.ar_name ?? "-"}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <ButtonSelect
                        options={actionsList}
                        placeholder={t("Actions")}
                        onChange={(val) => handleSelectAction(val, job.id)}
                        buttonClassName="bg-sky-600 w-20 text-white hover:bg-sky-700 transition-colors font-medium px-2 py-2 rounded-lg"
                        menuClassName="w-44"
                      />


                    </td>

                    {/* Vacancies */}
                    <td className="px-6 py-4 text-gray-800">
                      {job.noOf_vacancy || 0}
                    </td>

                    {/* Placement Fee */}
                    <td className="px-6 py-4 text-gray-800">
                      {job.placement_fee || "-"}
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 text-gray-800">
                      {job.location || "-"}
                    </td>

                    {/* Salary Range */}
                    <td className="px-6 py-4 text-gray-800">
                      {job.salary_range || "-"}
                    </td>

                    {/* Experience */}
                    <td className="px-6 py-4 text-gray-800">
                      {job.experience || "-"}
                    </td>
                  </tr>
                )) : <tr>
                  <td>
                    <div>لا يوجد اي وظاثف مشغلة حاليا</div>
                  </td>
                </tr>}
              </tbody>
            </table>



            {/* Pagination */}
            <div className="flex  justify-between items-center gap-4 p-5 bg-white border-t border-gray-100 rounded-b-lg mb-10">


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
  );
};

export default EngagedRoles;