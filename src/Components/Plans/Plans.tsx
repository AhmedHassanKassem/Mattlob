import React, { useEffect, useState } from 'react';
import 'animate.css';
import { axiosInst } from '../../axios/axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';

export interface IDuration {
  id?: number;
  ar_name?: string;
  en_name?: string;
  days?: number;
}

export interface IDurationPrices {
  id?: number;
  ar_name?: string;
  en_name?: string;
  price?: number;
  discount?: number;
  duration_id?: number;
  description?: string;
}

const PricingPlans: React.FC = () => {
  const [selectedDurationId, setSelectedDurationId] = useState<number | null>(null);
  const [animateKey, setAnimateKey] = useState(0);
  const [durations, setDurations] = useState<IDuration[]>([]);
  const [durationPrices, setDurationPrices] = useState<IDurationPrices[]>([]);
  const [loading, setLoading] = useState(true);
  const lang = useSelector((state : RootState)=> state.lang.lang)
  // Package colors configuration
  const packageColors = [
    {
      color: 'from-gray-400 to-gray-600',
      bgColor: 'bg-gradient-to-br from-gray-50 to-gray-100',
    },
    {
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-gradient-to-br from-gray-50 to-gray-100',
    },
    {
      color: 'from-emerald-400 to-emerald-600',
      bgColor: 'bg-gradient-to-br from-gray-50 to-gray-100',
      isPopular: true,
    },
    {
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
    },
  ];

  const getAllDurations = async () => {
    try {
      const res = await axiosInst.get(`/api/PricePlan/GetAllDuration`);
      if (res.status === 200 && res.data.data) {
        setDurations(res.data.data);
        // Set first duration as default
        if (res.data.data.length > 0) {
          const firstDurationId = res.data.data[0].id;
          setSelectedDurationId(firstDurationId);
          getAllPricesByDurationId(firstDurationId);
        }
      }
    } catch (error) {
      console.error('Error fetching durations:', error);
    }
  };

  const getAllPricesByDurationId = async (durationId?: number) => {
    if (!durationId) return;
    
    try {
      setLoading(true);
      const res = await axiosInst.get(`/api/PricePlan/GetPriceByDuration?id=${durationId}`);
      if (res.status === 200 && res.data.data) {
        setDurationPrices(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDurationChange = (durationId: number) => {
    setSelectedDurationId(durationId);
    setAnimateKey(prev => prev + 1);
    getAllPricesByDurationId(durationId);
  };

  // Calculate discount percentage
  const calculateDiscountPercentage = (price?: number, discount?: number) => {
    if (!price || !discount) return '';
    const originalPrice = price + discount;
    const percentage = ((discount / originalPrice) * 100).toFixed(0);
    return `خصم ${percentage}%`;
  };

  useEffect(() => {
    getAllDurations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="lg:max-w-5xl max-w-xs mx-auto">
        {/* Duration Selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-2xl bg-white shadow-lg p-2 gap-2 flex-wrap">
            {durations.map((duration) => {
              const discountText = duration.days === 30 ? '' : 
                                   duration.days === 90 ? 'خصم 5%' : 
                                   duration.days === 180 ? 'خصم 10%' : '';
              
              return (
                <button
                  key={duration.id}
                  onClick={() => handleDurationChange(duration.id!)}
                  className={`lg:px-8 px-5 lg:py-4 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
                    selectedDurationId === duration.id
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {lang === "en" ? duration.en_name : duration.ar_name}
                  {discountText && (
                    <div className="text-xs mt-1">{discountText}</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
          </div>
        ) : (
          /* Packages Grid */
          <div key={animateKey} className="flex lg:flex-row flex-col justify-center gap-6">
            {durationPrices.map((pkg, index) => {
              const colorConfig = packageColors[index % packageColors.length];
              const originalPrice = (pkg.price || 0) + (pkg.discount || 0);
              const discountPercentage = calculateDiscountPercentage(pkg.price, pkg.discount);

              return (
                <div
                  key={pkg.id}
                  className={`relative rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl animate__animated animate__fadeInUp ${colorConfig.bgColor}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {colorConfig.isPopular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-center py-2 font-bold text-sm">
                      الأكثر طلباً
                    </div>
                  )}

                  <div className={`p-6 ${colorConfig.isPopular ? 'mt-10' : 'mt-0'}`}>
                    {/* Package Name */}
                    <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${colorConfig.color} bg-clip-text text-transparent`}>
                      {lang === "en" ? pkg.en_name : pkg.ar_name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-6 min-h-[40px]">
                      {pkg.description || 'باقة مميزة للشركات'}
                    </p>

                    {/* Price Section */}
                    {pkg.price && pkg.price > 0 ? (
                      <div className="mb-6">
                        <div className="flex items-end justify-center gap-2 mb-2">
                          <span className={`text-5xl font-bold bg-gradient-to-r ${colorConfig.color} bg-clip-text text-transparent`}>
                            {pkg.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="text-gray-500 text-sm">
                            جنيه مصري / {lang === "en" ? durations.find(d => d.id === selectedDurationId)?.en_name : durations.find(d => d.id === selectedDurationId)?.ar_name}
                          </span>
                        </div>
                        {pkg.discount && pkg.discount > 0 && (
                          <div className="flex items-center justify-center gap-3 mt-3">
                            <span className="text-gray-400 line-through text-lg">
                              ج.م {originalPrice.toLocaleString()}
                            </span>
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                              {discountPercentage}
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 text-center mt-2">
                          الاسعار لا تشمل ضريبة القيمة المضافة
                        </p>
                      </div>
                    ) : (
                      <div className="mb-6 text-center py-8">
                        <div className="text-5xl mb-2">📞</div>
                        <p className="text-sm text-gray-600">اتصل للحصول على عرض خاص</p>
                      </div>
                    )}

                    {/* CTA Button */}
                    <button className={`w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r ${colorConfig.color} hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 mb-6`}>
                      {pkg.price && pkg.price > 0 ? 'سجل الآن' : 'تواصل معنا'}
                    </button>

                    {/* Features - You can add more features based on your data */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-500 text-lg flex-shrink-0">✓</span>
                        <span>اختيار المرشحين حسب الخبرة الصحر السعر الفرق والمزيد</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-500 text-lg flex-shrink-0">✓</span>
                        <span>عرض علامات تجارية (لوجو) شركتك بحجم متوسط</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-500 text-lg flex-shrink-0">✓</span>
                        <span>دعم فني متواصل طوال فترة الاشتراك</span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No Data State */}
        {!loading && durationPrices.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">لا توجد باقات متاحة</h3>
            <p className="text-gray-500">جاري تحديث الباقات، يرجى المحاولة لاحقاً</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingPlans;