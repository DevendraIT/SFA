import EntityPage from "../../components/ui/EntityPage.jsx";

export default function AISuggestionsPage() {
  return (
    <EntityPage
      title="AI Suggestions"
      subtitle="Smart recommendations for revenue growth"
      collection="aiInsights"
      columns={[
        { key: "title", label: "Suggestion" },
        { key: "insight", label: "Details" },
        { key: "category", label: "Category" },
        { key: "confidence", label: "Score", render: (r) => `${r.confidence}%` },
      ]}
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "insight", label: "Suggestion Details", type: "textarea", required: true },
        { name: "category", label: "Category", type: "select", options: ["Revenue", "Team", "Leads", "Operations"] },
        { name: "confidence", label: "Confidence", type: "number" },
      ]}
      searchKeys={["title", "insight"]}
      defaultValues={{ confidence: 85 }}
      theme="blue"
    />
  );
}
