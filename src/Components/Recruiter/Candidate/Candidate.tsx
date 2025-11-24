import { FormEvent, useEffect, useState } from "react"
import Input from "../../../Containers/Input";
import Button from "../../../Containers/Button";
import { ChevronLeft, ChevronRight, CircleX, PenSquare, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import DeleteModal from "../../../Containers/DeleteModal";
import { ICandidate } from "../../../Interfaces/interface";
import { axiosInst } from "../../../axios/axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { useNavigate } from "react-router-dom";
import { HashLoader } from "react-spinners";

const Candidate = () => {
    const token = useSelector((state: RootState) => state.token.token)
    const lang = useSelector((state: RootState) => state.lang.lang)
    const navigate = useNavigate()
    const [canId, setCanId] = useState(0)
    const [deleteModal, setDeleteModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const pageSize = 5
    const [pageNumbers, setPageNumbers] = useState<any>([]);
    const [cands, setCands] = useState<ICandidate[]>([])
    const [pageNum, setPageNum] = useState(1);
    const [canModal, setCanModal] = useState(false);
    const { t } = useTranslation()
    const [fileName, setFileName] = useState("");
    const [imgUrl, setImgUrl] = useState("");

    const [canForm, setCanForm] = useState({
        id:0,
        ar_name: "",
        en_name: "",
        email: "",
        mobile_number: "",
        city: "",
        current_company: "",
        current_job_title: "",
        experience_month: 0,
        experience_year: 0,
        current_salary: "",
        nationality: "",
        notice_period: "",
        image: {
            title: "",
            description: "",
            base64Image: "",
            fileExtension: ""
        }
    })
    const [totalPages, setTotalPages] = useState(0)

    const getAllCandsList = async () => {
        setLoading(true)
        const res = await axiosInst.get(`/api/Candidate/GetList?pageNumber=${pageNum}&pageSize=${pageSize}`, {
            headers: {
                'Content-Type': 'Application/json',
                Authorization: `Bearer ${token}`
            }
        })

        if (res.status === 200) {
            console.log(res.data.data.items);
            
            setCands(res.data.data.items)
            setTotalPages(res.data.data.pageCount)
            setLoading(false)
        }
    }

    const validateForm = () => {
        const newErrors: Partial<Record<keyof typeof canForm, string>> = {};

        const requiredFields: (keyof typeof canForm)[] = [
            "ar_name",
            "en_name",
            "email",
            "mobile_number",
            "city",
            "current_company",
            "current_job_title",
            "experience_month",
            "experience_year",
            "current_salary",
            "nationality",
            "notice_period",
        ];

        // ✅ تحقق من الحقول المطلوبة
        requiredFields.forEach((key) => {
            const value = canForm[key];
            const isEmpty =
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "");

            if (isEmpty) {
                const label = key
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");
                newErrors[key] = `${label} is required`;
            }
        });

        const noticeRegex = /^(\d+\s*-\s*\d+|\d+)\s*[A-Za-z\u0600-\u06FF\s]*$/;

        if (canForm.notice_period && !noticeRegex.test(canForm.notice_period.trim())) {
            newErrors.notice_period = "Notice period must be in format e.g. 1-3 or 1 day";
        }
        const numberOnlyFields: (keyof typeof canForm)[] = [
            "experience_month",
            "experience_year",
            "current_salary",
            "mobile_number"
        ];

        numberOnlyFields.forEach((key) => {
            const value = canForm[key];
            if (value && !/^\d+$/.test(value.toString().trim())) {
                const label = key
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");
                newErrors[key] = `${label} must be a number`;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    useEffect(() => {
        getAllCandsList()

    }, [])


    const submit = async (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();


        const isValid = validateForm();
        if (!isValid) {
            console.warn("Validation failed", errors);
            return;
        }

        try {

            if (canId > 0) {
                const updatedForm = {
                    ...canForm,
                    id : canId
                }

                const res = await axiosInst.put('/api/Candidate/Edit', updatedForm, {
                    headers: {
                        'Content-Type': `application/json; charset=utf-8`,
                        'Authorization': `Bearer ${token}`
                    },
                    transformRequest: [(data) => JSON.stringify(data)]
                })
                if (res.status === 200) {
                    toast.success("Candidate updated successfully")
                }
            } else {
                const res = await axiosInst.post('/api/Candidate/Create', canForm, {
                    headers: {
                        'Content-Type': `application/json`,
                        'Authorization': `Bearer ${token}`
                    }
                })
                if (res.status === 200) {
                    toast.success("Candidate added successfully")
                }
            }


            setCanForm({
                id:0,
                ar_name: "",
                en_name: "",
                email: "",
                mobile_number: "",
                city: "",
                current_company: "",
                current_job_title: "",
                experience_month: 0,
                experience_year: 0,
                current_salary: "",
                nationality: "",
                notice_period: "",
                image: {
                    title: "",
                    description: "",
                    base64Image: "",
                    fileExtension: ""
                }
            })
            setCanId(0)
            getAllCandsList()
            setCanModal(!canModal)
        } catch (error) {
            console.error("Error while submitting job:", error);
        }
    };



    const [errors, setErrors] = useState<Partial<Record<keyof typeof canForm, string>>>({});
    const range = (start: number, end: number): number[] => {
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const getPageNumbers = (
        pageNum: number,
        totalPages: number
    ): (number | string)[] => {
        let nums: (number | string)[] = [];

        if (totalPages <= 5) {
            nums = Array.from({ length: totalPages }, (_, index) => index + 1);
        } else {
            nums.push(1);

            if (pageNum > 3) {
                nums.push("...");
            }

            if (pageNum >= totalPages - 2) {
                nums.push(...range(Math.max(totalPages - 3, 2), totalPages - 1));
            } else {
                nums.push(
                    ...range(
                        Math.max(pageNum - 1, 2),
                        Math.min(pageNum + 1, totalPages - 1)
                    )
                );
            }

            if (pageNum < totalPages - 2) {
                nums.push("...");
            }

            nums.push(totalPages);
        }

        return nums;
    };
    useEffect(() => {
        const updatedPageNumbers = getPageNumbers(pageNum!, totalPages);
        setPageNumbers(updatedPageNumbers);
    }, [pageNum, totalPages]);


    const handleChange = (field: keyof any, value: any) => {
        setCanForm({
            ...canForm,
            [field]: value
        })
    }

    const closeModal = () => {
        setCanModal(!canModal)
        setCanForm({
            id:0,
            ar_name: "",
            en_name: "",
            email: "",
            mobile_number: "",
            city: "",
            current_company: "",
            current_job_title: "",
            experience_month: 0,
            experience_year: 0,
            current_salary: "",
            nationality: "",
            notice_period: "",
            image: {
                title: "",
                description: "",
                base64Image: "",
                fileExtension: ""
            }
        })
        setCanId(0)
    }
    const getCanById = (canId?: number) => {
        setCanId(canId!)
        setCanModal(!canModal)
        const findCan : any = cands.find((can: ICandidate) => can.id === canId)  
        if (findCan) {
             setFileName(findCan.cv?.name)
            setImgUrl(findCan.cv?.path)
            setCanForm({
                ...canForm,
                ar_name: findCan.ar_name!,
                en_name: findCan.en_name!,
                mobile_number: findCan.mobile_number!,
                email: findCan.email!,
                city: findCan.city!,
                current_company: findCan.current_company!,
                current_job_title: findCan.current_job_title!,
                experience_month: findCan.experience_month!,
                experience_year: findCan.experience_year!,
                current_salary: findCan.current_salary!,
                nationality: findCan.nationality!,
                notice_period: findCan.notice_period!,
            })
        }
    }
    const deleteCan = async () => {
        const res = await axiosInst.delete(`/api/Candidate/Delete?id=${canId}`, {
            headers: {
                'Content-Type': `application/json`,
                'Authorization': `Bearer ${token}`
            }
        })
        if (res.status === 200) {
            toast.success("Job deleted successfully!")
            setCanId(0)
            getAllCandsList()
            setDeleteModal(!deleteModal)
        }
    }
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    const handleImageUpload = (e?: React.ChangeEvent<HTMLInputElement>) => {
        const file = e?.target.files?.[0];
        if (!file) return;

        const maxSizeInMB = 2;
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

        if (file.size > maxSizeInBytes) {
            alert(`Image is too large. Max size is ${formatFileSize(maxSizeInBytes)}, but your file is ${formatFileSize(file.size)}`);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Full = reader.result?.toString() || "";
            const base64Only = base64Full.split(',')[1];
            const extension = file.name.split('.').pop();
            setFileName(file.name);
            setCanForm(prev => ({
                ...prev,
                image: {
                    title: file.name,
                    description: "",
                    base64Image: base64Only,
                    fileExtension: extension ? `.${extension}` : ""
                }
            }));
        };

        reader.readAsDataURL(file);
    };

    return (
        <div>
            <div className="w-full px-6">
                {deleteModal && (
                    <DeleteModal isOpen={deleteModal} onConfirm={deleteCan} name={"candidate " + cands.find(
                        (can: ICandidate) => can.id === canId
                    )?.en_name} onCancel={() => setDeleteModal(!deleteModal)} />
                )}
                <div className="flex items-center justify-end h-auto mb-5">
                    <Button
                        onClick={() => setCanModal(!canModal)}
                        btnTitle={t("Add Candidate")}
                        buttonContent={<div className="flex gap-1 px-10 items-center bg-sky-900 text-white p-3">
                            <Plus size={18} />  {t("Add Candidate")}
                        </div>}
                        className="rounded-md p-2  transition-all duration-300"
                    />
                </div>
                {canModal &&
                    <div className="fixed inset-0 z-50 bg-gray-900/75 flex justify-center p-10">
                        <div className="px-5 animate__animated animate__fadeInDown col-span-12 bg-white p-5 rounded-xl  overflow-y-auto scrollbar-hide lg:w-xl w-md">
                            <form onSubmit={submit}>
                                <div className="col-span-12  flex justify-between">
                                    <h1 className="text-2xl font-bold text-sky-800">{canId === 0 ? t("Add Candidate") : t("Update Candidate")}</h1>
                                    <div className="flex items-center justify-end">
                                        <Button
                                            onClick={closeModal}
                                            btnTitle={t("Close")}
                                            buttonContent={<div className="flex gap-1  items-center">
                                                <CircleX size={18} className="text-red-500" />
                                            </div>}

                                        />
                                    </div>
                                </div>
                                <div className="lg:col-span-4 col-span-12 p-3">
                                    <Input
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                                        label={t("Arabic name")}
                                        labelClass="text-sky-900"
                                        onChange={(e) => handleChange("ar_name", e.target.value)}
                                        errorMessage={errors.ar_name}
                                        value={canForm.ar_name}
                                    />
                                </div>
                                <div className="lg:col-span-4 col-span-12 p-3">
                                    <Input
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                                        label={t("English name")}
                                        labelClass="text-sky-900"
                                        onChange={(e) => handleChange("en_name", e.target.value)}
                                        errorMessage={errors.en_name}
                                        value={canForm.en_name}
                                    />
                                </div>

                                <div className="lg:col-span-4 col-span-12 p-3">
                                    <Input
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                                        label={t("Email")}
                                        labelClass="text-sky-900"
                                        onChange={(e) => handleChange("email", e.target.value)}
                                        errorMessage={errors.email}
                                        value={canForm.email}
                                        type="email"
                                    />
                                </div>
                                <div className="lg:col-span-4 col-span-12 p-3">
                                    <Input
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                                        label={t("Phone")}
                                        labelClass="text-sky-900"
                                        onChange={(e) => handleChange("mobile_number", e.target.value)}
                                        errorMessage={errors.mobile_number}
                                        value={canForm.mobile_number ?? ""}
                                    />
                                </div>
                                <div className="lg:col-span-4 col-span-12 p-3">
                                    <Input
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                                        label={t("City")}
                                        labelClass="text-sky-900"
                                        onChange={(e) => handleChange("city", e.target.value)}
                                        errorMessage={errors.city}
                                        value={canForm.city}
                                    />
                                </div>
                                <div className="lg:col-span-4 col-span-12 p-3">
                                    <Input
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                                        label={t("Current company")}
                                        labelClass="text-sky-900"
                                        onChange={(e) => handleChange("current_company", e.target.value)}
                                        errorMessage={errors.current_company}
                                        value={canForm.current_company}
                                    />
                                </div>
                                <div className="lg:col-span-4 col-span-12 p-3">
                                    <Input
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                                        label={t("Current job title")}
                                        labelClass="text-sky-900"
                                        onChange={(e) => handleChange("current_job_title", e.target.value)}
                                        errorMessage={errors.current_job_title}
                                        value={canForm.current_job_title}
                                    />
                                </div>
                                <div className="lg:col-span-4 col-span-12 p-3">
                                    <Input
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                                        label={t("Experience year")}
                                        labelClass="text-sky-900"
                                        onChange={(e) => handleChange("experience_year", e.target.value)}
                                        errorMessage={errors.experience_year}
                                        value={canForm.experience_year}
                                    />
                                </div>
                                <div className="lg:col-span-4 col-span-12 p-3">
                                    <Input
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                                        label={t("Experience month")}
                                        labelClass="text-sky-900"
                                        onChange={(e) => handleChange("experience_month", e.target.value)}
                                        errorMessage={errors.experience_month}
                                        value={canForm.experience_month}
                                    />
                                </div>
                                <div className="lg:col-span-4 col-span-12 p-3">
                                    <Input
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                                        label={t("Notice period")}
                                        labelClass="text-sky-900"
                                        onChange={(e) => handleChange("notice_period", e.target.value)}
                                        errorMessage={errors.notice_period}
                                        value={canForm.notice_period}
                                    />
                                </div>
                                <div className="lg:col-span-4 col-span-12 p-3">
                                    <Input
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                                        label={t("Current salary")}
                                        labelClass="text-sky-900"
                                        onChange={(e) => handleChange("current_salary", e.target.value)}
                                        errorMessage={errors.current_salary}
                                        value={canForm.current_salary}
                                    />
                                </div>
                                <div className="lg:col-span-4 col-span-12 p-3">
                                    <Input
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                                        label={t("Nationality")}
                                        labelClass="text-sky-900"
                                        onChange={(e) => handleChange("nationality", e.target.value)}
                                        errorMessage={errors.nationality}
                                        value={canForm.nationality}
                                    />
                                </div>

                                <div className="lg:col-span-4 col-span-12 p-3 flex flex-col">
                                    <label className="text-sky-900 font-medium">{t("Add Image")}</label>

                                    <div className="flex items-center gap-3">
                                        <label className="cursor-pointer bg-blue-50 text-blue-700 text-sm font-medium py-3 px-6 rounded-lg hover:bg-blue-100 transition-all duration-200">
                                            {t("Upload Image")}

                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </label>

                                        <span className="text-sm text-gray-600 truncate max-w-[150px]">
                                            {fileName || t("No file chosen")}
                                        </span>
                                    </div>

                                </div>
                               {imgUrl ? <div className="lg:col-span-4 col-span-12 p-3 flex flex-col">
                                     <img src={`${axiosInst.defaults.baseURL}${imgUrl}`} alt="canImg" />
                                </div> : null}

                                <div className="lg:col-span-4 col-span-12 p-3">
                                    <div className="flex items-center justify-center h-auto">
                                        <Button
                                            btnTitle="Submit"
                                            btnType="submit"
                                            buttonContent={<div className="flex gap-1 px-10 items-center">
                                                <Plus size={18} /> {canId === 0 ? t("Add") : t("Update")}
                                            </div>}
                                            className=" hover:shadow-md shadow-sky-300 text-sky-600 shadow-sm border border-sky-200 rounded-full p-2 mt-5 transition-all duration-300"
                                        />
                                    </div>
                                </div>

                            </form>

                        </div>
                    </div>

                }

                <div className="mx-auto">
                    <div className="bg-white text-sm rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            {/* Table Head */}
                            <thead className="bg-sky-800 text-gray-700 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 font-medium text-white">{t("Name")}</th>
                                    <th className="px-6 py-3 font-medium text-white">{t("Nationality")}</th>
                                    <th className="px-6 py-3 font-medium text-white">{t("Email")}</th>
                                    <th className="px-6 py-3 font-medium text-white">{t("Phone")}</th>
                                    <th className="px-6 py-3 font-medium text-white">{t("Notice period")}</th>
                                    <th className="px-6 py-3 font-medium text-white">{t("Current company")}</th>
                                    <th className="px-6 py-3 font-medium text-white">{t("Current salary")}</th>
                                    <th className="px-6 py-3 font-medium text-white">{t("Actions")}</th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        {/* غطّي كل الأعمدة */}
                                        <td colSpan={8} className="py-10">
                                            <div className="flex justify-center items-center">
                                                <HashLoader color="#00598a" size={30} />
                                            </div>
                                        </td>
                                    </tr>
                                ) : (cands.length === 0 ? <tr>
                                    {/* غطّي كل الأعمدة */}
                                    <td colSpan={8} className="py-10">
                                        <div className="flex justify-center items-center">
                                            <p className="text-lg">لا يوجد اي مرشحين</p>
                                        </div>
                                    </td>
                                </tr> : cands?.map((can: any, index: number) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        {/* Job Title / Date / Job ID */}
                                        <td className="px-6 py-4 align-top">
                                            <h3 className="text-sky-700 font-medium hover:text-sky-800 cursor-pointer line-clamp-2"
                                                onClick={() => navigate(`/dashboard/roleDetails?role=${can.id}`)}>
                                                {lang === "en" ? can.en_name : can.ar_name}
                                            </h3>
                                        </td>
                                      

                                        {/* Action */}
                                        <td className="px-6 py-4 align-top">
                                            <span className={`font-medium`}>
                                                {can.nationality}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 align-top">
                                            <span>
                                                {can.email}
                                            </span>
                                        </td>

                                        {/* Fee/End Rate */}
                                        <td className="px-6 py-4 align-top">
                                            <span className="text-sm font-medium text-gray-900">{can.mobile_number}</span>
                                        </td>

                                        {/* Location */}
                                        <td className="px-6 py-4 align-top">
                                            <div className="flex items-center gap-1 text-sm">
                                                {can.notice_period}
                                            </div>
                                        </td>

                                        {/* Sector */}
                                        <td className="px-6 py-4 align-top">
                                            <span className="text-sm text-gray-900">{can.current_company}</span>
                                        </td>

                                        {/* Job Type */}
                                        <td className="px-6 py-4 align-top">
                                            <span className="text-sm font-medium text-gray-900">{can.current_salary}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => getCanById(can.id!)}
                                                    className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition duration-200"
                                                >
                                                    <PenSquare className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => { setDeleteModal(!deleteModal), setCanId(can.id!) }}
                                                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )))}
                            </tbody>

                        </table>
                        <div className="flex  justify-between items-center gap-4 p-5 bg-white border-t border-gray-100 rounded-b-lg">


                            {/* Pagination controls */}
                            <div className="flex items-center">
                                {/* Previous button */}
                                <button
                                    className={`flex items-center justify-center h-10 w-10 rounded-lg mr-2 transition-colors duration-200 ${pageNum > 1
                                        ? "text-gray-600 hover:bg-sky-50 hover:text-sky-600 border border-gray-200"
                                        : "text-gray-300 cursor-not-allowed border border-gray-100"
                                        }`}
                                    onClick={() => pageNum > 1 && setPageNum(pageNum - 1)}
                                    disabled={pageNum === 1}
                                    aria-label="Previous page"
                                >
                                    {lang === "en" ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                </button>

                                {/* Page numbers */}
                                <div className="flex items-center space-x-1">
                                    {pageNumbers.map((pageNo: string, index: number) => (
                                        <button
                                            key={index}
                                            className={`flex items-center justify-center h-10 w-10 rounded-lg mx-1 transition-all duration-200 ${Number(pageNo) === pageNum
                                                ? "bg-sky-600 text-white font-medium shadow-sm"
                                                : pageNo === "..."
                                                    ? "text-gray-400 cursor-default"
                                                    : "text-gray-700 hover:bg-sky-50 hover:text-sky-600 border border-gray-200"
                                                }`}
                                            onClick={() => {
                                                if (pageNo !== "...") {
                                                    setPageNum(Number(pageNo));
                                                    localStorage.setItem("page", pageNo.toString());
                                                }
                                            }}
                                            disabled={pageNo === "..."}
                                        >
                                            <span dir="rtl">
                                                {typeof pageNo === "string"
                                                    ? pageNo.toLocaleString()
                                                    : pageNo}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                {/* Next button */}
                                <button
                                    className={`flex items-center justify-center h-10 w-10 rounded-lg ml-2 transition-colors duration-200 ${pageNum < totalPages
                                        ? "text-gray-600 hover:bg-sky-50 hover:text-sky-600 border border-gray-200"
                                        : "text-gray-300 cursor-not-allowed border border-gray-100"
                                        }`}
                                    onClick={() =>
                                        pageNum < totalPages && setPageNum(pageNum + 1)
                                    }
                                    disabled={pageNum === totalPages}
                                    aria-label="Next page"
                                >
                                    {lang === "en" ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Candidate