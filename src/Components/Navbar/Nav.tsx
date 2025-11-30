import { Menu, X, Moon, Sun, LogOut, Globe } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AppDispatch, RootState } from "../../Redux/store"
import { useDispatch, useSelector } from "react-redux"
import { setIsDarkState } from "../../Redux/Slices/isDarkSlice"
import { setLangSlice } from "../../Redux/Slices/langSlice"
import { useTranslation } from "react-i18next"
import i18n from "../../i18n"
import { clearFoundUser } from "../../Redux/Slices/userSlice"
import { removeCookie } from "../../Utils/cookies"

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const isDark = useSelector((state: RootState) => state.isDark.isDark)
  const [langValue, setLangValue] = useState("")
  const dispatch: AppDispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user.localStorageUser)
  const { t } = useTranslation()



  const handleToggle = () => {
    !isDark ? localStorage.setItem("DarkMode", "on") : localStorage.setItem("DarkMode", "off")
    dispatch(setIsDarkState(!isDark))
  }
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

  useEffect(() => {
    const nowUrl = new URL(window.location.href);
    const urlParams = new URLSearchParams(nowUrl.search);
    const supportedLangs = ["en", "ar"];
    const langFromUrl = urlParams.get("lang");
    const langToUse = supportedLangs.includes(langFromUrl || "") ? langFromUrl! : "ar";
    if (!langFromUrl) {
      urlParams.set("lang", "ar");
      window.history.replaceState({}, "", `${nowUrl.pathname}?${urlParams.toString()}`);
    }
    dispatch(setLangSlice(langToUse));
    i18n.changeLanguage(langToUse);
    document.documentElement.lang = langToUse;
    document.documentElement.dir = langToUse === "en" ? "ltr" : "rtl";
    document.body.classList.remove("en", "ar");
    document.body.classList.add(langToUse);
  }, [dispatch, i18n]);
  const handleLogout = () => {
    removeCookie('token')
    localStorage.clear()
    dispatch(clearFoundUser())
  }


console.log(user);

  return (
    <div className={`transition-colors duration-300 ${isDark ? "bg-slate-900 text-white" : "bg-white text-gray-900"} no-print`}>
      <nav className={`${isDark ? "bg-slate-800 shadow-lg shadow-slate-900/50" : "bg-white shadow-md"} transition-all duration-300`}>
        <div className=" mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/home" className="flex items-center gap-2 group">
                <img
                  src={isDark ? "/logoWhite.png" : "/logoBlue.png"}
                  alt="logo"
                  className="w-10 sm:w-12 transition-transform duration-200 group-hover:scale-105"
                />

              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {user && user.name ?
                <>
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${isDark ? "bg-blue-600" : "bg-blue-100 text-blue-600"}`}>
                      {user?.name ? user.name.charAt(0).toUpperCase() : ""}
                    </div>
                    <div className="flex flex-col">
                      <div className="text-sm font-semibold">{t("HiThere")},
                        <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          {" " + user.name?.split(" ")[0]}
                        </span></div>

                    </div>
                  </div>

                  <div className="h-8 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-30"></div>

                  <div className="flex gap-3">
                    {user.role_id === 1 && <><Link
                      to={'/build-resume/myresumes'}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isDark
                        ? "hover:bg-slate-700 text-gray-200"
                        : "hover:bg-gray-100 text-gray-700"}`}
                    >
                      {t("MyResume")}
                    </Link>
                    <Link
                      to={'/build-resume/choose-temp'}
                      className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200"
                    >
                        {t("BuildResume")}
                      </Link></>}
                    {/* <Link
                      to={'/dashboard'}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isDark
                        ? "border border-gray-600 hover:bg-slate-700"
                        : "border border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      {t("dashboard")}
                    </Link>    */}
                    {/* <Link
                    to={'/pricing'}
                    className={`px-4 py-2 rounded-lg hover:text-red-500 font-medium transition-all duration-200 ${isDark
                      ? "hover:bg-slate-700 text-gray-200"
                      : "hover:bg-gray-100 text-gray-700"
                      }`}
                  >
                    {t("pricing")}
                  </Link> */}
                  <Link
                    to={'/build-resume/choose-temp'}
                    className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200"
                  >
                    {t("BuildResume")}
                  </Link>
                  </div> 
                </>
                :  <Link
                    to={'/login'}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isDark
                      ? "hover:bg-slate-700 text-gray-200"
                      : "hover:bg-gray-100 text-gray-700"
                      }`}
                  >
                    {t("signIn")}
                  </Link>
                  
                  
                  }

              {/* Theme Toggle */}
              <button
                onClick={handleToggleLang}
                title="Change language"
                className={`p-2 flex gap-1 items-center rounded-lg transition-all duration-200 ${isDark
                  ? "bg-slate-700 text-white hover:bg-slate-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >

                <p className="lg:flex hidden text-sm font-bold"
                  style={{ fontFamily: `${langValue === "ar" ? 'Poppins, sans-serif' : 'ArabicFont, sans-serif'}` }}>{t("english")}</p><Globe size={18} />
              </button>
              <button
                onClick={handleToggle}
                className={`p-2 rounded-lg transition-all duration-200 ${isDark
                  ? "bg-slate-700 text-yellow-400"
                  : "bg-gray-100 text-gray-700"
                  }`}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              {/* Logout */}
              {user && user.name ? <button
                onClick={handleLogout}
                className="p-2 rounded-lg transition-all duration-200 hover:bg-red-500/10 text-red-500 hover:scale-110"
                title={t("signOut")}
              >
                <LogOut size={20} />
              </button> : null}
            </div>

            {/* Mobile Menu Button & Theme Toggle */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={handleToggle}
                className={`p-2 rounded-lg transition-all duration-200 ${isDark
                  ? "bg-slate-700 text-yellow-400"
                  : "bg-gray-100 text-gray-700"
                  }`}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={handleToggleLang}
                title="Change language"
                className={`p-2 flex gap-1 items-center rounded-lg transition-all duration-200 ${isDark
                  ? "bg-slate-700 text-white hover:bg-slate-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >

                <p className="lg:flex hidden text-sm font-bold" style={{ fontFamily: `${langValue === "ar" ? 'Poppins, sans-serif' : 'ArabicFont, sans-serif'}` }}>{t("english")}</p><Globe size={18} />
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`p-2 rounded-lg transition-all duration-200 ${isDark ? "hover:bg-slate-700" : "hover:bg-gray-100"
                  }`}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className={`md:hidden pb-4 border-t ${isDark ? "border-slate-700" : "border-gray-200"} animate-in fade-in slide-in-from-top-2 duration-200`}>
              {user && user.name ? (
                <>
                  <div className={`flex items-center gap-3 px-2 py-4 rounded-lg my-2 ${isDark ? "bg-slate-700/50" : "bg-gray-50"}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${isDark ? "bg-blue-600" : "bg-blue-100 text-blue-600"}`}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{t("HiThere")}</p>
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        {user.name?.split(" ")[0]}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                     { <div className="flex flex-col justify-center items-center"><Link
                      to={'/build-resume/myresumes'}
                      className={`w-full justify-center  px-4 py-3 text-center rounded-lg font-medium transition-all duration-200 ${isDark
                        ? "hover:bg-slate-700 text-gray-200"
                        : "hover:bg-gray-100 text-gray-700"}`}
                    >
                      {t("MyResume")}
                    </Link>
                    <Link
                      to={'/build-resume/choose-temp'}
                      className="w-full justify-center  px-4 py-3 rounded-lg text-center font-medium bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200"
                    >
                        {t("BuildResume")}
                      </Link></div>}
                      
                    {/* <Link
                      to={'/dashboard'}
                      className={`w-full justify-center px-4 py-3 rounded-lg font-medium  transition-all duration-200 flex items-center gap-2 ${isDark
                        ? "border border-gray-600 hover:bg-slate-700"
                        : "border border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      {t("dashboard")}
                    </Link> */}
                    <Link
                    to={'/login'}
                      onClick={() => {
                        handleLogout()
                        setMenuOpen(false)
                      }}
                      className="w-full justify-center px-4 py-3 rounded-lg font-medium text-red-500 hover:bg-red-500/10 transition-all duration-200 flex items-center gap-2"
                    >
                      <LogOut size={18} /> {t("signOut")}
                    </Link>
                  </div>
                </>
              ) : <Link
                    to={'/login'}
                    className={`w-full justify-center px-4 py-2 mt-3 rounded-lg font-medium  transition-all duration-200 flex items-center gap-2 ${isDark
                        ? "border border-gray-600 hover:bg-slate-700"
                        : "border border-gray-300 hover:bg-gray-50"
                        }`}
                  >
                    {t("signIn")}
                  </Link>}
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

export default Navbar