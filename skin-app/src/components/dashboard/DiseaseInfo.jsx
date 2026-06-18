import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { diseaseMeta } from '../../i18n/diseaseKeys';
import { BookOpen, CheckCircle2, AlertTriangle, AlertOctagon, ChevronUp, ChevronDown, Bookmark, Search, Stethoscope, Zap, Info } from 'lucide-react';

const severityBadge = {
  low: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800',
  medium: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
  high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800',
};

// severityIcon mapping is handled inline with components now

const DiseaseInfo = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);

  const handleSelect = (e, index) => {
    e.stopPropagation();
    setSelected((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-4">

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>{t('dashboard.diseaseInfo.title')}</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {t('dashboard.diseaseInfo.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {diseaseMeta.map((disease, index) => {
          const base = `dashboard.diseases.${disease.key}`;
          const name = t(`${base}.name`);
          const description = t(`${base}.description`);
          const visualLabel = t(`${base}.visualLabel`);
          const visualDesc = t(`${base}.visualDesc`);
          const symptoms = t(`${base}.symptoms`, { returnObjects: true });
          const causes = t(`${base}.causes`, { returnObjects: true });
          const lookFor = t(`${base}.lookFor`, { returnObjects: true });
          const severityLabel = t(`dashboard.severity.${disease.severity}`);

          return (
            <div
              key={disease.key}
              onClick={(e) => handleSelect(e, index)}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all cursor-pointer overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-700">
                      <img
                        src={disease.image}
                        alt={name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = `<div class="w-full h-full flex items-center justify-center"><div class="w-10 h-10 bg-gradient-to-br ${disease.visualColor} ${disease.visualShape}"></div></div>`;
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white text-sm">{name}</h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{visualLabel}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${severityBadge[disease.severity]}`}>
                      {disease.severity === 'low' && <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />}
                      {disease.severity === 'medium' && <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />}
                      {disease.severity === 'high' && <AlertOctagon className="w-3 h-3 text-red-650 dark:text-red-400" />}
                      <span>{t('dashboard.severity.risk', { level: severityLabel })}</span>
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-xs text-slate-400 dark:text-slate-500">
                      <span>{selected === index ? t('dashboard.diseaseInfo.less') : t('dashboard.diseaseInfo.more')}</span>
                      {selected === index ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </span>
                  </div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{description}</p>
              </div>

              {selected === index && (
                <div
                  className="border-t border-slate-100 dark:border-slate-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative">
                    <img
                      src={disease.image}
                      alt={name}
                      className="w-full h-52 object-cover"
                    onError={(e) => {
                        e.target.parentNode.innerHTML = `
                        <div class="w-full h-52 bg-gradient-to-br ${disease.visualColor} flex items-center justify-center">
                          <div class="text-center">
                            <div class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md mx-auto mb-2 flex items-center justify-center border border-white/30 shadow-inner"></div>
                            <p class="text-white text-sm font-medium">${visualLabel}</p>
                          </div>
                        </div>`;
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-white font-bold text-sm">{visualLabel}</p>
                      <p className="text-white/80 text-xs">{visualDesc}</p>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1">
                      <Bookmark className="w-3 h-3 text-white" />
                      <span>{t('dashboard.diseaseInfo.medicalRef')}</span>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 dark:bg-slate-700/30">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wide flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-blue-500" />
                      <span>{t('dashboard.diseaseInfo.lookFor')}</span>
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-5">
                      {Array.isArray(lookFor) && lookFor.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 rounded-lg px-3 py-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-blue-500" />
                          <span>{t('dashboard.diseaseInfo.symptoms')}</span>
                        </p>
                        <div className="space-y-1.5">
                          {Array.isArray(symptoms) && symptoms.map((s, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                              {s}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-purple-500" />
                          <span>{t('dashboard.diseaseInfo.causes')}</span>
                        </p>
                        <div className="space-y-1.5">
                          {Array.isArray(causes) && causes.map((c, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span>
                              {c}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {disease.severity === 'high' && (
                      <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 flex gap-2 items-start">
                        <AlertOctagon className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-red-700 dark:text-red-400 text-xs font-medium">
                          {t('dashboard.diseaseInfo.highWarning')}
                        </p>
                      </div>
                    )}
                    {disease.severity === 'medium' && (
                      <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex gap-2 items-start">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-amber-700 dark:text-amber-400 text-xs font-medium">
                          {t('dashboard.diseaseInfo.mediumWarning')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-4 flex gap-3 items-start">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-blue-700 dark:text-blue-300 text-sm">
          {t('dashboard.diseaseInfo.disclaimer')}
        </p>
      </div>

    </div>
  );
};

export default DiseaseInfo;
