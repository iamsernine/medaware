"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import * as DB from "@/lib/db";
import { useToast } from "@/context/ToastContext";
import {
  EMERGENCY_RE,
  CATEGORY_MAP,
  CATEGORY_LABEL_BY_CAT,
} from "@/lib/helpers";
import EmergencyBanner from "@/components/EmergencyBanner";

export default function CreatePage() {
  const router = useRouter();
  const showToast = useToast();
  const triageTimerRef = useRef(null);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [showTriage, setShowTriage] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [category, setCategory] = useState({
    label: "General",
    cat: "general",
    type: "general",
  });
  const [showCategory, setShowCategory] = useState(false);
  const [anonymous, setAnonymous] = useState(false);

  const handleBodyChange = (text) => {
    setBody(text);

    clearTimeout(triageTimerRef.current);
    if (text.length > 10) {
      setShowTriage(true);
      triageTimerRef.current = setTimeout(() => {
        setShowTriage(false);
        detectCategory(text);
      }, 1200);
    } else {
      setShowTriage(false);
      setShowCategory(false);
    }

    if (EMERGENCY_RE.test(text)) {
      setShowEmergency(true);
    } else {
      setShowEmergency(false);
    }
  };

  const classifyApiUrl =
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_CLASSIFY_API
      ? process.env.NEXT_PUBLIC_CLASSIFY_API
      : "http://localhost:3002";

  const detectCategory = async (text) => {
    let matched = { label: "General", cat: "general", type: "general" };
    try {
      const res = await fetch(`${classifyApiUrl}/classify/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const data = await res.json();
        const cat = data?.category;
        if (cat && CATEGORY_LABEL_BY_CAT[cat]) {
          matched = CATEGORY_LABEL_BY_CAT[cat];
        }
      }
    } catch (_) {
      // fallback to regex
      for (const { re, label, cat } of CATEGORY_MAP) {
        if (re.test(text)) {
          matched = { label, cat, type: "specialty" };
          break;
        }
      }
    }
    setCategory(matched);
    setShowCategory(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;

    const tags = [
      {
        label: category.label,
        type: category.label === "General" ? "general" : "specialty",
      },
    ];
    if (EMERGENCY_RE.test(body)) tags.push({ label: "URGENT", type: "urgent" });

    DB.addPost({
      title: subject.trim(),
      body: body.trim(),
      tags,
      category: category.cat,
    });

    setSubject("");
    setBody("");
    setShowCategory(false);
    setShowEmergency(false);
    setCategory({ label: "General", cat: "general", type: "general" });

    showToast("Post published successfully!");
    router.push("/");
  };

  const charLimit = 2000;
  const charPercent = Math.min((body.length / charLimit) * 100, 100);
  const charColor =
    body.length > charLimit * 0.9
      ? "var(--red-500, #ef4444)"
      : body.length > charLimit * 0.7
        ? "var(--amber-500, #f59e0b)"
        : "var(--primary)";

  return (
    <div className="page-container" id="create-post">
      <div className="view-header">
        <button className="view-header__back" onClick={() => router.push("/")}>
          <span className="material-icons-round">arrow_back</span>
        </button>
        <span className="view-header__title">New Post</span>
        <span className="view-header__spacer"></span>
      </div>

      <EmergencyBanner visible={showEmergency} />

      <div className="create-form">
        {/* Guidelines banner */}
        <div className="create-guidelines">
          <div className="create-guidelines__icon">
            <span className="material-icons-round">tips_and_updates</span>
          </div>
          <div className="create-guidelines__content">
            <h4 className="create-guidelines__title">
              Writing a great health question
            </h4>
            <ul className="create-guidelines__list">
              <li>Be specific about symptoms, duration &amp; location</li>
              <li>Include relevant medical history</li>
              <li>Avoid sharing sensitive personal identifiers</li>
            </ul>
          </div>
        </div>

        <form id="create-form" onSubmit={handleSubmit}>
          {/* Subject */}
          <div className="form-group">
            <label className="form-label">
              <span
                className="material-icons-round"
                style={{
                  fontSize: "14px",
                  verticalAlign: "middle",
                  marginRight: "4px",
                }}
              >
                title
              </span>
              Subject
            </label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Persistent headache after screen time — should I worry?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <span className="form-hint" style={{ marginTop: "0.25rem" }}>
              A clear title helps professionals respond faster
            </span>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">
              <span
                className="material-icons-round"
                style={{
                  fontSize: "14px",
                  verticalAlign: "middle",
                  marginRight: "4px",
                }}
              >
                edit_note
              </span>
              Description
            </label>
            <div className="textarea-wrap">
              <textarea
                className="form-textarea"
                rows="7"
                placeholder="Describe your symptoms, concerns, or question in detail. Include when it started, what makes it better or worse, and any medications you take…"
                value={body}
                onChange={(e) => handleBodyChange(e.target.value)}
              ></textarea>
              <div className="textarea-footer">
                <div className="textarea-tools">
                  <button
                    type="button"
                    className="icon-btn icon-btn--xs"
                    title="Bold"
                  >
                    <span className="material-icons-round">format_bold</span>
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn--xs"
                    title="List"
                  >
                    <span className="material-icons-round">
                      format_list_bulleted
                    </span>
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn--xs"
                    title="Attach"
                  >
                    <span className="material-icons-round">attach_file</span>
                  </button>
                </div>
                <div className="char-count-ring">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="var(--slate-200)"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke={charColor}
                      strokeWidth="2.5"
                      strokeDasharray={`${charPercent * 0.628} 62.8`}
                      strokeLinecap="round"
                      transform="rotate(-90 12 12)"
                      style={{
                        transition:
                          "stroke-dasharray 0.3s ease, stroke 0.3s ease",
                      }}
                    />
                  </svg>
                  <span className="char-count" style={{ color: charColor }}>
                    {body.length}
                  </span>
                </div>
              </div>
              {showTriage && (
                <div className="triage-overlay">
                  <div className="triage-overlay__inner">
                    <span className="material-icons-round spin">sync</span>
                    AI Triage analyzing…
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Category result */}
          {showCategory && (
            <div className="category-preview" id="category-preview">
              <div className="category-preview__icon">
                <span className="material-icons-round">auto_awesome</span>
              </div>
              <div className="category-preview__content">
                <span className="category-preview__label">
                  AI-Detected Category
                </span>
                <span
                  className={`tag ${category.label === "General" ? "tag--general" : "tag--specialty"}`}
                  id="category-tag"
                >
                  {category.label}
                </span>
              </div>
            </div>
          )}

          {/* Options */}
          <div className="create-extras">
            <label className="extra-check">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
              <span
                className="material-icons-round"
                style={{ fontSize: "18px", color: "var(--slate-400)" }}
              >
                {anonymous ? "visibility_off" : "person"}
              </span>
              <span>Post anonymously</span>
            </label>
            <label className="extra-check">
              <input type="checkbox" defaultChecked />
              <span
                className="material-icons-round"
                style={{ fontSize: "18px", color: "var(--slate-400)" }}
              >
                notifications
              </span>
              <span>Notify on replies</span>
            </label>
          </div>

          {/* Submit area */}
          <div className="create-submit-area">
            <div className="create-submit-area__info">
              <span className="material-icons-round">verified_user</span>
              <span>
                Posts are reviewed by AI for category triage. Verified
                professionals may respond within 24 hours.
              </span>
            </div>
            <button
              type="submit"
              className="btn btn--primary btn--lg create-submit-btn"
              disabled={!subject.trim() || !body.trim()}
            >
              <span
                className="material-icons-round"
                style={{ fontSize: "20px" }}
              >
                send
              </span>
              Publish Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
