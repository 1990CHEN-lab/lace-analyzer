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
`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
contents: [
{
parts: [
{
text:
"你是高级法式蕾丝布料美学分析师。请分析图片中的蕾丝、布料、发圈或饰品，并返回JSON格式：{color:0-100,material:0-100,detail:0-100,style:0-100,summary:'中文分析'}",
},
{
inline_data: {
mime_type: "image/jpeg",
data: base64Data,
},
},
],
},
],
}),
}
);

const data = await response.json();

const text =
data.candidates?.[0]?.content?.parts?.[0]?.text || ""

const jsonMatch = text.match(/\{[\s\S]*\}/);

if (!jsonMatch) {
return res.status(500).json({
error: "Gemini返回格式错误",
raw: text,
});
}

const result = JSON.parse(jsonMatch[0]);

return res.status(200).json(result);
} catch (err) {
return res.status(500).json({
error: err.message,
});
}
}
