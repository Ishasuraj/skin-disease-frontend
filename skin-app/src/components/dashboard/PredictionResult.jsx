import { Target, CheckCircle2, AlertTriangle, AlertOctagon, BarChart2, Eye, Link2 } from 'lucide-react';

const severityColor = {
  Low: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
  Medium: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  High: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
};

const DISEASE_NAMES = {
  'Acne': 'Acne',
  'Actinic Keratosis': 'Actinic Keratosis',
  'Basal Cell Carcinoma': 'Basal Cell Carcinoma',
  'Benign Keratosis': 'Benign Keratosis',
  'Dermatofibroma': 'Dermatofibroma',
  'Eczema': 'Eczema',
  'Melanocytic Nevi': 'Melanocytic Nevi',
  'Melanoma': 'Melanoma',
  'Psoriasis': 'Psoriasis',
  'Ringworm': 'Ringworm',
  'Rosacea': 'Rosacea',
  'Vascular Lesion': 'Vascular Lesion',
  'Warts': 'Warts',
  'Others': 'Others',
};

const PredictionResult = ({ data, image }) => {
  if (!data) return null;

  const getDiseaseName = (name) => DISEASE_NAMES[name] || name;

  const probabilities = Array.isArray(data.probabilities)
    ? data.probabilities
    : [];

  const severityLabel =
    data.severity === 'Low'
      ? 'Low'
      : data.severity === 'Medium'
      ? 'Medium'
      : 'High';

  const severityHint =
    data.severity === 'Low'
      ? '✅ Generally benign'
      : data.severity === 'Medium'
      ? '⚠️ Monitor closely'
      : '🚨 See a doctor soon';

  return (
    <div className="space-y-4">

      {/* Main Result Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">

        <div className="flex items-center gap-2 mb-6">
          <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            AI Prediction Result
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1 uppercase tracking-wide">
              Detected Condition
            </div>
            <div className="text-lg font-bold text-slate-800 dark:text-white">
              {getDiseaseName(data.disease)}
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
            <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1 uppercase tracking-wide">
              Confidence Score
            </div>
            <div className="text-lg font-bold text-slate-800 dark:text-white">
              {data.confidence}%
            </div>

            <div className="w-full bg-purple-100 dark:bg-purple-900/40 rounded-full h-1.5 mt-2">
              <div
                className="bg-purple-500 h-1.5 rounded-full transition-all"
                style={{ width: `${data.confidence || 0}%` }}
              />
            </div>
          </div>

          <div className={`rounded-xl p-4 border ${severityColor[data.severity]}`}>
            <div className="text-xs font-semibold mb-1 opacity-70 uppercase tracking-wide">
              Severity Level
            </div>

            <div className="text-lg font-bold">
              {severityLabel} Risk
            </div>

            <div className="text-xs mt-1.5 opacity-90 flex items-center gap-1.5">
              {data.severity === 'Low' && <CheckCircle2 className="w-3.5 h-3.5" />}
              {data.severity === 'Medium' && <AlertTriangle className="w-3.5 h-3.5" />}
              {data.severity === 'High' && <AlertOctagon className="w-3.5 h-3.5" />}
              <span>{severityHint}</span>
            </div>
          </div>

        </div>

        {/* Probability Bars */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
            <BarChart2 className="w-4 h-4" />
            <span>Prediction Probabilities</span>
          </h3>

          <div className="space-y-3">
            {probabilities.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                  <span>{getDiseaseName(item.name)}</span>
                  <span>{item.score}%</span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      index === 0
                        ? 'bg-blue-500'
                        : 'bg-slate-300 dark:bg-slate-500'
                    }`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Grad-CAM Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">

        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            Grad-CAM Visualization
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium uppercase tracking-wide">
              Original Image
            </p>

            <div className="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
              <img
                src={image}
                alt="Original"
                className="w-full object-contain max-h-48"
              />
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium uppercase tracking-wide">
              AI Focus Heatmap
            </p>

            <div className="rounded-xl bg-slate-100 dark:bg-slate-700 max-h-48 flex items-center justify-center p-6 text-center">
              <div>
                <Link2 className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Grad-CAM visualization not available yet
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-4 flex gap-3 items-start">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
        <p className="text-amber-700 dark:text-amber-400 text-sm">
          This is an AI prediction for awareness only. Please consult a certified dermatologist for proper diagnosis and treatment.
        </p>
      </div>

    </div>
  );
};

export default PredictionResult;
