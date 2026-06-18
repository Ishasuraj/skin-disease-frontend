import en from './en.json';
import hi from './hi.json';
import ml from './ml.json';
import ta from './ta.json';
import te from './te.json';
import kn from './kn.json';
import bn from './bn.json';
import mr from './mr.json';
import gu from './gu.json';
import pa from './pa.json';
import or from './or.json';
import ur from './ur.json';
import fr from './fr.json';
import es from './es.json';
import ar from './ar.json';
import zh from './zh.json';
import ja from './ja.json';
import ko from './ko.json';
import ru from './ru.json';
import de from './de.json';
import pt from './pt.json';

import dashboardEn from './dashboard.en.json';
import dashboardHi from './dashboard.hi.json';
import dashboardMl from './dashboard.ml.json';
import dashboardTa from './dashboard.ta.json';
import dashboardTe from './dashboard.te.json';
import dashboardKn from './dashboard.kn.json';
import dashboardBn from './dashboard.bn.json';
import dashboardMr from './dashboard.mr.json';
import dashboardGu from './dashboard.gu.json';
import dashboardPa from './dashboard.pa.json';
import dashboardOr from './dashboard.or.json';
import dashboardUr from './dashboard.ur.json';
import dashboardFr from './dashboard.fr.json';
import dashboardEs from './dashboard.es.json';
import dashboardAr from './dashboard.ar.json';
import dashboardZh from './dashboard.zh.json';
import dashboardJa from './dashboard.ja.json';
import dashboardKo from './dashboard.ko.json';
import dashboardRu from './dashboard.ru.json';
import dashboardDe from './dashboard.de.json';
import dashboardPt from './dashboard.pt.json';

/** @type {Record<string, object>} */
export const localeModules = {
  en: { ...en, dashboard: dashboardEn },
  hi: { ...hi, dashboard: dashboardHi },
  ml: { ...ml, dashboard: dashboardMl },
  ta: { ...ta, dashboard: dashboardTa },
  te: { ...te, dashboard: dashboardTe },
  kn: { ...kn, dashboard: dashboardKn },
  bn: { ...bn, dashboard: dashboardBn },
  mr: { ...mr, dashboard: dashboardMr },
  gu: { ...gu, dashboard: dashboardGu },
  pa: { ...pa, dashboard: dashboardPa },
  or: { ...or, dashboard: dashboardOr },
  ur: { ...ur, dashboard: dashboardUr },
  fr: { ...fr, dashboard: dashboardFr },
  es: { ...es, dashboard: dashboardEs },
  ar: { ...ar, dashboard: dashboardAr },
  zh: { ...zh, dashboard: dashboardZh },
  ja: { ...ja, dashboard: dashboardJa },
  ko: { ...ko, dashboard: dashboardKo },
  ru: { ...ru, dashboard: dashboardRu },
  de: { ...de, dashboard: dashboardDe },
  pt: { ...pt, dashboard: dashboardPt },
};
