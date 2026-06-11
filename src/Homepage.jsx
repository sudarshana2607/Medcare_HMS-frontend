import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";

const SENTENCES = [
  "Smart Hospital Management System",
  "Connecting Patients with the Best Doctors",
  "Your Health, Our Priority — 24/7 Care",
  "Streamlined Appointments & Digital Records",
  "Quality Healthcare at Your Fingertips",
];

// ── Scroll-reveal hook ──
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function RevealSection({ children, className = "", style = {}, delay = 0 }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Homepage() {
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIdx, setCharIdx] = useState(0);

  const [openFaq, setOpenFaq] = useState(null);
  const [modalContent, setModalContent] = useState(null);

  // Star rating hover state
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    const current = SENTENCES[sentenceIdx];
    let timeout;
    if (!isDeleting && charIdx <= current.length) {
      timeout = setTimeout(() => { setDisplayed(current.slice(0, charIdx)); setCharIdx(c => c + 1); }, 60);
    } else if (!isDeleting && charIdx > current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && charIdx >= 0) {
      timeout = setTimeout(() => { setDisplayed(current.slice(0, charIdx)); setCharIdx(c => c - 1); }, 35);
    } else {
      setIsDeleting(false);
      setSentenceIdx(i => (i + 1) % SENTENCES.length);
      setCharIdx(0);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, sentenceIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const [appointmentData, setAppointmentData] = useState({
    fullname: "", email: "", phone: "", department: "", date: "", time: "", problem: "",
  });

  const handleChange = (e) => setAppointmentData({ ...appointmentData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("appointmentData", JSON.stringify(appointmentData));
    sessionStorage.setItem("appointmentData", JSON.stringify(appointmentData));
    alert("Appointment Saved Successfully");
    setAppointmentData({ fullname: "", email: "", phone: "", department: "", date: "", time: "", problem: "" });
  };

  const [feedbackData, setFeedbackData] = useState({ name: "", email: "", rating: "", feedback: "" });

  const handleFeedbackChange = (e) => setFeedbackData({ ...feedbackData, [e.target.name]: e.target.value });

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("feedbackData", JSON.stringify(feedbackData));
    sessionStorage.setItem("feedbackData", JSON.stringify(feedbackData));
    alert("Feedback Submitted Successfully");
    setFeedbackData({ name: "", email: "", rating: "", feedback: "" });
  };

  const faqItems = [
    { q: "How can I book an appointment?", a: "You can book appointments through our online appointment booking system on this page. Select your preferred department, date and time, and our team will confirm within 30 minutes." },
    { q: "Can I access my medical reports online?", a: "Yes. Patients can securely access all reports, prescriptions and diagnostic results through their personal dashboard after logging in." },
    { q: "Is emergency service available 24/7?", a: "Yes. Our emergency department and ambulance services are available round the clock, 365 days a year. Call +91 9999999999 for immediate assistance." },
    { q: "Can I cancel an appointment?", a: "Yes. Appointments can be cancelled or rescheduled up to 2 hours before the scheduled time through your patient dashboard or by calling our helpline." },
    { q: "Are online consultations available?", a: "Yes. We offer video consultations with our specialist doctors from the comfort of your home. Book an online appointment just like an in-person visit." },
    { q: "How are patient records kept secure?", a: "All patient data is stored with industry-standard encryption. Only authorised doctors and staff can access your records, and you control who sees your information." },
    { q: "Does MedCare accept health insurance?", a: "We are empanelled with all major insurance providers. Please carry your insurance card and policy details when visiting. Our billing team will assist with claims." },
    { q: "What should I bring for my first visit?", a: "Please bring a valid photo ID, any previous medical records or prescriptions, your insurance card (if applicable), and arrive 15 minutes before your scheduled appointment." },
  ];

  const termsPoints = [
    ["1. Acceptance of Terms", "By accessing or using this Hospital Management System, users agree to follow all terms and conditions mentioned here. The hospital reserves the right to update these terms when required."],
    ["2. Patient Information Accuracy", "Patients must provide correct and complete personal, medical, and contact information. Any incorrect information may affect treatment, appointments, billing, or medical records."],
    ["3. Medical Services Disclaimer", "The system helps manage hospital services such as appointments, records, billing, and reports. It does not replace professional medical advice, diagnosis, or emergency medical care."],
    ["4. Appointment and Cancellation Policy", "Patients should attend scheduled appointments on time. The hospital may allow cancellation or rescheduling based on availability and hospital policies."],
    ["5. Privacy and Data Protection", "Patient information, medical records, and personal data will be stored securely and used only for healthcare, administrative, and legal purposes."],
    ["6. User Account Responsibility", "Users are responsible for maintaining the confidentiality of their login credentials. Any activity performed through their account will be considered their responsibility."],
    ["7. Billing and Payment Terms", "All hospital charges, including consultation fees, medicines, tests, and treatments, must be paid according to the hospital's billing policies."],
    ["8. Prescription and Medicine Usage", "Medicines and treatments should be used only as prescribed by authorized medical professionals. The hospital is not responsible for misuse of medicines."],
    ["9. System Usage and Security", "Users must not misuse, damage, hack, or attempt unauthorized access to the hospital management system or its data."],
    ["10. Emergency Services and Liability", "Emergency treatment will be provided according to hospital procedures. The hospital follows medical standards but cannot guarantee outcomes of treatments."],
  ];

  const privacyPoints = [
    ["1. Introduction", "This Privacy Policy explains how the Hospital Management System collects, uses, stores, and protects patient and user information while providing healthcare-related services."],
    ["2. Information We Collect", "We may collect personal details such as patient name, age, gender, contact details, address, medical history, appointment details, prescriptions, laboratory reports, and billing information."],
    ["3. Use of Patient Information", "Collected information is used for healthcare services, appointment management, medical record maintenance, billing processes, communication, and improving hospital services."],
    ["4. Medical Record Protection", "Patient medical records, diagnosis details, reports, and treatment information are stored securely and are accessible only to authorized hospital staff."],
    ["5. Data Security", "We use appropriate security measures to protect user information from unauthorized access, modification, loss, or misuse."],
    ["6. Sharing of Information", "Patient information will not be shared with third parties except with authorized healthcare professionals, required service providers, legal authorities, or when necessary for patient care."],
    ["7. User Account Privacy", "Users are responsible for keeping their login credentials confidential. The hospital is not responsible for unauthorized access caused by sharing account details."],
    ["8. Cookies and System Tracking", "The system may use cookies or similar technologies to improve user experience, maintain sessions, and enhance system performance."],
    ["9. Data Retention Policy", "Patient and hospital records will be stored according to hospital policies and applicable healthcare regulations. Records may be deleted or archived when no longer required."],
    ["10. User Rights and Policy Updates", "Users may request correction of inaccurate information or clarification about data usage. The hospital may update this Privacy Policy when required."],
  ];

  // Appointment form field completion count for progress bar
  const filledFields = Object.values(appointmentData).filter(v => v.trim && v.trim() !== "").length;
  const formProgress = Math.round((filledFields / 7) * 100);

  // Form step labels
  const formSteps = ["Personal Info", "Department & Time", "Describe Issue"];
  const currentStep = filledFields === 0 ? 0 : filledFields <= 3 ? 0 : filledFields <= 6 ? 1 : 2;

  return (
    <>
      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulse-badge {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124,58,237,0.35); }
          50% { box-shadow: 0 0 0 6px rgba(124,58,237,0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        /* ── Card hover lifts ── */
        .card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 32px rgba(124,58,237,0.15);
        }

        /* ── Doctor card enhancements ── */
        .doctor-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .doctor-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 32px rgba(124,58,237,0.18);
        }
        .doctor-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed22, #7c3aed44);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin: 0 auto 0.75rem;
          border: 3px solid #7c3aed33;
        }
        .availability-badge {
          display: inline-block;
          background: #d1fae5;
          color: #065f46;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 2px 10px;
          border-radius: 20px;
          margin-top: 0.5rem;
          letter-spacing: 0.02em;
          animation: pulse-badge 2.5s infinite;
        }
        .doctor-meta {
          font-size: 0.8rem;
          color: #6b7280;
          margin: 0.2rem 0 0;
        }

        /* ── Review card enhancements ── */
        .review-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .review-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 28px rgba(124,58,237,0.13);
        }
        .review-stars { color: #f59e0b; font-size: 1rem; letter-spacing: 2px; }
        .review-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #a78bfa);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: 1.1rem;
          margin: 0 auto 0.5rem;
        }
        .review-verified {
          font-size: 0.72rem;
          color: #7c3aed;
          font-weight: 600;
          margin-top: 0.4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        /* ── Announcement bar ── */
        .announcement-bar-inner {
          display: flex;
          white-space: nowrap;
          animation: ticker 28s linear infinite;
        }
        .announcement-bar { overflow: hidden; }

        /* ── Hero CTA buttons ── */
        .hero-btn-primary {
          display: inline-block;
          background: #7c3aed;
          color: #fff;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
          transition: background 0.2s, transform 0.2s;
          margin-right: 1rem;
          margin-top: 1.2rem;
        }
        .hero-btn-primary:hover { background: #6d28d9; transform: translateY(-2px); }
        .hero-btn-outline {
          display: inline-block;
          border: 2px solid #7c3aed;
          color: #7c3aed;
          padding: 0.73rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
          transition: background 0.2s, color 0.2s, transform 0.2s;
          margin-top: 1.2rem;
        }
        .hero-btn-outline:hover { background: #7c3aed; color: #fff; transform: translateY(-2px); }

        /* ── Hero trust bar ── */
        .hero-trust-bar {
          display: flex;
          gap: 0.75rem;
          margin-top: 2rem;
          flex-wrap: wrap;
        }
        .hero-trust-item {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.82rem;
          font-weight: 600;
          color: #374151;
          white-space: nowrap;
          background: #fff;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          padding: 0.45rem 0.9rem;
          box-shadow: 0 2px 6px rgba(124,58,237,0.07);
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .hero-trust-item:hover {
          border-color: #7c3aed55;
          box-shadow: 0 4px 12px rgba(124,58,237,0.13);
          transform: translateY(-2px);
        }
        .hero-trust-icon { font-size: 1rem; }

        /* ── How it works ── */
        .hiw-section { padding: 4rem 2rem; }
        .hiw-steps {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 2.5rem;
        }
        .hiw-step {
          flex: 1 1 200px;
          max-width: 240px;
          text-align: center;
          position: relative;
        }
        .hiw-step-num {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #a78bfa);
          color: #fff;
          font-size: 1.4rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          box-shadow: 0 4px 16px rgba(124,58,237,0.3);
        }
        .hiw-step h4 { margin: 0 0 0.4rem; font-size: 1rem; color: #1f2937; }
        .hiw-step p { font-size: 0.88rem; color: #6b7280; margin: 0; line-height: 1.5; }
        .hiw-connector {
          position: absolute;
          top: 28px;
          right: -1rem;
          width: 2rem;
          border-top: 2px dashed #d1d5db;
        }

        /* ── Form progress bar ── */
        .form-progress-wrap { margin-bottom: 1.5rem; }
        .form-progress-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #6b7280;
          margin-bottom: 0.4rem;
        }
        .form-progress-bar-bg {
          height: 6px;
          background: #e5e7eb;
          border-radius: 99px;
          overflow: hidden;
        }
        .form-progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #7c3aed, #a78bfa);
          border-radius: 99px;
          transition: width 0.4s ease;
        }
        .form-steps-row {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.2rem;
          flex-wrap: wrap;
        }
        .form-step-chip {
          font-size: 0.75rem;
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 500;
          border: 1.5px solid #e5e7eb;
          color: #9ca3af;
          background: #f9fafb;
          transition: all 0.2s;
        }
        .form-step-chip.active {
          border-color: #7c3aed;
          color: #7c3aed;
          background: #f5f3ff;
          font-weight: 600;
        }
        .form-step-chip.done {
          border-color: #10b981;
          color: #10b981;
          background: #f0fdf4;
        }

        /* ── FAQ cards ── */
        .faq-box {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .faq-item {
          cursor: pointer;
          background: #fff;
          border: 1.5px solid #e5e7eb;
          border-radius: 14px;
          padding: 1.2rem 1.5rem;
          box-shadow: 0 2px 8px rgba(124,58,237,0.06);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .faq-item:hover {
          border-color: #7c3aed44;
          box-shadow: 0 4px 16px rgba(124,58,237,0.12);
        }
        .faq-item.open-card {
          border-color: #7c3aed;
          background: #faf8ff;
        }
        .faq-item h4 {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
          color: #1f2937;
          text-align: left;
          line-height: 1.5;
          gap: 1rem;
        }
        .faq-toggle {
          font-size: 1.3rem;
          font-weight: 600;
          line-height: 1.2;
          color: #7c3aed;
          transition: transform 0.3s ease;
          flex-shrink: 0;
          margin-left: auto;
          width: 28px;
          height: 28px;
          background: #f5f3ff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .faq-toggle.open { transform: rotate(45deg); background: #7c3aed; color: #fff; }
        .faq-answer {
          margin-top: 0.75rem;
          margin-bottom: 0;
          color: #4b5563;
          line-height: 1.7;
          font-size: 0.92rem;
          padding-right: 2.5rem;
          border-top: 1px solid #e5e7eb;
          padding-top: 0.75rem;
        }

        /* ── Star rating ── */
        .star-rating-row {
          display: flex;
          gap: 6px;
          margin: 0.5rem 0 1rem;
        }
        .star-btn {
          background: none;
          border: none;
          font-size: 1.6rem;
          cursor: pointer;
          padding: 0;
          transition: transform 0.15s;
          line-height: 1;
        }
        .star-btn:hover { transform: scale(1.25); }

        /* ── Newsletter strip ── */
        .newsletter-strip {
          background: linear-gradient(135deg, #7c3aed11, #a78bfa11);
          border: 1.5px solid #7c3aed22;
          border-radius: 16px;
          padding: 2rem 2.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          flex-wrap: wrap;
          margin: 2rem 0;
        }
        .newsletter-strip h3 { margin: 0 0 0.25rem; font-size: 1.15rem; color: #1f2937; }
        .newsletter-strip p { margin: 0; font-size: 0.88rem; color: #6b7280; }
        .newsletter-input-row {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .newsletter-input {
          padding: 0.6rem 1rem;
          border: 1.5px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.9rem;
          min-width: 220px;
          outline: none;
          transition: border-color 0.2s;
        }
        .newsletter-input:focus { border-color: #7c3aed; }
        .newsletter-btn {
          background: #7c3aed;
          color: #fff;
          border: none;
          padding: 0.6rem 1.4rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .newsletter-btn:hover { background: #6d28d9; }

        /* ── Stat highlight row ── */
        .stat-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
          margin: 2.5rem 0 0;
          padding: 1.5rem 2rem;
          background: #7c3aed08;
          border-radius: 14px;
          border: 1px solid #7c3aed15;
        }
        .stat-item { text-align: center; flex: 1 1 120px; }
        .stat-num { font-size: 1.8rem; font-weight: 800; color: #7c3aed; line-height: 1.1; }
        .stat-label { font-size: 0.78rem; color: #6b7280; margin-top: 2px; }

        /* ── Floating hero image ── */
        .hero-img-float { animation: float 5s ease-in-out infinite; }

        /* ── Accreditation bar ── */
        .accreditation-bar {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          padding: 1.5rem 2rem;
          background: #f9fafb;
          border-top: 1px solid #f3f4f6;
          border-bottom: 1px solid #f3f4f6;
        }
        .accreditation-bar span {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #374151;
          background: #fff;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          padding: 0.45rem 0.9rem;
          box-shadow: 0 2px 6px rgba(124,58,237,0.06);
          white-space: nowrap;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .accreditation-bar span:hover {
          border-color: #7c3aed55;
          box-shadow: 0 4px 12px rgba(124,58,237,0.12);
          transform: translateY(-2px);
        }

        /* ── Module icon dot ── */
        .module-icon { font-size: 1.8rem; margin-bottom: 0.5rem; }

        /* ── Department chip ── */
        .dept-icon { font-size: 1.5rem; margin-bottom: 0.4rem; }

        /* ── Modal ── */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .modal-box {
          background: #fff;
          border-radius: 12px;
          max-width: 700px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          padding: 2rem;
          position: relative;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .modal-box h2 {
          margin-top: 0;
          color: #1f2937;
          border-bottom: 2px solid #7c3aed;
          padding-bottom: 0.5rem;
          margin-bottom: 1.2rem;
        }
        .modal-close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          line-height: 1;
          color: #6b7280;
          transition: color 0.2s;
        }
        .modal-close-btn:hover { color: #111; }
        .modal-point { margin-bottom: 1rem; line-height: 1.6; }
        .modal-point strong { display: block; color: #1f2937; margin-bottom: 0.2rem; }
        .modal-point p { margin: 0; color: #4b5563; }
      `}</style>

      {/* ── Nav ── */}
      <nav>
        <div className="logo">
          <img src="/logo.png" alt="MedCare Logo" />
          <h2>MedCare</h2>
        </div>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#modules">Features</a></li>
          <li><a href="#departments">Departments</a></li>
          <li><a href="#booking">Book Meeting</a></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>

      {/* ── Scrolling Announcement Bar ── */}
      <div className="announcement-bar" role="status" aria-live="polite" style={{ overflow: "hidden" }}>
        <div className="announcement-bar-inner">
          {[...Array(2)].map((_, ri) => (
            <span key={ri} style={{ display: "inline-flex", gap: "2.5rem", paddingRight: "2.5rem" }}>
              <span>🚑 24/7 Emergency Services Available</span>
              <span>💜 Free Health Checkup Camp Every Month</span>
              <span>📞 Emergency Contact : +91 9999999999</span>
              <span>🩺 Expert Doctors Across All Departments</span>
              <span>💊 Special Offers Available</span>
              <span>🏆 NABH Accredited Hospital</span>
              <span>🌐 Online Consultations Now Available</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 style={{ minHeight: "3.2rem" }}>
              {displayed}
              <span style={{
                display: "inline-block", width: 3, height: "1em", background: "#7c3aed",
                marginLeft: 2, verticalAlign: "text-bottom", animation: "blink 0.8s step-end infinite",
              }} />
            </h1>
            <p>
              Modern healthcare platform to manage patients, doctors,
              appointments, billing, pharmacy and hospital operations efficiently.
              Trusted by 5,000+ patients across Tamil Nadu.
            </p>
            <div>
              <a href="#booking" className="hero-btn-primary">📅 Book Appointment</a>
              <a href="#about" className="hero-btn-outline">Learn More →</a>
            </div>
            <div className="hero-trust-bar">
              <div className="hero-trust-item"><span className="hero-trust-icon">🔒</span> Secure &amp; HIPAA-safe</div>
              <div className="hero-trust-item"><span className="hero-trust-icon">⚡</span> Instant Confirmation</div>
              <div className="hero-trust-item"><span className="hero-trust-icon">🩺</span> 150+ Specialists</div>
              <div className="hero-trust-item"><span className="hero-trust-icon">🌟</span> 4.9 / 5 Patient Rating</div>
            </div>
          </div>
          <div className="hero-image">
            <img
              className="hero-img-float"
              src="https://img.magnific.com/free-photo/copy-space-stethoscope-pills_23-2148550954.jpg"
              alt="Stethoscope and pills on a desk"
            />
          </div>
        </div>
      </section>

      {/* ── Accreditation Bar ── */}
      <div className="accreditation-bar">
        <span>🏅 NABH Accredited</span>
        <span>🌐 ISO 9001:2015 Certified</span>
        <span>💳 Cashless Insurance Available</span>
        <span>🚑 Ambulance in 10 Minutes</span>
        <span>💻 Paperless Digital Records</span>
        <span>🧪 In-house Advanced Diagnostics</span>
      </div>

      {/* ── About ── */}
      <section className="about-section" id="about">
        <div className="about-container">
          <RevealSection className="about-text">
            <h2>About Us</h2>
            <p>
              Founded with a vision to provide quality healthcare services,
              our hospital management system helps hospitals streamline patient care,
              doctor management, appointments, pharmacy, billing and diagnostics efficiently.
              We focus on modern healthcare technology, patient satisfaction and seamless
              hospital operations.
            </p>
            <p style={{ marginTop: "0.8rem", color: "#4b5563", lineHeight: 1.7 }}>
              From routine check-ups to complex surgical procedures, our network of
              experienced specialists is equipped with the latest medical technology.
              We believe every patient deserves personalised, compassionate care — and
              our digital-first platform makes that easier than ever.
            </p>
          </RevealSection>
          <div className="about-cards">
            {[
              { num: "25+", title: "Years Experience", desc: "Providing trusted healthcare management solutions with advanced technology." },
              { num: "150+", title: "Doctors", desc: "Experienced doctors and specialists available across multiple departments." },
              { num: "5000+", title: "Happy Patients", desc: "Thousands of patients successfully treated with quality care and support." },
              { num: "24/7", title: "Emergency Support", desc: "Round-the-clock emergency healthcare and patient assistance services." },
            ].map((item, i) => (
              <RevealSection key={i} delay={i * 0.1}>
                <div className="about-card">
                  <h1 style={{ fontWeight: 800, color: "#1f2937" }}>{item.num}</h1>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="hiw-section">
        <h2 className="section-title">How It Works</h2>
        <RevealSection>
          <div className="hiw-steps">
            {[
              { icon: "📋", num: "1", title: "Register / Login", desc: "Create your patient account in under 2 minutes using your phone or email." },
              { icon: "🔍", num: "2", title: "Find a Doctor", desc: "Browse our specialists by department, availability or language preference." },
              { icon: "📅", num: "3", title: "Book Appointment", desc: "Pick a date and time that works for you — online or in-person." },
              { icon: "🩺", num: "4", title: "Consult &amp; Get Treated", desc: "Meet your doctor, receive a diagnosis, prescription and care plan." },
              { icon: "📂", num: "5", title: "Access Your Records", desc: "View reports, prescriptions and follow-up notes anytime from your dashboard." },
            ].map((step, i, arr) => (
              <div className="hiw-step" key={i}>
                <div className="hiw-step-num" style={{ fontSize: "1.3rem" }}>{step.icon}</div>
                <h4>{step.title}</h4>
                <p dangerouslySetInnerHTML={{ __html: step.desc }} />
                {i < arr.length - 1 && <div className="hiw-connector" />}
              </div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* ── Features / Modules ── */}
      <section className="modules" id="modules">
        <h2 className="section-title">Hospital Features</h2>
        <div className="card-container">
          {[
            { icon: "🧑‍⚕️", title: "Patient Module", desc: "Manage patient records, medical history, treatment plans and discharge summaries in one place." },
            { icon: "👨‍⚕️", title: "Doctor Module", desc: "Manage doctor profiles, specialisations, availability schedules and consultation history." },
            { icon: "📅", title: "Appointment Module", desc: "Book, reschedule and cancel patient appointments with automated reminders." },
            { icon: "💳", title: "Billing Module", desc: "Generate itemised invoices, process insurance claims and produce payment reports." },
            { icon: "💊", title: "Pharmacy Module", desc: "Maintain medicine inventory, manage prescriptions and track dispensing records." },
            { icon: "🧪", title: "Lab Module", desc: "Store laboratory test orders, results and diagnostic reports securely." },
            { icon: "🚨", title: "Emergency Module", desc: "Prioritise critical cases, coordinate ambulances and alert the duty team instantly." },
          ].map((m, i) => (
            <RevealSection key={i} delay={i * 0.07}>
              <div className="card">
                <div className="module-icon">{m.icon}</div>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ── Departments ── */}
      <section className="departments" id="departments">
        <h2 className="section-title">Hospital Departments</h2>
        <div className="card-container">
          {[
            { icon: "🧠", title: "Neurology", desc: "Specialists for brain, nerves and neurological disorders including epilepsy and stroke." },
            { icon: "👶", title: "Pediatrics", desc: "Healthcare services for infants, children and teenagers with dedicated child-friendly care." },
            { icon: "❤️", title: "Cardiology", desc: "Treatment and diagnosis for heart related diseases, ECG and interventional procedures." },
            { icon: "🦴", title: "Orthopedics", desc: "Bone, joint and muscle treatment specialists including sports injuries and joint replacement." },
            { icon: "🌿", title: "Dermatology", desc: "Skin, hair and nail care treatments including cosmetic dermatology procedures." },
            { icon: "🌸", title: "Gynecology", desc: "Women reproductive health, maternity care and high-risk pregnancy management." },
            { icon: "👂", title: "ENT", desc: "Ear, nose and throat specialist department with audiology and endoscopy services." },
            { icon: "🔬", title: "Radiology", desc: "Medical imaging including MRI, CT scan, X-ray and ultrasound services." },
            { icon: "🎗️", title: "Oncology", desc: "Cancer diagnosis, chemotherapy, radiation therapy and palliative care." },
            { icon: "🧘", title: "Psychiatry", desc: "Mental health, counselling, de-addiction support and cognitive therapy." },
            { icon: "🫘", title: "Urology", desc: "Treatment for urinary tract, prostate, kidney and bladder conditions." },
            { icon: "🩺", title: "General Medicine", desc: "Primary healthcare, routine check-ups and overall medical treatment for all ages." },
          ].map((d, i) => (
            <RevealSection key={i} delay={(i % 4) * 0.08}>
              <div className="card">
                <div className="dept-icon">{d.icon}</div>
                <h3>{d.title}</h3>
                <p>{d.desc}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ── Appointment Booking ── */}
      <section id="booking">
        <h2 className="section-title">Book a Meeting</h2>
        {/* Progress bar — above the booking box */}
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 2rem 1.5rem" }}>
          <div className="form-progress-wrap" style={{ marginBottom: 0 }}>
            <div className="form-steps-row">
              {formSteps.map((s, i) => (
                <span key={s} className={`form-step-chip ${i < currentStep ? "done" : i === currentStep ? "active" : ""}`}>
                  {i < currentStep ? "✓ " : `${i + 1}. `}{s}
                </span>
              ))}
            </div>
            <div className="form-progress-label">
              <span>Form completion</span>
              <span>{formProgress}%</span>
            </div>
            <div className="form-progress-bar-bg">
              <div className="form-progress-bar-fill" style={{ width: `${formProgress}%` }} />
            </div>
          </div>
        </div>

        <div className="booking-container" style={{ marginTop: 0 }}>
          <form className="booking-form" onSubmit={handleSubmit}>
            <input type="text" name="fullname" placeholder="Enter Full Name" value={appointmentData.fullname} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Enter Email Address" value={appointmentData.email} onChange={handleChange} required />
            <input type="tel" name="phone" placeholder="Enter Phone Number" value={appointmentData.phone} onChange={handleChange} required />
            <select name="department" value={appointmentData.department} onChange={handleChange} required>
              <option value="">Select Department</option>
              {["Cardiology","Neurology","Pediatrics","Orthopedics","Dermatology","Gynecology","ENT","Radiology","Oncology","Psychiatry","Urology","General Medicine"].map(d => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <input type="date" name="date" value={appointmentData.date} onChange={handleChange} required />
            <input type="time" name="time" value={appointmentData.time} onChange={handleChange} required />
            <textarea rows="5" name="problem" placeholder="Describe Your Problem (symptoms, duration, previous medications, etc.)" value={appointmentData.problem} onChange={handleChange}></textarea>
            <button type="submit">📅 Book Appointment</button>
          </form>
        </div>
      </section>

      {/* ── Doctors ── */}
      <section className="doctors-section">
        <h2 className="section-title">Our Specialists</h2>
        <div className="card-container">
          {[
            { emoji: "👨‍⚕️", name: "Dr. Ramesh Kumar", role: "Cardiologist", exp: "18 yrs experience", lang: "Tamil, English", avail: "Mon – Sat" },
            { emoji: "👩‍⚕️", name: "Dr. Priya Sharma", role: "Neurologist", exp: "14 yrs experience", lang: "Tamil, Hindi", avail: "Mon – Fri" },
            { emoji: "👨‍⚕️", name: "Dr. Arun Prakash", role: "Orthopedic Specialist", exp: "20 yrs experience", lang: "Tamil, English", avail: "Tue – Sun" },
            { emoji: "👩‍⚕️", name: "Dr. Kavya Devi", role: "Dermatologist", exp: "11 yrs experience", lang: "Tamil", avail: "Mon – Sat" },
            { emoji: "👩‍⚕️", name: "Dr. Nithya Raj", role: "Pediatrician", exp: "9 yrs experience", lang: "Tamil, English", avail: "Mon – Sat" },
            { emoji: "👨‍⚕️", name: "Dr. Harish Kumar", role: "General Physician", exp: "15 yrs experience", lang: "Tamil, Telugu", avail: "Daily" },
          ].map((doc, i) => (
            <RevealSection key={i} delay={i * 0.08}>
              <div className="card doctor-card" style={{ textAlign: "center" }}>
                <div className="doctor-avatar">{doc.emoji}</div>
                <h3 style={{ margin: "0 0 0.2rem" }}>{doc.name}</h3>
                <p style={{ margin: 0, fontWeight: 600, color: "#7c3aed", fontSize: "0.92rem" }}>{doc.role}</p>
                <p className="doctor-meta">{doc.exp} · {doc.lang}</p>
                <span className="availability-badge">🟢 Available {doc.avail}</span>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ── Stats row ── */}
      <RevealSection>
        <div className="stat-row" style={{ margin: "0 2rem 2rem" }}>
          {[
            { num: "98%", label: "Patient Satisfaction" },
            { num: "<15 min", label: "Avg. Wait Time" },
            { num: "40+", label: "Departments & Units" },
            { num: "300+", label: "Beds Capacity" },
            { num: "10 min", label: "Ambulance Response" },
            { num: "1M+", label: "Tests Processed / Year" },
          ].map((s, i) => (
            <div className="stat-item" key={i}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* ── Reviews ── */}
      <section className="reviews">
        <h2 className="section-title">What Our Patients Say</h2>
        <div className="review-container">
          {[
            { name: "Arun M.", initials: "A", stars: 5, text: "Excellent hospital service with smooth appointment booking and quick support. The doctors are thorough and genuinely caring. Highly recommend!", tag: "Cardiology Patient" },
            { name: "Priya S.", initials: "P", stars: 5, text: "Doctors are professional and the consultation process is very easy. I had an online appointment and got my prescription in minutes. Wonderful experience.", tag: "Online Consultation" },
            { name: "Rahul T.", initials: "R", stars: 4, text: "Billing and pharmacy services are well managed and fast. The lab reports were ready well within the promised time. Very organised hospital.", tag: "General Medicine" },
            { name: "Lakshmi V.", initials: "L", stars: 5, text: "From booking to discharge, every step was seamless. The nursing staff is incredibly attentive and the facility is spotless. Best hospital in Pollachi.", tag: "Gynecology Patient" },
            { name: "Suresh K.", initials: "S", stars: 5, text: "My father was admitted through emergency and the response time was under 10 minutes. Truly professional team. Forever grateful to the MedCare family.", tag: "Emergency Care" },
            { name: "Anitha R.", initials: "A", stars: 4, text: "The children's ward is bright and friendly. Dr. Nithya put my daughter completely at ease. We always come to MedCare for our family's healthcare needs.", tag: "Pediatrics" },
          ].map((r, i) => (
            <RevealSection key={i} delay={(i % 3) * 0.1}>
              <div className="review-card" style={{ textAlign: "center" }}>
                <div className="review-avatar">{r.initials}</div>
                <h4 style={{ margin: "0 0 0.1rem" }}>{r.name}</h4>
                <div style={{ fontSize: "0.75rem", color: "#7c3aed", marginBottom: "0.4rem", fontWeight: 500 }}>{r.tag}</div>
                <div className="review-stars">{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</div>
                <p style={{ marginTop: "0.6rem", fontSize: "0.9rem", color: "#4b5563", lineHeight: 1.6 }}>"{r.text}"</p>
                <div className="review-verified">✅ Verified Patient</div>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ── Feedback ── */}
      <section className="feedback-section">
        <h2 className="section-title">Share Your Feedback</h2>
        <div className="booking-container" style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 2.5rem" }}>
          <form className="booking-form" onSubmit={handleFeedbackSubmit}>
            <input type="text" name="name" placeholder="Enter Name" value={feedbackData.name} onChange={handleFeedbackChange} required />
            <input type="email" name="email" placeholder="Enter Email" value={feedbackData.email} onChange={handleFeedbackChange} required />

            {/* Interactive star rating */}
            <div>
              <label style={{ fontSize: "0.88rem", color: "#6b7280", display: "block", marginBottom: "0.2rem" }}>
                Tap to rate your experience
              </label>
              <div className="star-rating-row">
                {[1,2,3,4,5].map(star => {
                  const ratingVal = feedbackData.rating ? parseInt(feedbackData.rating) : 0;
                  const filled = star <= (hoveredStar || ratingVal);
                  return (
                    <button
                      type="button"
                      key={star}
                      className="star-btn"
                      style={{ color: filled ? "#f59e0b" : "#d1d5db" }}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => {
                        const labels = ["", "Poor", "Average", "Good", "Very Good", "Excellent"];
                        handleFeedbackChange({ target: { name: "rating", value: labels[star] } });
                      }}
                    >★</button>
                  );
                })}
                {feedbackData.rating && (
                  <span style={{ fontSize: "0.85rem", color: "#7c3aed", fontWeight: 600, alignSelf: "center", marginLeft: 4 }}>
                    {feedbackData.rating}
                  </span>
                )}
              </div>
              <input type="hidden" name="rating" value={feedbackData.rating} />
            </div>

            <textarea rows="5" name="feedback" placeholder="Tell us about your visit — what went well and what could be improved? Your feedback helps us serve you better." value={feedbackData.feedback} onChange={handleFeedbackChange}></textarea>
            <button type="submit">💬 Submit Feedback</button>
          </form>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="faq-section">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-box">
          {faqItems.map((item, i) => (
            <div className={`faq-item ${openFaq === i ? "open-card" : ""}`} key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <h4>
                {item.q}
                <span className={`faq-toggle ${openFaq === i ? "open" : ""}`}>+</span>
              </h4>
              {openFaq === i && <p className="faq-answer">{item.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer>
        {/* Newsletter strip inside footer top */}
        <div style={{ padding: "2rem 2rem 0" }}>
          <RevealSection>
            <div className="newsletter-strip">
              <div>
                <h3>📧 Stay Updated with MedCare</h3>
                <p>Health tips, free camp alerts and appointment reminders — delivered to your inbox.</p>
              </div>
              <div className="newsletter-input-row">
                <input className="newsletter-input" type="email" placeholder="Enter your email address" />
                <button className="newsletter-btn" type="button" onClick={() => alert("Subscribed! Thank you.")}>Subscribe</button>
              </div>
            </div>
          </RevealSection>
        </div>

        <div className="footer-container">
          <div className="footer-logo">
            <img src="/logo.png" alt="MedCare Logo" />
            <div className="social-icons">
              <a href="/">Facebook</a>
              <a href="/">Instagram</a>
              <a href="/">LinkedIn</a>
              <a href="/">YouTube</a>
              <a href="/">WhatsApp</a>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.9214938728173!2d77.00530347767985!3d10.663201662350483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8382aa12c47c7%3A0x3125acac566855d0!2sSiva%20Meds%20Multispeciality%20Hospital!5e0!3m2!1sen!2sin!4v1779901487034!5m2!1sen!2sin"
              width="250" height="250" style={{ border: 0 }} allowFullScreen loading="lazy" title="Hospital Location Map"
            />
          </div>

          <div>
            <h2 className="footer-heading">Get in Touch</h2>
            <div className="footer-contact">
              <p><strong>MedCare Hospital</strong><br />Pollachi, Tamil Nadu - 642001<br />India</p>
              <p>Email : medcarehospital@gmail.com<br />support@medcare.com</p>
              <p>Phone : +91 9876543210<br />+91 9876543211</p>
              <p>Emergency Helpline: +91 9999999999</p>
              <p>Facebook : medcarehospital</p>
              <p>Instagram : @medcarehospital</p>
              <p>Linkedin : medcarehospital</p>
              <p>Youtube : medcarehospital</p>
              <p>WhatsApp : +91 9876543210</p>
              <p>Twitter : medcarehospital</p>
            </div>
          </div>

          <div>
            <h2 className="footer-heading">Quick Links</h2>
            <ul className="footer-links">
              <li><a href="/">Hospital Directory</a></li>
              <li><a href="/">Patient Rights</a></li>
              <li><a href="/">Hospital Tariff</a></li>
              <li><a href="/">Health Packages</a></li>
              <li><a href="/">Patient Education</a></li>
              <li><a href="/">Medical Services</a></li>
              <li><a href="/">Departments</a></li>
              <li><a href="/">Emergency Care</a></li>
              <li><a href="/">FAQ</a></li>
              <li><a href="/">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© 2026 MedCare Hospital. All Rights Reserved.</div>
          <div>
            <a href="#privacy" onClick={e => { e.preventDefault(); setModalContent('privacy'); }}>Privacy Policy</a>{" "}|{" "}
            <a href="#privacy" onClick={e => { e.preventDefault(); setModalContent('privacy'); }}>Disclaimer</a>{" "}|{" "}
            <a href="#terms" onClick={e => { e.preventDefault(); setModalContent('terms'); }} style={{ cursor: "pointer" }}>Terms &amp; Condition</a>
          </div>
        </div>
      </footer>

      {/* ── Modals ── */}
      {modalContent && (
        <div className="modal-overlay" onClick={() => setModalContent(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setModalContent(null)}>✕</button>
            {modalContent === 'terms' && (
              <>
                <h2>Terms &amp; Conditions</h2>
                {termsPoints.map(([title, text]) => (
                  <div className="modal-point" key={title}><strong>{title}</strong><p>{text}</p></div>
                ))}
              </>
            )}
            {modalContent === 'privacy' && (
              <>
                <h2>Privacy Policy</h2>
                {privacyPoints.map(([title, text]) => (
                  <div className="modal-point" key={title}><strong>{title}</strong><p>{text}</p></div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Homepage;
