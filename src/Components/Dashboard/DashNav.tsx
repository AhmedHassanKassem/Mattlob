import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, SidebarCloseIcon, SidebarOpenIcon, Home, Globe } from "lucide-react";
import Button from "../../Containers/Button";
import i18n from "../../i18n";
import { setLangSlice } from "../../Redux/Slices/langSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/store";
import { useTranslation } from "react-i18next";
interface dashNavProps {
  className: string
  selectedTabs?: string;
  setSelectedTabs?: React.Dispatch<React.SetStateAction<string>>;
  toggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  lang?: string
}

const DashNav: FC<dashNavProps> = ({ toggleSidebar, isSidebarOpen, className, lang }) => {
  const navigate = useNavigate();
    const [langValue, setLangValue] = useState("")
    const {t} = useTranslation()    
    const dispatch : AppDispatch = useDispatch()
   const handleToggleLang = () => {
    const nowUrl = new URL(window.location.href);
    const urlParams = new URLSearchParams(nowUrl.search);

    const currentLang = urlParams.get("lang") || "en";
    const newLang = currentLang === "en" ? "ar" : "en";
    urlParams.set("lang", newLang);
    window.history.replaceState({}, "", `${nowUrl.pathname}?${urlParams.toString()}`);
    setLangValue(newLang)
    dispatch(setLangSlice(newLang));
    i18n.changeLanguage(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "en" ? "ltr" : "rtl";
    document.body.classList.remove("en", "ar");
    document.body.classList.add(newLang);
  };

  return (
    <div className={`${className}`}>
      {/* Sidebar */}


      {/* Main Content */}
      <div className="flex-1 transition-all duration-300">
        <nav className="border-b border-gray-200 sticky top-0 bg-sky-900 ">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">

              <Button
                onClick={toggleSidebar}
                btnContentClassname="p-0"
                className="text-white"
                buttonContent={
                  <>
                    {lang === "en" ? (
                      isSidebarOpen ? <SidebarCloseIcon size={20} /> : <SidebarOpenIcon size={20} />
                    ) : (
                      isSidebarOpen ? <SidebarOpenIcon size={20} /> : <SidebarCloseIcon size={20} />
                    )}
                  </>

                }
              />
                
              {/* Search + Notifications */}
              <div className="flex items-center gap-4">
                <div className="flex">
                  <Button
                    className="text-white rounded-lg px-5"
                    btnContentClassname="p-0"
                    btnTitle="Back to home"
                    onClick={() => navigate("/home")}
                    buttonContent={
                      <div className="flex text-center justify-center items-center py-1">
                        <Home size={18} />
                      </div>
                    }
                  />
                  <button
                onClick={handleToggleLang}
                title="Change language"
                className={`p-2 flex gap-1 items-center rounded-lg transition-all duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200`}
              >
                
                 <p className="lg:flex hidden text-sm font-bold" 
                 style={{ fontFamily: `${langValue === "ar" ? 'Poppins, sans-serif' :  'ArabicFont, sans-serif'}` }}>{t("english")}</p>
                 <Globe size={18}/>
              </button>
                </div>

                <div className="hidden lg:block relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-64 bg-white pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>

                <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell color="white" size={20} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    5
                  </span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default DashNav;
