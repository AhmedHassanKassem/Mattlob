import { FC, useEffect } from "react"
import Button from "./Button"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../Redux/store"
import { setFoundCv } from "../Redux/Slices/foundCv"
import { useTranslation } from "react-i18next"


interface selectProops{
    selected? : boolean
    selectedTemp? : number
}
const SelectBar : FC<selectProops>= ({selected , selectedTemp}) => {
const dispatch : AppDispatch = useDispatch();
  const isDark = useSelector((state: RootState) => state.isDark.isDark);
const {t} = useTranslation()
  const findCv = useSelector((state : RootState)=> state.foundCv.localStorageCv)
    const navigate = useNavigate()
useEffect(() => {
  if (findCv) {
    const updatedCv = { ...findCv, temp_id: selectedTemp };
    dispatch(setFoundCv(updatedCv))
  }
}, [selected, selectedTemp]);

  return (
 <div>
      <div
        className={`fixed inset-x-0 bottom-0 z-50 h-20 shadow-lg border transition-colors duration-300 ${
          isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex lg:justify-end justify-center items-center pt-7 lg:px-40">
          <div className="flex gap-4 text-lg font-bold">
            <Button
              title={t("useThisTemp")}
              disabled={findCv.temp_id == 0}
              onClick={() => navigate("/build-resume/select-resume")}
              titleClassname={`p-3 rounded-full text-white py-4 px-8 transition-colors duration-300 ${
                findCv.temp_id == 0
                  ? isDark
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-gray-400 cursor-not-allowed"
                  : isDark
                  ? "bg-sky-700 hover:bg-sky-800"
                  : "bg-sky-600 hover:bg-sky-700"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelectBar
