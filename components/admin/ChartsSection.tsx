import {
  ON_TIME_DATA,
  ROUTE_STATUS_DATA,
  WEEKLY_TRANSPORT_DATA,
} from "@/lib/admin/constants";

function WeeklyTransportChart() {
  const maxTrips = Math.max(...WEEKLY_TRANSPORT_DATA.map((item) => item.trips));

  return (
    <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-card)] md:p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-primary">Weekly Transport Volume</h3>
        <p className="mt-1 font-[family-name:var(--font-inter)] text-sm text-muted">
          Total trips completed this week
        </p>
      </div>

      <div className="flex h-48 items-end justify-between gap-2 sm:gap-3">
        {WEEKLY_TRANSPORT_DATA.map((item) => {
          const height = `${(item.trips / maxTrips) * 100}%`;

          return (
            <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-full w-full items-end">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary-container transition-all"
                  style={{ height }}
                  title={`${item.trips} trips`}
                />
              </div>
              <span className="font-[family-name:var(--font-inter)] text-xs font-semibold text-muted">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OnTimePerformanceChart() {
  const width = 320;
  const height = 120;
  const padding = 12;
  const stepX = (width - padding * 2) / (ON_TIME_DATA.length - 1);
  const points = ON_TIME_DATA.map((value, index) => {
    const x = padding + index * stepX;
    const y = height - padding - ((value - 80) / 20) * (height - padding * 2);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-card)] md:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-primary">On-Time Performance</h3>
          <p className="mt-1 font-[family-name:var(--font-inter)] text-sm text-muted">
            7-day punctuality trend
          </p>
        </div>
        <div className="rounded-lg bg-secondary-container px-3 py-1.5 text-center">
          <p className="text-lg font-bold text-on-secondary-container">95%</p>
          <p className="font-[family-name:var(--font-inter)] text-[10px] font-semibold uppercase text-on-secondary-container">
            Today
          </p>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="On-time performance line chart"
      >
        <defs>
          <linearGradient id="onTimeFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(0, 106, 97, 0.25)" />
            <stop offset="100%" stopColor="rgba(0, 106, 97, 0)" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke="var(--secondary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        <polygon
          fill="url(#onTimeFill)"
          points={`${padding},${height - padding} ${points} ${width - padding},${height - padding}`}
        />
      </svg>
    </div>
  );
}

function RouteStatusChart() {
  const total = ROUTE_STATUS_DATA.reduce((sum, item) => sum + item.value, 0);
  let cumulative = 0;
  const segments = ROUTE_STATUS_DATA.map((item) => {
    const start = (cumulative / total) * 360;
    cumulative += item.value;
    const end = (cumulative / total) * 360;
    return { ...item, start, end };
  });

  function polarToCartesian(
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  function describeArc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "L",
      x,
      y,
      "Z",
    ].join(" ");
  }

  return (
    <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-card)] md:p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-primary">Route Status Mix</h3>
        <p className="mt-1 font-[family-name:var(--font-inter)] text-sm text-muted">
          Current fleet distribution
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
        <svg viewBox="0 0 120 120" className="h-32 w-32 shrink-0" role="img" aria-label="Route status donut chart">
          {segments.map((segment) => (
            <path
              key={segment.label}
              d={describeArc(60, 60, 50, segment.start, segment.end)}
              fill={segment.color}
            />
          ))}
          <circle cx="60" cy="60" r="28" fill="white" />
          <text
            x="60"
            y="58"
            textAnchor="middle"
            className="fill-foreground text-[14px] font-bold"
          >
            {total}
          </text>
          <text
            x="60"
            y="72"
            textAnchor="middle"
            className="fill-muted text-[8px] font-semibold"
          >
            ROUTES
          </text>
        </svg>

        <ul className="w-full space-y-3 sm:max-w-xs">
          {ROUTE_STATUS_DATA.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between font-[family-name:var(--font-inter)] text-sm"
            >
              <span className="flex items-center gap-2 text-foreground">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </span>
              <span className="font-semibold text-on-surface-variant">{item.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ChartsSection() {
  return (
    <section className="grid gap-6 xl:grid-cols-3">
      <div className="xl:col-span-2">
        <WeeklyTransportChart />
      </div>
      <OnTimePerformanceChart />
      <div className="xl:col-span-3">
        <RouteStatusChart />
      </div>
    </section>
  );
}
