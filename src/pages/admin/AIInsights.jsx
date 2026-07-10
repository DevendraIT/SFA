import EntityPage from "../../components/ui/EntityPage.jsx";

export default function AIInsightsPage() {
  return (
    <EntityPage
      title="AI Insights"
      subtitle="Machine learning powered business intelligence"
      collection="aiInsights"
      columns={[
        { key: "title", label: "Title" },
        { key: "insight", label: "Insight" },
        { key: "category", label: "Category" },
        { key: "confidence", label: "Confidence", render: (r) => `${r.confidence}%` },
      ]}
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "insight", label: "Insight", type: "textarea", required: true },
        { name: "category", label: "Category", type: "select", options: ["Revenue", "Leads", "Operations", "Team", "Forecast"] },
        { name: "confidence", label: "Confidence %", type: "number", required: true },
      ]}
      searchKeys={["title", "insight", "category"]}
      filters={[{ key: "category", label: "Category", options: ["Revenue", "Leads", "Operations", "Team", "Forecast"] }]}
      defaultValues={{ confidence: 80, category: "Revenue" }}
      theme="indigo"
      breadcrumbs={["Admin", "AI Insights"]}
    />
  );
}
