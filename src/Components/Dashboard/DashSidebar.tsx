import { FC, useState } from "react"

import { BatteryFull, ChevronRight, CircleX, Clock10, HelpCircle, ListCheck, Mails, NotepadText, Package, PlusSquare, SearchIcon, Settings, Settings2, Users, XCircle } from "lucide-react";
import Button from "../../Containers/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useTranslation } from "react-i18next";
interface SidebarProps {
    isSidebarOpen?: boolean;
     toggleSidebar?: () => void;
}

const DashboardSidebar: FC<SidebarProps> = ({isSidebarOpen }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const lang = useSelector((state : RootState)=> state.lang.lang)
   const {t} = useTranslation()
    const currentPath = location.pathname.replace("/dashboard/", "");

    const goTo = (tab: string) => {
        navigate(`/dashboard/${tab}`);
    };

    return ( 
       <div >
         <div
            className={`fixed z-50 h-full bg-sky-900  transition-all duration-300
    ${isSidebarOpen ? "lg:w-64" : "w-0"}`}
        >
            {/* Logo */}
            {isSidebarOpen && <div className="flex items-center justify-center  mt-5">
                <img
      className={` object-cover`}
      src={`../../logoNameWhite.png`}
      alt="logo"
      width={100}
    />

             
            </div>}


            {/* Navigation */}
            <div className="py-4 flex-1 space-y-1">
                <div>
                    {/* Dashboard */}
                  
                    <div
                        title={t("Search Roles")}
                        onClick={() => goTo!("searchRoles")}
                        className={`flex items-center gap-3 ${isSidebarOpen ? `${lang === "en" ?  "pl-5"  : "pr-5"}` : "justify-center"} py-2.5  mx-2 rounded-md cursor-pointer ${isSidebarOpen && currentPath == "searchRoles"
                            ? "text-sky-500 bg-white text-center font-bold"
                            : "p-1 text-white text-center"
                            } relative`}
                    >
                        <SearchIcon
                            size={20}
                            className={`${isSidebarOpen && currentPath == "searchRoles" ? "text-sky-600 bg-white" : "text-white text-center"
                                }`}
                        />
                        {isSidebarOpen && <span className={"text-sm"}>{t("Search Roles")}</span>}
                        {isSidebarOpen && currentPath == "searchRoles" ? (
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-sky-600 rounded-l-md"></div>
                        ) : null}
                    </div>

                    {/* Analytics */}
                    <div
                        title={t("Engaged Roles")}

                        onClick={() => goTo!("engagedRoles")}
                        className={`flex items-center gap-3 ${isSidebarOpen ? `${lang === "en" ? "pl-5" : "pr-5"}` : "justify-center"} py-2.5  mx-2 rounded-md cursor-pointer ${isSidebarOpen && currentPath == "engagedRoles"
                            ? "text-sky-500 bg-white text-center font-bold"
                            : "p-1 text-white text-center"
                            } relative`}
                    >
                        <NotepadText
                            size={20}
                            className={`${isSidebarOpen && currentPath == "engagedRoles" ? "text-sky-600 bg-white" : "text-white text-center"
                                }`}
                        />
                        {isSidebarOpen && <span className={"text-sm"}>{t("Engaged Roles")}</span>}
                        {isSidebarOpen && currentPath == "engagedRoles" ? (
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-sky-600 rounded-l-md"></div>
                        ) : null}
                    </div>

                    {/* Orders */}
                    <div
                        title={t("Closed/Disengaged")}

                        onClick={() => goTo!("disengaged")}
                        className={`flex items-center gap-3 ${isSidebarOpen ? `${lang === "en" ? "pl-5" : "pr-5"}` : "justify-center"} py-2.5  mx-2 rounded-md cursor-pointer ${isSidebarOpen && currentPath == "disengaged"
                            ? "text-sky-500 bg-white text-center font-bold"
                            : "p-1 text-white text-center"
                            } relative`}
                    >
                        <XCircle
                            size={20}
                            className={`${isSidebarOpen && currentPath == "disengaged" ? "text-sky-600 bg-white" : "text-white text-center"
                                }`}
                        />
                        {isSidebarOpen && <span className={"text-sm"}>{t("Closed/Disengaged")}</span>}

                        {isSidebarOpen && currentPath == "disengaged" ? (
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-sky-600 rounded-l-md"></div>
                        ) : null}
                    </div>

                    {/* Products */}
                    <div
                        title="Products"

                        onClick={() => goTo!("products")}
                        className={`flex items-center gap-3 ${isSidebarOpen ? `${lang === "en" ? "pl-5" : "pr-5"}` : "justify-center"} py-2.5  mx-2 rounded-md cursor-pointer ${isSidebarOpen && currentPath == "products"
                            ? "text-sky-500 bg-white text-center font-bold"
                            : "p-1 text-white text-center"
                            } relative`}
                    >
                        <Package
                            size={20}
                            className={`${isSidebarOpen && currentPath == "products" ? "text-sky-600 bg-white" : "text-white text-center"
                                }`}
                        />
                        {isSidebarOpen && <span className={"text-sm"}>Products</span>}
                        {isSidebarOpen && currentPath == "products" ? (
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-sky-600 rounded-l-md"></div>
                        ) : null}
                    </div>

                    <div
                        title={t("Supply Candidates")}
                        onClick={() => { setIsOpen(!isOpen) }}
                        className={`flex items-center gap-3 ${isSidebarOpen ? `${lang === "en" ? "pl-5" : "pr-5"}` : "justify-center"
                            } py-2.5 mx-2 rounded-md cursor-pointer ${isOpen ? "text-sky-500 bg-white font-bold" : "text-white"
                            } relative transition-colors duration-200`}
                    >
                        <ChevronRight
                            size={20}
                            className={`transition-transform duration-300 ${isOpen ? "rotate-90 text-sky-600 bg-white" : "text-white"
                                }`}
                        />
                        {isSidebarOpen && <span className="text-sm">{t("Supply Candidates")}</span>}
                        {isSidebarOpen && isOpen && (
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-sky-600 rounded-l-md"></div>
                        )}
                    </div>

                    {/* Accordion Content */}
                    {isOpen && (
                        <div className={`${isSidebarOpen ? "pl-10" : "pl-4 flex flex-col"} py-2 space-y-2 text-white text-sm gap-2 `}>
                            <div>
                                <Button className={`${isSidebarOpen && currentPath == "add-candidate" ? "text-sky-600 bg-white p-1 rounded" : "p-1 text-white text-center"
                                    }`} onClick={() => goTo!("add-candidate")} buttonContent={<div className="flex gap-1 items-center">
                                        <PlusSquare size={18}

                                        />
                                        {isSidebarOpen && <p>{t("Add new candidate")}</p>}
                                    </div>} />
                            </div>

                            <div>
                                <Button className={`${isSidebarOpen && currentPath == "all-candidates" ? "text-sky-600 bg-white p-1 rounded" : "p-1 text-white text-center"
                                    }`} onClick={() => goTo!("all-candidates")} buttonContent={<div className="flex gap-1 items-center">
                                        <Users size={18}

                                        /> {isSidebarOpen && <p >{t("All candidates")}</p>}

                                    </div>} />
                            </div>
                            <div>
                                <Button className={`${isSidebarOpen && currentPath == "awaitFeed" ? "text-sky-600 bg-white p-1 rounded" : "p-1 text-white text-center"
                                    }`} onClick={() => goTo!("awaitFeed")} buttonContent={<div className="flex gap-1 items-center">
                                        <Clock10 size={18}

                                        /> {isSidebarOpen && <p>{t("Awaiting feedback")}</p>}

                                    </div>} />
                            </div>
                            <div>
                                <Button className={`${isSidebarOpen && currentPath == "shortListed" ? "text-sky-600 bg-white p-1 rounded" : "p-1 text-white text-center"
                                    }`} onClick={() => goTo!("shortListed")} buttonContent={<div className="flex gap-1 items-center">
                                        <ListCheck size={18}

                                        /> {isSidebarOpen && <p>{t("Short listed")}</p>}

                                    </div>} />
                            </div>
                            <div>
                                <Button className={`${isSidebarOpen && currentPath == "offered" ? "text-sky-600 bg-white p-1 rounded" : "p-1 text-white text-center"
                                    }`} onClick={() => goTo!("offered")} buttonContent={<div className="flex gap-1 items-center">
                                        <Mails size={18}

                                        /> {isSidebarOpen && <p>{t("Offered")}</p>}

                                    </div>} />
                            </div>
                            <div>
                                <Button className={`${isSidebarOpen && currentPath == "filled" ? "text-sky-600 bg-white p-1 rounded" : "p-1 text-white text-center"
                                    }`} onClick={() => goTo!("filled")} buttonContent={<div className="flex gap-1 items-center">
                                        <BatteryFull size={18}

                                        /> {isSidebarOpen && <p>{t("Filled jobs")}</p>}

                                    </div>} />
                            </div>
                            <div>
                                <Button className={`${isSidebarOpen && currentPath == "rejected" ? "text-sky-600 bg-white p-1 rounded" : "p-1 text-white text-center"
                                    }`} onClick={() => goTo!("rejected")} buttonContent={<div className="flex gap-1 items-center">
                                        <CircleX size={18}

                                        /> {isSidebarOpen && <p>{t("Rejected")}</p>}

                                    </div>} />
                            </div>


                        </div>
                    )}

                    {/* Customers */}
                    <div
                        title={t("Customers")}

                        onClick={() => goTo!("customers")}
                        className={`flex items-center gap-3 ${isSidebarOpen ? `${lang === "en" ? "pl-5" : "pr-5"}` : "justify-center"} py-2.5  mx-2 rounded-md cursor-pointer ${isSidebarOpen && currentPath == "customers"
                            ? "text-sky-500 bg-white text-center font-bold"
                            : "p-1 text-white text-center"
                            } relative`}
                    >
                        <Users
                            size={20}
                            className={`${isSidebarOpen && currentPath == "customers" ? "text-sky-600 bg-white" : "text-white text-center"
                                }`}
                        />
                        {isSidebarOpen && <span className={"text-sm"}>{t("Customers")}</span>}
                        {isSidebarOpen && currentPath == "customers" ? (
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-sky-600 rounded-l-md"></div>
                        ) : null}
                    </div>
                    <div
                        title={t("Post Job")}

                        onClick={() => goTo!("managejobs")}
                        className={`flex items-center gap-3 ${isSidebarOpen ? `${lang === "en" ? "pl-5" : "pr-5"}` : "justify-center"} py-2.5  mx-2 rounded-md cursor-pointer ${isSidebarOpen && currentPath == "managejobs"
                            ? "text-sky-500 bg-white text-center font-bold"
                            : "p-1 text-white text-center"
                            } relative`}
                    >
                        <Settings2
                            size={20}
                            className={`${isSidebarOpen && currentPath == "managejobs" ? "text-sky-600 bg-white" : "text-white text-center"
                                }`}
                        />
                        {isSidebarOpen && <span className={"text-sm"}>{t("Manage Jobs")}</span>}
                        {isSidebarOpen && currentPath == "managejobs" ? (
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-sky-600 rounded-l-md"></div>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Footer menu */}
            <div className="py-4 space-y-1">
                <div
                    title="FAQ"

                    onClick={() => goTo!("help")}
                    className={`flex items-center gap-3 ${isSidebarOpen ? `${lang === "en" ? "pl-5" : "pr-5"}` : "justify-center"} py-2.5  mx-2 rounded-md cursor-pointer ${isSidebarOpen && currentPath == "help"
                        ? "text-sky-500 bg-white text-center font-bold"
                        : "p-1 text-white text-center"
                        } relative`}
                >
                    <HelpCircle
                        size={20}
                        className={`${isSidebarOpen && currentPath == "help" ? "text-sky-600 bg-white" : "text-white text-center"
                            }`}
                    />
                    {isSidebarOpen && <span className={"text-sm"}>{t("Help Center")}</span>}
                    {isSidebarOpen && currentPath == "help" ? (
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-sky-600 rounded-l-md"></div>
                    ) : null}
                </div>

                <div
                    title={t("Settings")}

                    onClick={() => goTo!("settings")}
                    className={`flex items-center gap-3 ${isSidebarOpen ? `${lang === "en" ? "pl-5" : "pr-5"}` : "justify-center"} py-2.5  mx-2 rounded-md cursor-pointer ${isSidebarOpen && currentPath == "settings"
                        ? "text-sky-500 bg-white text-center font-bold"
                        : "p-1 text-white text-center"
                        } relative`}
                >
                    <Settings
                        size={20}
                        className={`${isSidebarOpen && currentPath == "settings" ? "text-sky-600 bg-white" : "text-white text-center"
                            }`}
                    />
                    {isSidebarOpen && <span className={"text-sm"}>{t("Settings")}</span>}
                    {isSidebarOpen && currentPath == "settings" ? (
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-sky-600 rounded-l-md"></div>
                    ) : null}
                </div>
            </div>
        </div>

       </div>
    )
}

export default DashboardSidebar
