import React from 'react';
import { X, BookOpen, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-6 text-center">دليل استخدام المنصة</h2>

          <div className="space-y-8">
            
            <section>
              <h3 className="flex items-center gap-2 text-lg font-bold text-purple-600 mb-3">
                <BookOpen className="w-5 h-5" />
                قسم الأكاديميات (الدرجات)
              </h3>
              <ul className="space-y-3 text-slate-600 text-sm leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                  <span>
                    <strong>التقييم الأسبوعي:</strong> انقر على أي "بطاقة أسبوع" لفتح نافذة التعديل. يمكنك تعديل الدرجة، الدرجة العظمى (من كم)، وتسجيل حالة الحضور (حاضر/غائب).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                  <span>
                    <strong>الملاحظات:</strong> يمكنك كتابة ملاحظات نصية عند الغياب (مثلاً: "غياب بعذر") وستظهر للطالب.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                  <span>
                    <strong>إضافة أسبوع/مادة:</strong> استخدم أزرار "أسبوع جديد" أو "مادة جديدة" لإضافة خانات فارغة.
                  </span>
                </li>
              </ul>
            </section>

            <section className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h3 className="flex items-center gap-2 text-lg font-bold text-indigo-600 mb-3">
                <Calendar className="w-5 h-5" />
                قسم الغياب والحضور
              </h3>
              <ul className="space-y-3 text-slate-600 text-sm leading-relaxed">
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-indigo-500 mt-1 shrink-0" />
                  <span>
                    <strong>تسجيل يومي:</strong> انتقل إلى تبويب "سجل الحضور" لتسجيل حالة الطالب ليوم معين.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-indigo-500 mt-1 shrink-0" />
                  <span>
                    <strong>تحديد الحصة:</strong> يمكنك تحديد اسم الدرس أو الحصة التي تم فيها الغياب.
                  </span>
                </li>
              </ul>
            </section>

          </div>

          <div className="mt-8 text-center">
            <button 
              onClick={onClose}
              className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
              فهمت، شكراً
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};