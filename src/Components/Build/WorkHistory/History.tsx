import { useNavigate } from "react-router-dom"
import Button from "../../../containers/Button"
import Input from "../../../containers/Input"
import Select from "../../../containers/Select"
import SideBar from "../../../containers/SideBar"
import { motion } from "framer-motion"
import CheckboxDemo from "../../../containers/AnimateChekbox"
import Templates, { IExperience, IResume, sampleResume } from "../ChooseTemplate/Templates"
import { useEffect, useState } from "react"
import { Pen, Trash2 } from "lucide-react"

const History = () => {
  const navigate = useNavigate();
  const [tempId, setTempId] = useState(0);
  const [expId, setExpId] = useState(0);
  const workMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const workYears = Array.from({ length: 2025 - 1990 + 1 }, (_, i) => 1990 + i);


  const [expr, setExpr] = useState<IExperience>({
    role: '',
    company: '',
    from_year: '',
    to_year: '',
    remote: false,
    present: false,
    details: '',
    location: '',
  });
  const [resumeData, setResumeData] = useState<IResume>(() => ({
    ...sampleResume.resume!,

  }));
  const handleExprChange = (field: keyof IExperience, value: any) => {
    setExpr((prev) => ({
      ...prev,
      [field]: value,
    }));

  };
  const handleCheckRemote = (name: keyof IExperience, checked: boolean) => {
    setExpr((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

const addExperience = () => {
  try {
    const currentExp = resumeData.experience || [];

    // Remove default sample experiences if they exist
    const isDefaultOnly = currentExp.length === 2 &&
      currentExp.every((exp) =>
        sampleResume.resume?.experience?.some((sample) =>
          JSON.stringify({ ...sample, id: undefined }) ===
          JSON.stringify({ ...exp, id: undefined })
        )
      );

    let cleanedExperience = isDefaultOnly ? [] : currentExp;

    let updatedExperience;

    if (expId > 0) {
      // EDIT existing experience
      updatedExperience = cleanedExperience.map((exp) =>
        exp.id === expId ? { ...expr, id: expId } : exp
      );
    } else {
      // FIND the max ID so far
      const maxId = cleanedExperience.reduce((max, exp) => {
        return exp.id && exp.id > max ? exp.id : max;
      }, 0);

      // Add new experience with incremented id
      const newExp = { ...expr, id: maxId + 1 };
      updatedExperience = [...cleanedExperience, newExp];
    }

    const updatedResume: IResume = {
      ...resumeData,
      experience: updatedExperience,
    };

    setResumeData(updatedResume);
    localStorage.setItem("resumeData", JSON.stringify(updatedResume));

    setExpr({
      role: '',
      company: '',
      from_year: '',
      to_year: '',
      remote: false,
      present: false,
      details: '',
      location: '',
    });

    setExpId(0); // Reset editing mode
  } catch (error) {
    console.error("Error in addExperience:", error);
  }
};

  const getExpById = (expId: number) => {
    setExpId(expId)

    const findExp: IExperience = resumeData.experience.find((exp: IExperience) => exp.id == expId)!
    if (findExp) {
      setExpr({
        role: findExp.role,
        company: findExp.company,
        from_year: findExp.from_year,
        to_year: findExp.to_year,
        remote: findExp.remote,
        present: findExp.present,
        details: findExp.details,
        location: findExp.location,
      })
    }
  }
const deleteExp = (expId: number) => {
  const updatedExperience = resumeData.experience.filter(
    (exp) => exp.id !== expId
  );

  const updatedResume: IResume = {
    ...resumeData,
    experience: updatedExperience,
  };

  setResumeData(updatedResume);
  localStorage.setItem("resumeData", JSON.stringify(updatedResume));
};


  useEffect(() => {
    const myTempId = JSON.parse(localStorage.getItem('tempId') || '0');
    const storedResume = localStorage.getItem('resumeData');

    if (storedResume) {
      const parsedResume = JSON.parse(storedResume);

      const isDefault =
        parsedResume.experience?.length === 1 &&
        Object.values(parsedResume.experience[0]).every((val) =>
          typeof val === 'boolean' ? val === false : val === ''
        );

      if (isDefault || parsedResume.experience?.length === 0) {
        parsedResume.experience = [...sampleResume.resume?.experience!];
      }

      setResumeData(parsedResume);
    } else {
      setResumeData({
        ...sampleResume.resume!,
      });
    }

    if (myTempId) setTempId(myTempId);
  }, []);



  return (
    <div className="min-h-screen  relative w-full bg-gray-50">
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-2 bg-white shadow-md">
          <SideBar />
        </div>

        <motion.div
          className="col-span-6 p-10"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="mb-2">
            <h1 className="text-4xl text-sky-700 font-bold mb-1">Tell us about your most recent job</h1>
            <p className="text-gray-600 text-sky-700">We’ll start there and work backward.</p>
            <p className="text-xs text-red-500 pt-6">* these fields are mandatory</p>
          </div>

          <form className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <Input label="Title"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                value={expr.role} onChange={(e) => handleExprChange('role', e.target.value)} />
            </div>
            <div className="col-span-2">
              <Input label="Company"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                value={expr.company} onChange={(e) => handleExprChange('company', e.target.value)} />
            </div>

            <div className="col-span-1">
              <Select className={`w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 transition`}
                forSelect="Month" label="Start Date" oneValue={
                  <>
                    {workMonth.map((month, index) => (
                      <option key={index} value={month}>
                        {month}
                      </option>
                    ))}
                  </>
                }

              />
            </div>
            <div className="col-span-1">
              <Select className={`w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 transition`}
                forSelect="Year" oneValue={
                  <>
                    {workYears.map((year, index) => (
                      <option key={index} value={year}>
                        {year}
                      </option>
                    ))}
                  </>
                }
                value={expr.from_year}
                onChange={(e) => handleExprChange('from_year', e.target.value)}
              />
            </div>
            <div className="col-span-1">
              <Select forSelect="Month" disabled={expr.present}
                className={`${expr.present ? "bg-gray-100" : ""} w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 transition`}
                oneValue={
                  <>
                    {workMonth.map((month, index) => (
                      <option key={index} value={month}>
                        {month}
                      </option>
                    ))}
                  </>
                }
                label="End Date" />
            </div>
            <div className="col-span-1">
              <Select forSelect="Year"
                disabled={expr.present} className={`${expr.present ? "bg-gray-100" : ""} w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 transition`}
                oneValue={
                  <>
                    {workYears.map((year, index) => (
                      <option key={index} value={year}>
                        {year}
                      </option>
                    ))}
                  </>
                }
                value={expr.to_year}
                onChange={(e) => handleExprChange('to_year', e.target.value)}
              />
            </div>

            <div className="col-span-3 flex justify-end">

              <CheckboxDemo
                label="I currently work here"
                name="present"
                size="sm"
                labelClassName="pl-1 text-sm text-gray-600"
                checked={expr.present}
                onChange={(checked: boolean) => handleCheckRemote("present", checked)}
              />
            </div>

            <div className="col-span-3">
              <Input label="Location" disabled={expr.remote}
                className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${expr.remote ? "bg-gray-100" : ""}`}
                value={expr.location} onChange={(e) => handleExprChange('location', e.target.value)} />
            </div>

            <div className="col-span-1 flex items-center mt-6">
              <CheckboxDemo
                label="Remote"
                name="remote"
                size="sm"
                labelClassName="pl-1 text-sm text-gray-600"
                checked={expr.remote}
                onChange={(checked: boolean) => handleCheckRemote("remote", checked)}
              />
            </div>

            <div className="col-span-4">
              <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="desc"
                rows={4}
                value={expr.details}
                onChange={(e) => handleExprChange('details', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none transition"
              />
            </div>

            <div className="col-span-4 flex justify-end mt-4">
              <Button
                onClick={addExperience}
                title={expId == 0 ? "Add Experience" : "Update Experience"}
                className="bg-sky-600 hover:bg-sky-700 text-white rounded-full py-2 px-6 transition-all duration-300"
              />
            </div>
          </form>
       {resumeData.experience
  .filter((exp) =>
    !sampleResume.resume?.experience?.some((sample) =>
      JSON.stringify({ ...sample, id: undefined }) ===
      JSON.stringify({ ...exp, id: undefined })
    )
  )
  .map((exp: IExperience, index: number) => (
    <div key={exp.id || index} className="bg-white w-full rounded shadow-md">
      <div className="flex justify-between p-4 mt-5 items-top">
        <div>
          <p>Role : {exp.role}</p>
          <p>Company : {exp.company}</p>
          <p>From : {exp.from_year}</p>
          <p>To : {exp.to_year}</p>
          <p>Description : {exp.details}</p>
        </div>

        <span className="flex gap-2">
          <Button
            btnContentClassname="p-0"
            className="items-center"
            buttonContent={<Trash2 color="red" size={18} onClick={() => deleteExp(exp.id!)} />}
          />
          <Button
            btnContentClassname="p-0"
            buttonContent={
              <Pen
                onClick={() => getExpById(exp.id!)}
                color="green"
                size={18}
              />
            }
          />
        </span>
      </div>
    </div>
))}

        </motion.div>

<motion.div
  className="col-span-4 shadow-inner"
  initial={{ y: 30, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.6, delay: 0.4 }}
>
  
 <div className="sticky top-2 max-h-400">
      <div className=" overflow-y-auto hide-scrollbar rounded">
        <Templates selectedTempId={tempId} resume={{ ...sampleResume, ...resumeData }} />
      </div>
    </div>

</motion.div>


        <div className="col-span-12 fixed bottom-0 right-0 mb-6 px-10">
          <div className="flex justify-end gap-4 text-lg font-bold">
            <Button
              className="text-sky-600 underline"
              onClick={() => navigate(-1)}
              title="Previous"
            />
            <Button
              onClick={() => navigate('/build-resume/add-educ')}
              title="Next step"
              className="bg-sky-600 hover:bg-sky-700 text-white rounded-full py-4 px-8 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;