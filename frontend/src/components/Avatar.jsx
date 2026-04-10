import React from "react";

const Avatar = ({ username = "?", size = "md", className = "" }) => {
  const initials = (username || "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sizeMap = {
    xs: { width: "24px", height: "24px", fontSize: "10px" },
    sm: { width: "32px", height: "32px", fontSize: "12px" },
    md: { width: "48px", height: "48px", fontSize: "18px" },
    lg: { width: "80px", height: "80px", fontSize: "32px" },
    xl: { width: "120px", height: "120px", fontSize: "40px" },
  };

  const style = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`avatar ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #1f6feb 0%, #388bfd 100%)",
        border: "2px solid #58a6ff",
        fontWeight: "bold",
        color: "white",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
        ...style,
      }}
      title={username}
    >
      {initials}
    </div>
  );
};

export default Avatar;
