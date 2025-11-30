import { useEffect, useState } from 'react';

import Templates, { sampleResume } from './Templates';
import CheckboxAdvanced from '../../../Containers/AnimateChekbox';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Redux/store';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';

// Choose component:
const Choose = () => {
  const [selectedTempId, setSelectedTemplate] = useState(0)
  const [withColmun, setWithCoumn] = useState(false)
  const [withImg, setWithImg] = useState(false)
  const isDark = useSelector((state: RootState) => state.isDark.isDark);
  const { t } = useTranslation()
  useEffect(() => {
    const tempId = Number(localStorage.getItem("tempId"))
    if (tempId) {
      setSelectedTemplate(tempId)
    }

  }, [])

  const handlChange = (name: string, checked: boolean) => {
    if (name == "withColumn") {
      setWithCoumn(checked)
    }
    if (name == "withImg") {
      setWithImg(checked)
    }

  }

  return (
    <div
      className={`w-full mx-auto py-10 px-6 transition-colors duration-300 ${isDark ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
    >
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">
          {t("Best templates for jobseekers with little experience")}
        </h1>
        <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {t("You can always change your template later.")}
        </p>
      </div>

      <div className="lg:flex gap-10 block">
        {/* Filter Panel */}
        <div className="text-sm min-w-[150px] lg:block flex justify-evenly">
          <div className="mb-6">
            <h2 className="font-semibold mb-2">{t("headShot")}</h2>
            <label className="flex items-center gap-2 mb-1 cursor-pointer">
              <CheckboxAdvanced
                checked={withImg}
                onChange={() => handlChange("withImg", !withImg)}
              />
              {t("withPhoto")}
            </label>
          </div>

          <div>
            <h2 className="font-semibold mb-2">{t("columns")}</h2>
            <label className="flex items-center gap-2 mb-1 cursor-pointer">
              <CheckboxAdvanced
                checked={withColmun}
                onChange={() => handlChange("withColumn", !withColmun)}
              />
              {t("withColumn")}
            </label>
          </div>
        </div>

        {/* Templates Grid */}
        <div
          className="w-full gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          <Templates
            key={i18n.language}
            withCol={withColmun}
            withImg={withImg}
            resume={sampleResume}
            selectedTempId={selectedTempId}
          />
        </div>
      </div>
    </div>
  );
};

export default Choose;