import React from "react";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        color: "#8b949e",
        minHeight: "200px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid #30363d",
            borderTop: "3px solid #58a6ff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px",
          }}
        />
        <p style={{ margin: "0", fontSize: "14px" }}>{message}</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

const Error = ({ message = "An error occurred", onRetry }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        minHeight: "200px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>⚠️</div>
        <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "#f85149" }}>
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              padding: "8px 16px",
              background: "#1f6feb",
              color: "white",
              border: "1px solid #1f6feb",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
            }}
          >
            🔄 Retry
          </button>
        )}
      </div>
    </div>
  );
};

export { Loading, Error };
export default Loading;
