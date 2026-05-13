import { useState, useRef } from "react"

const COLORS = {
cream: "#faf6f1",
blush: "#f0e0d6",
dustyRose: "#d4a5a5",
mauve: "#b08080",
warmWhite: "#fffdf9",
laceBeige: "#f5ede0",
textDeep: "#3d2b2b",
textMid: "#6b4c4c",
textLight: "#9a7575",
};

function ScoreRing({ score, label }) {
const r = 30;
const circ = 2 * Math.PI * r;
const offset = circ - (circ * score) / 100;

return (
<div style={{ textAlign: "center" }}>
<div
style={{
position: "relative",
width: 72,
height: 72,
margin: "0 auto 8px",
}}
>
<svg
width="72"
height="72"
style={{ transform: "rotate(-90deg)" }}
>
<circle
cx="36"
cy="36"
r={r}
fill="none"
stroke={COLORS.blush}
strokeWidth="5"
/>

<circle
cx="36"
cy="36"
r={r}
fill="none"
stroke={COLORS.mauve}
strokeWidth="5"
strokeLinecap="round"
strokeDasharray={circ}
strokeDashoffset={offset}
style={{
transition: "stroke-dashoffset 1s ease",
}}
/>
</svg>

<div
style={{
position: "absolute",
inset: 0,
display: "flex",
alignItems: "center",
justifyContent: "center",
fontSize: 18,
color: COLORS.mauve,
fontWeight: "bold",
}}
>
{score}
</div>
</div>

<div
style={{
fontSize: 12,
color: COLORS.textMid,
}}
>
{label}
</div>
</div>
);
}

export default function Home() {
const [image, setImage] = useState(null);
const [result, setResult] = useState(null);
const [loading, setLoading] = useState(false);

const inputRef = useRef();

async function handleFile(file) {
if (!file) return;

const reader = new FileReader();

reader.onload = () => {
setImage(reader.result);
setResult(null);
};

reader.readAsDataURL(file);
}

async function analyzeImage() {
if (!image) return;

try {
setLoading(true);

const res = await fetch("/api/analyze", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
image,
}),
});

const data = await res.json();

if (data.error) {
throw new Error(data.error);
}

setResult(data);
} catch (err) {
alert("分析失败：" + err.message);
} finally {
setLoading(false);
}
}

function resetAll() {
setImage(null);
setResult(null);
}

return (
<div
style={{
minHeight: "100vh",
background: COLORS.cream,
padding: 20,
fontFamily: "serif",
}}
>
<div
style={{
maxWidth: 900,
margin: "0 auto",
}}
>
{/* Header */}
<div
style={{
textAlign: "center",
marginBottom: 40,
marginTop: 20,
}}
>
<div
style={{
fontSize: 50,
marginBottom: 10,
}}
>
🌸
</div>

<h1
style={{
fontSize: 42,
color: COLORS.textDeep,
marginBottom: 10,
fontWeight: "normal",
}}
>
Lace Analyzer
</h1>

<div
style={{
color: COLORS.textLight,
letterSpacing: 4,
fontSize: 13,
}}
>
AI FABRIC AESTHETIC ANALYSIS
</div>
</div>

{/* Upload */}
{!image && (
<div
onClick={() => inputRef.current.click()}
style={{
border: `2px dashed ${COLORS.dustyRose}`,
borderRadius: 28,
padding: 60,
background: COLORS.warmWhite,
textAlign: "center",
cursor: "pointer",
transition: "0.3s",
}}
>
<input
ref={inputRef}
type="file"
accept="image/*"
style={{ display: "none" }}
onChange={(e) => handleFile(e.target.files[0])}
/>

<div
style={{
fontSize: 70,
marginBottom: 20,
}}
>
🕊️
</div>

<div
style={{
fontSize: 26,
color: COLORS.textDeep,
marginBottom: 10,
}}
>
上传蕾丝布料图片
</div>

<div
style={{
color: COLORS.textLight,
fontSize: 15,
}}
>
点击开始 AI 美学分析
</div>
</div>
)}

{/* Preview */}
{image && (
<>
<div
style={{
borderRadius: 28,
overflow: "hidden",
marginBottom: 20,
boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
background: "#fff",
}}
>
<img
src={image}
alt="preview"
style={{
width: "100%",
maxHeight: 520,
objectFit: "cover",
}}
/>
</div>

{!result && (
<button
onClick={analyzeImage}
disabled={loading}
style={{
width: "100%",
padding: 18,
border: "none",
borderRadius: 18,
background: COLORS.mauve,
color: "#fff",
fontSize: 18,
cursor: "pointer",
marginBottom: 30,
}}
>
{loading ? "AI分析中..." : "开始AI美学分析"}
</button>
)}
</>
)}

{/* Result */}
{result && (
<div
style={{
background: COLORS.warmWhite,
borderRadius: 28,
padding: 30,
marginBottom: 40,
}}
>
<h2
style={{
marginBottom: 30,
color: COLORS.textDeep,
fontWeight: "normal",
textAlign: "center",
}}
>
✨ 美学分析报告
</h2>

{/* Scores */}
<div
style={{
display: "grid",
gridTemplateColumns: "repeat(4,1fr)",
gap: 20,
marginBottom: 40,
}}
>
<ScoreRing score={result.color || 85} label="色彩" />
<ScoreRing score={result.material || 82} label="材质" />
<ScoreRing score={result.detail || 90} label="细节" />
<ScoreRing score={result.style || 88} label="风格" />
</div>

{/* Summary */}
<div
style={{
lineHeight: 2,
color: COLORS.textMid,
fontSize: 16,
marginBottom: 30,
}}
>
{result.summary}
</div>

{/* Buttons */}
<div
style={{
display: "flex",
gap: 12,
flexWrap: "wrap",
}}
>
<button
onClick={resetAll}
style={{
flex: 1,
minWidth: 200,
padding: 16,
border: "none",
borderRadius: 16,
background: COLORS.dustyRose,
color: "#fff",
fontSize: 16,
cursor: "pointer",
}}
>
重新分析另一张图片
</button>

<button
onClick={() => {
navigator.share?.({
title: "Lace Analyzer",
text: result.summary,
});
}}
style={{
flex: 1,
minWidth: 200,
padding: 16,
border: "none",
borderRadius: 16,
background: COLORS.mauve,
color: "#fff",
fontSize: 16,
cursor: "pointer",
}}
>
分享分析结果
</button>
</div>
</div>
)}
</div>
</div>
);
}
