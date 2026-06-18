import { useTranslation } from 'react-i18next';
import { ShieldAlert, AlertOctagon, Sun, Search, Droplet, Heart, XCircle, Stethoscope, CheckCircle2 } from 'lucide-react';

const precautionKeys = [
  { icon: Sun, key: 'sun', color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800', iconBg: 'bg-amber-100 dark:bg-amber-900/40', iconColor: 'text-amber-600 dark:text-amber-400' },
  { icon: Search, key: 'checks', color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800', iconBg: 'bg-blue-100 dark:bg-blue-900/40', iconColor: 'text-blue-600 dark:text-blue-400' },
  { icon: Droplet, key: 'hydration', color: 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-100 dark:border-cyan-800', iconBg: 'bg-cyan-100 dark:bg-cyan-900/40', iconColor: 'text-cyan-600 dark:text-cyan-400' },
  { icon: Heart, key: 'diet', color: 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800', iconBg: 'bg-green-100 dark:bg-green-900/40', iconColor: 'text-green-600 dark:text-green-400' },
  { icon: XCircle, key: 'habits', color: 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800', iconBg: 'bg-red-100 dark:bg-red-900/40', iconColor: 'text-red-600 dark:text-red-400' },
  { icon: Stethoscope, key: 'doctor', color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800', iconBg: 'bg-purple-100 dark:bg-purple-900/40', iconColor: 'text-purple-600 dark:text-purple-400' },
];

const Precautions = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>{t('dashboard.precautions.title')}</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {t('dashboard.precautions.subtitle')}
        </p>
      </div>

      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex gap-3 items-start">
        <AlertOctagon className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-700 dark:text-red-400 text-sm">{t('dashboard.precautions.warningTitle')}</p>
          <p className="text-red-600 dark:text-red-300 text-xs mt-1">
            {t('dashboard.precautions.warningBody')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {precautionKeys.map((item) => {
          const tips = t(`dashboard.precautions.${item.key}.tips`, { returnObjects: true });
          return (
            <div
              key={item.key}
              className={`${item.color} border rounded-2xl p-5 hover:shadow-md transition-all`}
            >
              <div className={`${item.iconBg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                <item.icon className={`w-6 h-6 ${item.iconColor}`} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white mb-3">
                {t(`dashboard.precautions.${item.key}.title`)}
              </h3>
              <ul className="space-y-2">
                {Array.isArray(tips) && tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Precautions;
