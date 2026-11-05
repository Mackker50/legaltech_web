import { useState } from "react";
import Sidebar from "./components/sidebar.jsx";
import Header from "./components/header.jsx";
import AIAdvisor from "./components/ai-advisor.jsx";
import ShipmentBoard from "./components/shipment-board.jsx";
import FileUpload from "./components/file-upload.jsx";
import { Ship, FileWarning, DollarSign, Sparkles } from "lucide-react";
import styles from "./main.module.css";

const stats = [
  {
    label: "Active Shipments",
    value: "3",
    sub: "2 on-schedule",
    icon: Ship,
    bg: "rgba(59,130,246,0.04)",
    border: "rgba(59,130,246,0.15)",
    iconBg: "rgba(59,130,246,0.1)",
    iconColor: "#2563EB",
    valueColor: "#1E40AF",
  },
  {
    label: "Docs Pending",
    value: "4",
    sub: "Across 2 deals",
    icon: FileWarning,
    bg: "rgba(245,158,11,0.04)",
    border: "rgba(245,158,11,0.15)",
    iconBg: "rgba(245,158,11,0.1)",
    iconColor: "#D97706",
    valueColor: "#B45309",
  },
  {
    label: "Total Export Value",
    value: "$294K",
    sub: "USD — Nov 2026",
    icon: DollarSign,
    bg: "rgba(16,185,129,0.04)",
    border: "rgba(16,185,129,0.15)",
    iconBg: "rgba(16,185,129,0.1)",
    iconColor: "#059669",
    valueColor: "#065F46",
  },
  {
    label: "AI Queries Today",
    value: "12",
    sub: "3 compliance alerts",
    icon: Sparkles,
    bg: "rgba(139,92,246,0.04)",
    border: "rgba(139,92,246,0.15)",
    iconBg: "rgba(139,92,246,0.1)",
    iconColor: "#7C3AED",
    valueColor: "#5B21B6",
  },
];

function StatCard({ stat }) {
  const Icon = stat.icon;
  return (
    <div
      className={styles.statCard}
      style={{ background: stat.bg, border: `1.5px solid ${stat.border}` }}
    >
      <div className={styles.statIconWrap} style={{ background: stat.iconBg }}>
        <Icon style={{ color: stat.iconColor }} />
      </div>
      <p className={styles.statValue} style={{ color: stat.valueColor }}>{stat.value}</p>
      <p className={styles.statLabel}>{stat.label}</p>
      <p className={styles.statSub}>{stat.sub}</p>
    </div>
  );
}

export default function AgriLegalDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [currentRole, setCurrentRole] = useState("exporter");

  const roleLabel =
    currentRole === "exporter" ? "Exporter"
    : currentRole === "middleman" ? "Middleman"
    : "Freight Forwarder";

  return (
    <div className={styles.root}>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <div className={styles.contentArea}>
        <Header currentRole={currentRole} setCurrentRole={setCurrentRole} />

        <main className={styles.main}>
          {/* Page Title */}
          <div className={styles.pageTitle}>
            <h1 className={styles.pageTitleH1}>Export Operations Dashboard</h1>
            <p className={styles.pageTitleSub}>
              Thursday, November 5, 2026 · Logged in as{" "}
              <span className={styles.pageTitleRole}>{roleLabel}</span>
            </p>
          </div>

          {/* Stats Row */}
          <div className={styles.statsGrid}>
            {stats.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </div>

          {/* AI Advisor */}
          <div className={styles.section}>
            <AIAdvisor currentRole={currentRole} />
          </div>

          {/* Shipment Board */}
          <div className={styles.section}>
            <ShipmentBoard currentRole={currentRole} />
          </div>

          {/* File Upload */}
          <div className={styles.section}>
            <FileUpload currentRole={currentRole} />
          </div>
        </main>
      </div>
    </div>
  );
}