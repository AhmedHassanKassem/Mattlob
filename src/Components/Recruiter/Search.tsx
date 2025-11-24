import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { IJobData, IJobSections } from "../../Interfaces/interface";
import Button from "../../Containers/Button";
import { AppDispatch, RootState } from "../../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getRoles } from "../../Redux/RecruiterRedux/SerachRoles/getRoles";
import { axiosInst } from "../../axios/axios";
import { toast } from "react-toastify";
import { BeatLoader, ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import Select from "../../Containers/Select";

const SearchRoles = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [pageNum, setPageNum] = useState(1);
  const pageSize = 5
  const [pageNumbers, setPageNumbers] = useState<any>([]);
  const [engagedRoles, setEngagedRoles] = useState<IJobData[]>([]);
  const [jobId, setJobId] = useState('');
  const [loadingEngage, setLoadingEngage] = useState<number | null>(null);
  const jobs = useSelector((state: RootState) => state.roles.roles)
  const lang = useSelector((state: RootState) => state.lang.lang)
  const loadingJobs = useSelector((state: RootState) => state.roles.loading)
  const totalPages = useSelector((state: RootState) => state.pageCount.totalPages)
  const token = useSelector((state: RootState) => state.token.token)
    const [jobSections, setJobSections] = useState<IJobSections[]>([]);
  const dispatch: AppDispatch = useDispatch()
const {t} = useTranslation()

  const getEngagedRoles = async () => {
    const res = await axiosInst.get('/api/Job/GetAllEngagedJobs', {
      headers: {
        'Content-Type': `application/json`,
        'Authorization': `Bearer ${token}`
      }
    })
    if (res.status === 200) {
      setEngagedRoles(res.data.data.items)
      console.log(res.data.data.items);

    }
  }
  useEffect(() => {
    getEngagedRoles()
    dispatch(getRoles(pageNum, pageSize))
  }, [dispatch, pageNum])

  const navigate = useNavigate()
  const range = (start: number, end: number): number[] => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const getJobSections = async()=>{
   const res = await axiosInst.get('/api/Common/GetAllJobSections')
    if(res.status === 200){
      setJobSections(res.data.data)
    }
  }
 useEffect(() => {
  getJobSections()
 }, [])

  const engageJob = async (id: number) => {
    setLoadingEngage(id);
    let res;
    try {
      // اعمل الـ API call بتاعك هنا
      res = await axiosInst.post(`/api/Job/Engage?jobId=${id}`, {});
      if (res?.status === 200) {
        toast.success("Job engaged successfully")

        setEngagedRoles((prev) => [
          ...prev,
          { ...prev[0], id } // 👈 خد أول عنصر كـ قالب بس غيّر الـ id
        ]);


      }
    } catch (error) {
      console.error(error);
    } finally {


      setLoadingEngage(null);

    }
  };
  const disengageJob = async (id: number) => {

    setLoadingEngage(id);
    let res;
    try {
      // اعمل الـ API call بتاعك هنا
      res = await axiosInst.post(`/api/Job/Disengage?jobId=${id}`, {});
      if (res?.status === 200) {
        toast.success("Job disengaged successfully")
        setEngagedRoles((prev: IJobData[]) =>
          prev.filter((role) => role.id !== id)
        );
      }
    } catch (error) {
      console.error(error);
    } finally {

      setLoadingEngage(null);

    }
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
  return (
    <div className="min-h-screen bg-white border rounded-xl border-gray-200 items-center">
      <div className="bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 items-center gap-4 mb-4 px-4 md:px-10 py-4 rounded-xl shadow-sm">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Keyword Search</label>
          <input
            type="text"
            placeholder="Search by Keyword"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
        <div className="lg:col-span-2">
          {/* <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="">{t("Select Sector")}</option>
            <option value="IT">IT, Software, Analytics</option>
            <option value="Construction">Construction, Real Estate, Property</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
          </select> */}

          <Select className="w-full border border-gray-300 rounded px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
           labelDivClassname="mb-3 text-sm" label={t("Sector")} oneValue={<>
            {jobSections.map((sec : IJobSections , index : number)=>{
             return <option value={sec.id} key={index}>{lang === "en" ? sec.en_name : sec.ar_name}</option>
            })}
            </>}/>
        </div>

        {/* 🏙 City */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("City")}</label>
          <input
            type="text"
            placeholder="City"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>

        {/* 🆔 Job ID */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Job ID</label>
          <input
            type="text"
            placeholder="Job ID"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>

        {/* 🔘 Buttons */}
        <div className="lg:col-span-4 flex flex-col md:flex-row gap-3 mt-4 lg:mt-7 justify-center">
          <button className="w-full md:flex-1 bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition-colors font-medium">
            Search
          </button>
   
        </div>
      </div>




      {/* Results Summary */}
      <div className="px-6 pt-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-medium text-gray-800">{t("Total Available Live Roles")}:</span>
            <div className="w-4 h-4 bg-teal-500 rounded-full"></div>
            <span className="text-lg font-bold text-gray-800">{jobs.length}</span>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="px-6">
        <div className="mx-auto">
          <div className="bg-white text-sm rounded-lg shadow-sm border border-gray-200 overflow-x-auto overflow-hidden">
               {loadingJobs ? <div className="flex justify-center items-center min-h-[100px]">
                  <BeatLoader color="#0084d1"/>
                </div>  :<table className="w-full text-center border-collapse">

              <thead className="bg-sky-200 text-gray-700 ">
                <tr>
                  <th className="px-6 py-3 font-medium w-1/4">{t("Job Title")}</th>
                  <th className="px-6 py-3 font-medium w-1/12">{t("Action")}</th>
                  <th className="px-6 py-3 font-medium w-2/12">{t("Placement Fee")}</th>
                  <th className="px-6 py-3 font-medium w-2/12">{t("Location")}</th>
                  <th className="px-6 py-3 font-medium w-2/12">{t("Sector")}</th>
                  <th className="px-6 py-3 font-medium w-2/12">{t("Job Type")}</th>
                </tr>
              </thead>


           <tbody className="divide-y divide-gray-200">
                { jobs.map((job: IJobData, index: number) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >

                    <td className="px-6 py-4 align-top">
                      <h3 className="text-sky-700 font-medium hover:text-sky-800 cursor-pointer line-clamp-2" onClick={() => navigate(`/dashboard/roleDetails?role=${job.id}`)}>
                        {lang === "en" ? job.en_name : job.ar_name}
                      </h3>

                      {job.isPriority ? <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded mt-1 font-medium">
                        {t("Priority")}
                      </span> : null}

                      <div className="text-sm text-gray-500 mt-1">
                        Job ID: {job.id}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {engagedRoles.find((role: IJobData) => role.id === job.id) ? (
                        <Button
                          onClick={() => disengageJob(job.id)}
                          className={`
        }`}
                          buttonContent={
                            <div className="px-4 w-full text-center py-2 rounded-md font-medium text-sm transition-colors bg-red-600 text-white hover:bg-red-700">
                              {loadingEngage === job.id ? (
                                <ClipLoader color="white" size={20} />
                              ) : (
                                t("disengage")
                              )}
                            </div>
                          }
                        />
                      ) : (
                        <Button
                          onClick={() => engageJob(job.id)}
                          className={`
        }`}
                          buttonContent={
                            <div className="px-4 w-full text-center py-2 rounded-md font-medium text-sm transition-colors bg-sky-600 text-white hover:bg-sky-700">
                              {loadingEngage === job.id ? (
                                <ClipLoader color="white" size={20} />
                              ) : (
                                t("engage")
                              )}
                            </div>
                          }
                        />
                      )}
                    </td>


                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{job.placement_fee}</span>
                    </td>


                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{job.location}</div>
                          <div className="text-gray-500">{job.location}</div>
                        </div>
                      </div>
                    </td>


                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{lang === "en" ? job?.job_Sections?.en_name : job.job_Sections.ar_name}</span>
                    </td>


                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{lang === "en" ? job?.job_Types?.en_name : job.job_Types.ar_name}</span>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>}
            <div className="flex  justify-between items-center gap-4 p-5 bg-white  rounded-b-lg">


              <div className="flex items-center">

                <button
                  className={`flex items-center justify-center h-10 w-10 rounded-lg mr-2 transition-colors duration-200 ${pageNum > 1
                    ? "text-gray-600 hover:bg-sky-50 hover:text-sky-600 border border-gray-200"
                    : "text-gray-300 cursor-not-allowed border border-gray-100"
                    }`}
                  onClick={() => pageNum > 1 && setPageNum(pageNum - 1)}
                  disabled={pageNum === 1}
                  aria-label="Previous page"
                >
                  {lang === "en" ?  <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>

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

export default SearchRoles
