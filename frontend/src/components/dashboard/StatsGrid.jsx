export default function StatsGrid({ children, columns = 4 }) {
  const cols = {
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 xl:grid-cols-3",
    4: "sm:grid-cols-2 xl:grid-cols-4",
  };

  return (
    <div
      className={`grid grid-cols-1 gap-6 ${
        cols[columns] || "sm:grid-cols-2 xl:grid-cols-4"
      }`}
    >
      {children}
    </div>
  );
}

