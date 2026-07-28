import StatCard from "../shared/StatCard";

function StatsRow({ totalCount, completedCount, progressPercent }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        marginBottom: 32,
      }}
    >
      <StatCard
        label="Total Tasks"
        value={totalCount}
        helperText="All time"
        color="#e2e8f0"
      />
      <StatCard
        label="Completed"
        value={completedCount}
        helperText="Done ✓"
        color="#22c55e"
      />
      <StatCard
        label="Remaining"
        value={totalCount - completedCount}
        helperText="To do"
        color="#f59e0b"
      />
      <StatCard
        label="Progress"
        value={`${progressPercent}%`}
        color="#6366f1"
      >
        <div
          style={{
            height: 4,
            background: "#2d2d44",
            borderRadius: 99,
            marginTop: 8,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progressPercent}%`,
              background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
              borderRadius: 99,
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </StatCard>
    </div>
  );
}

export default StatsRow;
