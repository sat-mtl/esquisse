import React from "react";
import { useLang } from "../LangContext.jsx";

export default function Landing({ onButtonClick }) {
  const { t, lang, setLang } = useLang();
  return (
    <div className="modal-wrapper">
      <div className="modal-body">
        <h1 className="landing-title">
          {t.landingTitle}
          <span className="landing-info-wrap">
            <span className="landing-info-icon" aria-label="About this tool" tabIndex={0}>i</span>
            <span className="landing-info-tooltip">
              {t.landingTooltip}
            </span>
          </span>
        </h1>
        <ol className="landing-steps">
          <li>
            <span className="landing-step-circle">1</span>
            <span className="landing-step-text">{t.landingStep1}</span>
          </li>
          <li>
            <span className="landing-step-circle">2</span>
            <span className="landing-step-text">{t.landingStep2}</span>
          </li>
          <li>
            <span className="landing-step-circle">3</span>
            <span className="landing-step-text">{t.landingStep3}</span>
          </li>
          <li>
            <span className="landing-step-circle">4</span>
            <span className="landing-step-text">{t.landingStep4}</span>
          </li>
        </ol>
        <div className="landing-actions">
          <div className="landing-actions-row">
            <button
              type="button"
              className="landing-lang-switch"
              onClick={() => setLang(lang === "fr" ? "en" : "fr")}
            >
              {t.switchLang}
            </button>
            <button type="button" onClick={onButtonClick}>
              {t.landingUnderstood}
            </button>
          </div>
        </div>
        <p className="landing-mobile-note">
          {t.landingMobileNote}
        </p>
      </div>
    </div>
  );
}