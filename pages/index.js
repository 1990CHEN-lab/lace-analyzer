import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  async function testAPI() {
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData: {
            mediaType: "image/jpeg",
            base64: "",
          },
          prompt: "test",
        }),
      });

      const data = await res.json();

      setMessage(JSON.stringify(data));
    } catch (e) {
      setMessage(e.message);
    }
  }

  return (
    <div
      style={{
        padding: 40,
        fontFamily: "sans-serif",
      }}
    >
      <h1>Lace Analyzer</h1>

      <button
        onClick={testAPI}
        style={{
          padding: "12px 20px",
          cursor: "pointer",
        }}
      >
        测试API
      </button>

      <div
        style={{
          marginTop: 20,
          whiteSpace: "pre-wrap",
        }}
      >
        {message}
      </div>
    </div>
  );
}
