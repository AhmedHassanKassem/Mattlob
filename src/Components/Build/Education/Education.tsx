import { useNavigate } from "react-router-dom"
import Button from "../../../containers/Button"
import Input from "../../../containers/Input"
import Select from "../../../containers/Select"
import SideBar from "../../../containers/SideBar"
import { motion } from "framer-motion"
import Templates, { IEducation, IResume, sampleResume } from "../ChooseTemplate/Templates"
import { useEffect, useState } from "react"
import { Pen, Trash2 } from "lucide-react"

const Education = () => {
  const navigate = useNavigate()
  const [eduId, setEduId] = useState(0);
  const [edu, setEdu] = useState<IEducation>({
    degree: '',
    institution: '',
    field_of_Study: '',
    location: '',
    year: '',
  });
  const [resumeData, setResumeData] = useState<IResume>(() => ({
    ...sampleResume.resume!,
  }));
  const [tempId, setTempId] = useState(0);
  const workYears = Array.from({ length: 2025 - 1990 + 1 }, (_, i) => 1990 + i);
  const degreeOptions = [
    "High School Diploma",
    "Associate Degree",
    "Bachelor of Arts (BA)",
    "Bachelor of Science (BSc)",
    "Bachelor of Business Administration (BBA)",
    "Bachelor of Engineering (BEng)",
    "Master of Arts (MA)",
    "Master of Science (MSc)",
    "Master of Business Administration (MBA)",
    "Master of Engineering (MEng)",
    "Doctor of Philosophy (PhD)",
    "Doctor of Medicine (MD)",
    "Juris Doctor (JD)",
    "Diploma",
    "Certificate Program",
    "Postgraduate Diploma",
    "Other",
  ];



  const handleEduChange = (field: keyof IEducation, value: any) => {
    setEdu((prev) => ({
      ...prev!,
      [field]: value,
    }));
  }

  const addEducation = () => {
    try {
      const currentEdu = resumeData.education || [];
      const isDefaultOnly = currentEdu.length === 2 &&
        currentEdu.every((exp) =>
          sampleResume.resume?.education?.some((sample) =>
            JSON.stringify({ ...sample, id: undefined }) ===
            JSON.stringify({ ...exp, id: undefined })
          )
        );

      let cleanedEducation = isDefaultOnly ? [] : currentEdu;

      let updatedEducation;

      if (eduId > 0) {
        updatedEducation = cleanedEducation.map((educ) =>
          educ.id === eduId ? { ...edu, id: eduId } : educ
        );
      } else {
        const maxId = cleanedEducation.reduce((max, edu) => {
          return edu.id && edu.id > max ? edu.id : max;
        }, 0);
        const newEdu = { ...edu, id: maxId + 1 };
        updatedEducation = [...cleanedEducation, newEdu];
      }

      const updatedResume: IResume = {
        ...resumeData,
        education: updatedEducation,
      };

      setResumeData(updatedResume);
      localStorage.setItem("resumeData", JSON.stringify(updatedResume));

      setEdu({
        id: 0,
        degree: '',
        institution: '',
        field_of_Study: '',
        location: '',
        year: '',
      });

      setEduId(0); // Reset editing mode
    } catch (error) {
      console.error("Error in add Education:", error);
    }
  };

  const getEduById = (expId: number) => {
    setEduId(expId)

    const findEdu: IEducation = resumeData.education.find((exp: IEducation) => exp.id == expId)!
    if (findEdu) {
      setEdu({
        institution: findEdu.institution,
        field_of_Study: findEdu.field_of_Study,
        degree: findEdu.degree,
        location: findEdu.location,
        year: findEdu.year,
      })
    }
  }
  const deleteEdu = (eduId: number) => {
    const updatedEdu = resumeData.education.filter(
      (edu) => edu.id !== eduId
    );

    const updatedResume: IResume = {
      ...resumeData,
      education: updatedEdu,
    };

    setResumeData(updatedResume);
    localStorage.setItem("resumeData", JSON.stringify(updatedResume));
  };
  useEffect(() => {
    const myTempId = JSON.parse(localStorage.getItem('tempId') || '0');
    const storedResume = localStorage.getItem('resumeData');

    if (storedResume) {
      const parsedResume: IResume = JSON.parse(storedResume);

      const isDefault =
        parsedResume.education?.length === 1 &&
        Object.values(parsedResume.education[0]).every((val) =>
          typeof val === 'boolean' ? val === false : val === ''
        );

      if (isDefault || parsedResume.education?.length === 0) {
        parsedResume.education = [...sampleResume.resume?.education!];
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
    <motion.div className="overflow-y-auto hide-scrollbar h-screen w-full bg-gray-50">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-2">
          <SideBar />
        </div>

        <motion.div custom={1} className="col-span-6 m-5">
          <motion.div custom={2} className="mb-8">
            <p className="text-3xl font-extrabold text-sky-700">
              Tell us about your education
            </p>
            <p className="text-sm text-gray-600 mt-1 max-w-lg">
              Enter your education experience so far, even if you are a current
              student or did not graduate.
            </p>
            <p className="text-sm pt-8 font-semibold">* these fields are mandatory</p>
          </motion.div>

          <motion.form

            custom={3}
            className="grid grid-cols-12 gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <motion.div custom={4} className="col-span-6 px-2">
              <Input
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                label="Institution"
                value={edu?.institution}
                onChange={(e) => handleEduChange("institution", e.target.value)}
              />
            </motion.div>

            <motion.div custom={5} className="col-span-6 px-2">
              <Input
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                label="School Location"
                value={edu?.location}
                onChange={(e) => handleEduChange("location", e.target.value)}
              />
            </motion.div>

            <motion.div custom={6} className="col-span-6 px-2">
              <Select
                forSelect="Select"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                label="Degree"
                oneValue={
                  <>
                    {degreeOptions.map((deg, index) => (
                      <option key={index} value={deg}>
                        {deg}
                      </option>
                    ))}
                  </>
                }
                value={edu?.degree}
                onChange={(e) => handleEduChange("degree", e.target.value)}
              />
            </motion.div>


            <motion.div custom={8} className="col-span-6 px-2">
              <Input
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                label="Field of study"
                value={edu?.field_of_Study}
                onChange={(e) => handleEduChange("field_of_Study", e.target.value)}
              />
            </motion.div>

            <motion.div custom={8} className="col-span-6 px-2 ">
              <p>
                Graduation Date
              </p>

              <Select
                labelDivClassname="h-0"
                forSelect="Year"
                className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                oneValue={
                  <>
                    {workYears.map((year, index) => (
                      <option key={index} value={year}>
                        {year}
                      </option>
                    ))}
                  </>
                }
                value={edu?.year}
                onChange={(e) => handleEduChange('year', e.target.value)}
              />
            </motion.div>
            <div className="col-span-12 flex justify-end mt-4">
              <Button
                onClick={addEducation}
                title={eduId == 0 ? "Add Education" : "Update Education"}
                className="bg-sky-600 hover:bg-sky-700 text-white rounded-full py-2 px-6 transition-all duration-300"
              />
            </div>

          </motion.form>
          {resumeData.education
            .filter((edu) =>
              !sampleResume.resume?.education?.some((sample) =>
                JSON.stringify({ ...sample, id: undefined }) ===
                JSON.stringify({ ...edu, id: undefined })
              )
            )
            .map((edu: IEducation, index: number) => (
              <div key={edu.id || index} className="bg-white w-full rounded shadow-md">
                <div className="flex justify-between p-4 mt-5 items-top">
                  <div>
                    <p>Institution : {edu.institution}</p>
                    <p>Field of study : {edu.field_of_Study}</p>
                    <p>Degree : {edu.degree}</p>
                    <p>Location : {edu.location}</p>
                    <p>Year : {edu.year}</p>
                  </div>

                  <span className="flex gap-2">
                    <Button
                      btnContentClassname="p-0"
                      className="items-center"
                      buttonContent={<Trash2 color="red" size={18} onClick={() => deleteEdu(edu.id!)} />}
                    />
                    <Button
                      btnContentClassname="p-0"
                      buttonContent={
                        <Pen
                          onClick={() => getEduById(edu.id!)}
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
          className="col-span-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >

    <div className="sticky top-2 max-h-full">
      <div className=" overflow-y-auto hide-scrollbar rounded">
        <Templates selectedTempId={tempId} resume={{ ...sampleResume, ...resumeData }} />
      </div>
    </div>

        </motion.div>

        <motion.div

          custom={10}
          className="col-span-12 absolute right-0 bottom-0 mb-10 px-10"
        >
          <div className="flex justify-end items-center">
            <div className="flex gap-6 text-lg font-bold">
              <Button
                className="text-sky-600 hover:text-sky-700 transition-colors duration-300 transform hover:scale-110"
                titleClassname="underline"
                onClick={() => navigate(-1)}
                title="Previous"
              />
              <Button
                title="Next step"
                onClick={() => navigate("/build-resume/add-skills")}
                titleClassname="bg-sky-600 p-3 rounded-full text-white py-4 px-8 hover:bg-sky-700 transition-colors duration-300 transform hover:scale-110"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Education
