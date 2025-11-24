import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Redux/store';
import ButtonSelect from '../../../Containers/ButtonSelect';
import { useTranslation } from 'react-i18next';
import { axiosInst } from '../../../axios/axios';
import { toast } from 'react-toastify';
import { ICandidate } from '../../../Interfaces/interface';



const AllCandidates = () => {
  const user = useSelector((state: RootState) => state.user.localStorageUser)
  const lang = useSelector((state: RootState) => state.lang.lang)
  const token = useSelector((state: RootState) => state.token.token)
  const { t } = useTranslation()

  const [searchFilters, setSearchFilters] = useState({
    candidate: '',
    jobDescription: '',
    employerName: '',
    jobOwner: '',
    status: ''
  });

  const actionsList = [
    t("Submit candidate"),
    t("Message"),
    t("disengage")
  ]
  const [candidates, setCandidates] = useState<ICandidate[]>()


  const getAllCandidateRoles = async () => {
    try {
      const res = await axiosInst.get(`/api/Candidate/GetAll`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      if (res.status === 200) {
        setCandidates(res.data.data)
      }
    } catch (error) {

    }
  }
  useEffect(() => {
    getAllCandidateRoles()

  }, [])

  const disengageJob = async (id: number) => {
    let res;
    try {
      // اعمل الـ API call بتاعك هنا
      res = await axiosInst.post(`/api/Job/Disengage?jobId=${id}`, {});
      if (res?.status === 200) {
        toast.success("Job disengaged successfully")
        getAllCandidateRoles()

      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleSelectAction = (value: string, jobId: number) => {
    if (value === t("Submit candidate")) {

    }
    if (value === t("Message")) {

    }
    if (value === t("disengage")) {
      disengageJob(jobId);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Search Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <input
              type="text"
              placeholder="Candidate"
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={searchFilters.candidate}
              onChange={(e) => setSearchFilters({ ...searchFilters, candidate: e.target.value })}
            />
            <input
              type="text"
              placeholder="Job Descriptions"
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={searchFilters.jobDescription}
              onChange={(e) => setSearchFilters({ ...searchFilters, jobDescription: e.target.value })}
            />
            <input
              type="text"
              placeholder="Employer Name"
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={searchFilters.employerName}
              onChange={(e) => setSearchFilters({ ...searchFilters, employerName: e.target.value })}
            />
            <select
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={searchFilters.jobOwner}
              onChange={(e) => setSearchFilters({ ...searchFilters, jobOwner: e.target.value })}
            >
              <option value="">Job Owner</option>
            </select>
            <select
              className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={searchFilters.status}
              onChange={(e) => setSearchFilters({ ...searchFilters, status: e.target.value })}
            >
              <option value="">Status</option>
            </select>
          </div>
          <button className="bg-sky-700 hover:bg-sky-800 text-white px-6 py-2 rounded font-medium transition-colors">
            Search
          </button>
        </div>

        {/* Total Count */}
        <div className="mb-4">
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Total Candidates:</span> 1 (displaying last 6 months submissions)
          </p>
          <p className="text-red-700 text-sm">
            No feedback yet? Click Open the Profile and click <span className="font-bold">"ADD NOTES"</span> to follow up with Client (Please be polite to clients when chasing for feedback.)
          </p>
        </div>

        {/* Candidates Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-start text-sm font-semibold text-gray-700">{t("Candidate")}</th>
                  <th className="px-4 py-3 text-start text-sm font-semibold text-gray-700">
                    {t("Job")} <Info className="inline w-4 h-4 ml-1" />
                  </th>
                  <th className="px-4 py-3 text-start text-sm font-semibold text-gray-700">{t("Recruiter")}</th>
                  <th className="px-4 py-3 text-start text-sm font-semibold text-gray-700">{t("Current Salary")}</th>
                  <th className="px-4 py-3 text-start text-sm font-semibold text-gray-700">{t("Action")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {candidates?.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <a href="#" className="text-sky-700 hover:underline font-medium">
                          {lang === 'en' ? candidate.en_name : candidate.ar_name}
                        </a>

                        <div className="text-sm text-gray-600 mt-1">
                          {candidate.current_job_title}
                        </div>
                        <div className="text-sm mt-1">
                          <span className="text-gray-700">Candidate Status: </span>
                          <span className={candidate.status_en_name === 'pending' || candidate.status_ar_name === 'انتظار' ? 'text-orange-600' : 'text-gray-900'}>
                            {lang === 'en' ? candidate.status_en_name : candidate.status_ar_name}
                          </span>
                        </div>

                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {candidate.current_job_title === 'NOT SUBMITTED YET' ? (
                        <div>
                          <div className="text-red-700 font-bold mb-2">{candidate.current_job_title}</div>
                          <div className="text-sm">
                            Click <span className="font-semibold">Action</span> and Submit to the Engaged Job
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium text-gray-900">{candidate.current_job_title}</div>
                          <div className="text-sm text-gray-700">{candidate.current_company}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-gray-700">{user.name}</td>

                    <td className="px-4 py-4 text-gray-700 text-sm">{candidate.current_salary}</td>
                    <td className="px-4 py-4">
                      <ButtonSelect
                        options={actionsList}
                        placeholder={t("Actions")}
                        onChange={(val) =>
                          handleSelectAction(
                            val,
                            Number(candidate.jobs && candidate.jobs.length > 0 ? candidate.jobs[0].job_id : 0)
                          )
                        }

                        buttonClassName="bg-sky-600 text-white hover:bg-sky-700 transition-colors font-medium px-4 py-2 rounded-lg"
                        menuClassName="w-44"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-700">
          <span>First</span>
          <span>{'<<'}</span>
          <span>1</span>
          <span>{'>>'}</span>
          <span>Last</span>
        </div>
      </div>
    </div>
  );
};

export default AllCandidates;