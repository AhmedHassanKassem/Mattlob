import { FC, useState } from "react";
import { Outlet } from "react-router-dom";
import DashNav from "./DashNav";
import DashboardSidebar from "./DashSidebar";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";

interface MainProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Main: FC<MainProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [selectedTabs, setSelectedTabs] = useState("jobs");
  const lang = useSelector((state : RootState)=> state.lang.lang)
  return (
    <div className="grid grid-cols-12">
      {/* Sidebar */}
      <DashboardSidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <div
        className={`col-span-12 bg-[#f2f2f7] transition-all duration-200 ${
          isSidebarOpen ? `${lang === "en" ?  "lg:ml-64" : "lg:mr-64"}` : ""
        }`}
      >
        <DashNav
        lang={lang}
        className={`col-span-12 bg-[#000] transition-all duration-200 ${
          isSidebarOpen ? ` ${lang === "en" ? "ml-50 lg:ml-0" : "mr-45 lg:mr-0"}` : ""
        }`}
          selectedTabs={selectedTabs}
          setSelectedTabs={setSelectedTabs}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        <div className={"p-4"}>
          {/* هنا الـ Routes من App.tsx هتظهر */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Main;
