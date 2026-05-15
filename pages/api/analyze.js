export default async function handler(req, res) {
try {
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
return res.status(500).json({
error: "Missing GEMINI_API_KEY",
});
}

const { image } = req.body;

if (!image) {
return res.status(400).json({
error: "No image",
});
}

const base64Data = image.split(",")[1];

const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
contents: [
{
role: "user",
parts: [
{
text: `
请分析这张蕾丝、布料或发圈图片。

必须只返回 JSON：

{
"color": 数字,
"material": 数字,
"detail": 数字,
"style": 数字,
"summary": "中文分析"
}
`,
},
{
inlineData: {
mimeType: "image/jpeg",
data: base64Data,
},
},
],
},
],

generationConfig: {
temperature: 0.4,
topK: 32,
topP: 1,
maxOutputTokens: 500,
},
}),
}
);

const data = await response.json();

console.log("Gemini full:", JSON.stringify(data));

const text =
data?.candidates?.[0]?.content?.parts?.[0]?.text;

if (!text) {
return res.status(500).json({
error: "Gemini返回为空",
raw: data,
});
}

const match = text.match(/\{[\s\S]*\}/);

if (!match) {
return res.status(500).json({
error: "JSON提取失败",
raw: text,
});
}

const result = JSON.parse(match[0]);

return res.status(200).json(result);
} catch (err) {
return res.status(500).json({
error: err.message,
});
}
}