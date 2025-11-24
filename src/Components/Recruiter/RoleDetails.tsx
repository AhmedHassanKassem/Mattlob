import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { RootState } from "../../Redux/store";
import { IJobData } from "../../Interfaces/interface";

const RoleDetails = () => {
  const [searchParams] = useSearchParams();
  const roleId = Number(searchParams.get("role"))
  const jobs = useSelector((state : RootState)=> state.roles.roles)
  const [foundRole , setFoundRole] = useState<IJobData>()

useEffect(()=>{
  const findRole = jobs.find((job  : IJobData)=> job.id === roleId)
  if(findRole){
    setFoundRole(findRole)
  }
},[jobs])
  return (
    <div className="min-h-screen bg-white rounded-t-xl">
      {/* Header */}

      {/* Main Content */}
      <div className="bg-white">
        {/* Job Title Header */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold">{foundRole?.en_name}</span>
            <span>| JOB ID: {foundRole?.id}</span>
            <span className="text-sky-600">TAMIL NADU INDIA</span>
            {/* <span>| LAST UPDATED: {}</span> */}
            <span>1ST POSTED: JULY 24, 2025 | {foundRole?.noOf_vacancy} VACANCY</span>
          </div>
        </div>

        {/* Urgent Badge */}
        <div className="px-6 py-2">
          <span className="bg-sky-600 text-white px-3 py-1 rounded text-sm font-medium">
            Urgent
          </span>
        </div>

        {/* Form Content */}
        <div className="px-6 py-4 ">
          <table className="w-full text-sm rounded-xl">
            <tbody>
              <tr>
                <td className="py-2 w-48 text-gray-600">Client Name:</td>
                <td className="py-2 text-gray-600">Client Details will become available to you once you hit the Engage Button above</td>
              </tr>
              
              <tr>
                <td className="py-2 w-48 text-gray-600">Best Practices:</td>
                <td className="py-2">
                  <a href="#" className="text-blue-600">BEST PRACTICES</a>
                  <span className="text-gray-600"> (Please click before working on any requirement).</span>
                </td>
              </tr>
              
              <tr>
                {/* <td className="py-2 w-48 text-gray-600">Job Details:</td>
                <td className="py-2 text-gray-600">Customer Services (ITES, BPO)</td> */}
              </tr>
              
              <tr>
                <td className="py-2 w-48 text-gray-600">Interviewer / Hiring Manager Comments:</td>
                <td className="py-2 text-red-600">
                     {foundRole?.comment}
                </td>
              </tr>
              
              <tr>
                <td className="py-2 w-48 text-gray-600">Job Type:</td>
                <td className="py-2 text-gray-600">{foundRole?.job_Types.en_name}</td>
              </tr>
              
              <tr>
                <td className="py-2 w-48 text-gray-600">Duration:</td>
                <td className="py-2 text-gray-600">{foundRole?.duration}</td>
              </tr>
              
              <tr>
                <td className="py-2 w-48 text-gray-600">Working:</td>
                <td className="py-2 text-gray-600">{foundRole?.working_from}</td>
              </tr>
              
              <tr>
                <td className="py-2 w-48 text-gray-600">Experience:</td>
                <td className="py-2 text-gray-600">{foundRole?.experience}</td>
              </tr>
              
              <tr>
                <td className="py-2 w-48 text-gray-600">Candidate Salary Range / End Rate:</td>
                <td className="py-2 text-gray-600">{foundRole?.salary_range}</td>
              </tr>
              
              <tr>
                <td className="py-2 w-48 text-gray-600">Placement Fee:</td>
                <td className="py-2 text-gray-600">{foundRole?.placement_fee}</td>
              </tr>
              
              <tr>
                <td className="py-2 w-48 text-gray-600">How much you will earn from this Fee?</td>
                <td className="py-2">
                  <span className="text-gray-600">Please check </span>
                  <span className="font-bold">"PAYOUT"</span>
                  <span className="text-gray-600"> from this link → </span>
                  <a href="#" className="text-blue-600">Recruiter FAQs</a>
                </td>
              </tr>
              
              <tr>
                <td className="py-2 w-48 text-gray-600">When will I get paid my fee?</td>
                <td className="py-2 text-gray-600">90 Days from DOJ for Permanent</td>
              </tr>
              
              <tr>
                <td className="py-2 w-48 text-gray-600">Want to manage Clients?</td>
                <td className="py-2">
                  <a href="#" className="text-blue-600">Become our Franchise Partner</a>
                </td>
              </tr>
              
              <tr>
                <td className="py-2 w-48 text-gray-600">Notice Period (How Soon Client Wants Candidate to Join):</td>
                <td className="py-2 text-gray-600">{foundRole?.notice_period}</td>
              </tr>
              
              <tr>
                <td className="py-2 w-48 text-gray-600">No of Vacancies:</td>
                <td className="py-2 text-gray-600">{foundRole?.noOf_vacancy} Vacancy</td>
              </tr>
              
              <tr>
                <td className="py-2 w-48 text-gray-600">CV sent 📧</td>
                <td className="py-2 text-gray-600">{foundRole?.cv_limit} CV's per Agency</td>
              </tr>
              
              <tr>
                <td className="py-2 w-48 text-gray-600">Agency Limit 📧</td>
                <td className="py-2">
                  <div className="text-gray-600">{foundRole?.agency_limit}</div>
                  <div className="text-red-600 text-xs">Max: (Slot bugged Status is Close)</div>
                </td>
              </tr>
              
              <tr>
                <td className="py-2 w-48 text-gray-600">Special Notes about this Client (if any):</td>
                <td className="py-2"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Job Description Section */}
        <div className="px-6 py-4">
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h4 className="font-semibold mb-2">Job Description</h4>
              <p>{foundRole?.job_description}</p>
            </div>

            {/* <div>
              <h4 className="font-semibold mb-2">Key Responsibilities</h4>
              <p>Preparation of monthly, quarterly, and annual financial statements</p>
              <p>Budgeting, forecasting, and variance analyses</p>
              <p>Cash flow management and working capital optimization</p>
              <p>Coordination with external auditors for Annual Audits (Reports, P&L/B/S, B/S, etc.)</p>
              <p>Handling intercompany and management fees, Franchise fees, and owner distributions</p>
              <p>Implementing strong internal control procedures</p>
              <p>Ensuring compliance with accounting standards (GAAP, Tax, Occupancy Tax)</p>
              <p>Liaising with auditors and tax consultants</p>
              <p>ERP systems like NetSuite, MS, SAP, or Oracle</p>
              <p>Advanced knowledge of Excel and other tools (Data Analytics)</p>
              <p>P I books for reporting and dashboarding</p>
              <p>Supervising accounting staff and mentoring under team members</p>
              <p>Leading cross-functional projects to improve financial and operational alignment</p>
              <p>Delegation and performance monitoring</p>
              <p>Support cost control initiatives and profitability analysis</p>
              <p>Review procurement, payroll, and inventory reporting</p>
              <p>Develop financial models for pricing and cost optimization</p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleDetails;