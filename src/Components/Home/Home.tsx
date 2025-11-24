import { ArrowRight, Zap, Layout, Share2, CheckCircle, Sparkles, ArrowLeft } from "lucide-react"

import { useSelector } from "react-redux"
import { RootState } from "../../Redux/store"
import { useTranslation } from "react-i18next"

const Home = () => {
  const {t} = useTranslation()
const isDark = useSelector((state : RootState)=> state.isDark.isDark)
const lang = useSelector((state : RootState)=> state.lang.lang)
  const templates = [
    { name: "Modern", icon: "✨", desc: "Clean and contemporary" },
    { name: "Professional", icon: "💼", desc: "Corporate style" },
    { name: "Creative", icon: "🎨", desc: "Stand out design" },
    { name: "Minimal", icon: "📄", desc: "Simple and elegant" },
  ]

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Quick Build",
      desc: "Create your resume in minutes with our intuitive editor",
    },
    {
      icon: <Layout className="w-6 h-6" />,
      title: "Beautiful Templates",
      desc: "Choose from professionally designed resume templates",
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Easy Sharing",
      desc: "Export as PDF or share your resume directly",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "ATS Friendly",
      desc: "Optimized for Applicant Tracking Systems",
    },
  ]

  const stats = [
    { number: "50K+", label: "Resumes Created" },
    { number: "95%", label: "Success Rate" },
    { number: "100+", label: "Templates" },
  ]

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-900 text-white" : "bg-gradient-to-b from-blue-50 via-white to-blue-50 text-gray-900"}`}>
      
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            <div className="space-y-6">
              <div className="inline-block">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${isDark ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-700"}`}>
                  ✨ {t("Build Your Professional Resume")}
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-bold leading-tight bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {t("Stand Out")} <br /> {t("Get Hired")}
              </h1>

              <p className={`text-xl leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
{t("Create a stunning, professional resume in minutes. Impress employers with our beautifully crafted templates and powerful tools.")}              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="px-8 py-4 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200 flex items-center justify-center gap-2 group">
                  {t("Get Started")}
                  
                  {lang === "en" ?<ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} /> : <ArrowLeft className="group-hover:translate-x-1 transition-transform" size={20} />}
                </button>
                <button className={`px-8 py-4 rounded-lg font-semibold border-2 transition-all duration-200 ${isDark ? "border-gray-600 hover:bg-gray-800" : "border-gray-300 hover:bg-gray-100"}`}>
                  {t("View Templates")}
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                {stats.map((stat, idx) => (
                  <div key={idx}>
                    <p className="text-2xl font-bold text-blue-600">{stat.number}</p>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>{t(stat.label)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual */}
            <div className="lg:block relative hidden">
              <div className={`relative h-100 rounded-2xl overflow-hidden shadow-2xl ${isDark ? "bg-gray-800" : "bg-white"}`}>
                {/* Mock Resume */}
                <div className="p-6 h-full flex flex-col">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-16 rounded-lg mb-4"></div>
                  <div className="space-y-3 flex-1">
                    <div className={`h-3 rounded ${isDark ? "bg-gray-700" : "bg-gray-200"}`}></div>
                    <div className={`h-3 rounded ${isDark ? "bg-gray-700" : "bg-gray-200"}`}></div>
                    <div className={`h-3 rounded w-2/3 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}></div>
                  </div>
                  <div className="space-y-2">
                    <div className={`h-2 rounded ${isDark ? "bg-gray-700" : "bg-gray-200"}`}></div>
                    <div className={`h-2 rounded w-3/4 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}></div>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute bottom-1 right-1 bg-gradient-to-r from-green-400 to-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 font-semibold">
                  <CheckCircle size={20} />
                  {t("Ready to Download")}
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 -z-10 rounded-2xl blur-2xl opacity-20 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 ${isDark ? "bg-gray-800/50" : "bg-white/50"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t("Why Choose Mattlob?")}</h2>
            <p className={`text-xl ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              {t("Powerful features designed to help you succeed")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-xl transition-all duration-200 hover:shadow-lg ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-white hover:bg-blue-50 border border-gray-200"
                }`}
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2">{t(feature.title)}</h3>
                <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  {t(feature.desc)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t("Choose Your Template")}</h2>
            <p className={`text-xl ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              {t("Professional templates for every industry")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template, idx) => (
              <div
                key={idx}
                className={`group cursor-pointer rounded-xl overflow-hidden transition-all duration-200 ${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-white hover:shadow-lg border border-gray-200"
                }`}
              >
                <div className={`h-64 flex items-center justify-center text-5xl ${isDark ? "bg-gray-700" : "bg-gradient-to-br from-blue-100 to-cyan-100"}`}>
                  {template.icon}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1">{t(template.name)}</h3>
                  <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {t(template.desc)}
                  </p>
                  <button className="w-full px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 text-white group-hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                    {t("Use Template")}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className={`max-w-4xl mx-auto rounded-2xl p-12 text-center ${isDark ? "bg-gradient-to-r from-blue-900 to-cyan-900" : "bg-gradient-to-r from-blue-600 to-cyan-600"}`}>
          <h2 className="text-4xl font-bold text-white mb-4">{t("Ready to Build Your Resume?")}</h2>
          <p className="text-blue-100 text-lg mb-8">
            {t("Join thousands of professionals who've landed their dream jobs with Mattlob")}
          </p>
          <button className="px-8 py-4 rounded-lg font-semibold bg-white text-blue-600 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 mx-auto group">
            <Sparkles size={20} />
            {t("Create Resume Now")}
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 sm:px-6 lg:px-8 border-t ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">{t("Mattlob")}</h3>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {t("Build your professional resume in minutes")}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("Product")}</h4>
              <ul className={`space-y-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                <li><a href="#" className="hover:text-blue-600 transition">{t("Templates")}</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">{t("Features")}</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">{t("Pricing")}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("Company")}</h4>
              <ul className={`space-y-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                <li><a href="#" className="hover:text-blue-600 transition">{t("About")}</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">{t("Blog")}</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">{t("Contact")}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t("Legal")}</h4>
              <ul className={`space-y-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                <li><a href="#" className="hover:text-blue-600 transition">{t("Privacy")}</a></li>
                <li><a href="#" className="hover:text-blue-600 transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className={`pt-8 border-t text-center text-sm ${isDark ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-600"}`}>
            <p>&copy; {t("2025 Mattlob. All rights reserved.")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home