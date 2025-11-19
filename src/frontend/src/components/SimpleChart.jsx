import './SimpleChart.css'

// Simple bar chart without external libraries
function SimpleChart({ data, title, type = 'bar' }) {
  if (!data || data.length === 0) return null

  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className="simple-chart">
      {title && <h3 className="chart-title">{title}</h3>}

      <div className="chart-container">
        {type === 'bar' && (
          <div className="bar-chart">
            {data.map((item, idx) => (
              <div key={idx} className="bar-item">
                <div className="bar-wrapper">
                  <div
                    className="bar-fill"
                    style={{ height: `${(item.value / maxValue) * 100}%` }}
                  >
                    <span className="bar-value">{item.value}</span>
                  </div>
                </div>
                <div className="bar-label">{item.label}</div>
              </div>
            ))}
          </div>
        )}

        {type === 'pie' && (
          <div className="pie-chart">
            {data.map((item, idx) => (
              <div key={idx} className="pie-item">
                <div className="pie-color" style={{ background: item.color || '#667eea' }} />
                <span className="pie-label">{item.label}</span>
                <span className="pie-value">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SimpleChart
