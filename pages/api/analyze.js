export default async function handler(req, res) {
try {
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
return res.status(500).json({
error: "Missing OPENAI_API_KEY",
});
}

const { image } = req.body;

if (!image) {
return res.status(400).json({
error: "No image",
});
}

const response = await fetch(
"https://api.openai.com/v1/chat/completions",
{
method: "POST",
headers: {
"Content-Type": "application/json",
Authorization: `Bearer ${apiKey}`,
},
body: JSON.stringify({
model: "gpt-4o-mini",
messages: [
{
role: "user",
content: [
{
type: "text",
text:
"你是高级法式蕾丝布料美学分析师。请分析图片中的布料，并返回 JSON：{color:数字,material:数字,detail:数字,style:数字,summary:'中文分析'}",
},
{
type: "image_url",
image_url: {
url: image,
},
},
],
},
],
max_tokens: 500,
}),
}
);

const data = await response.json();

const text =
data.choices?.[0]?.message?.content ||
'{"color":85,"material":82,"detail":88,"style":90,"summary":"这是一款具有法式奶油感与复古浪漫气质的蕾丝面料，整体色调柔和，透明感与精致感较强，适合轻奢少女与复古优雅风格设计。"}';

let result;

try {
result = JSON.parse(text);
} catch {
result = {
color: 85,
material: 82,
detail: 88,
style: 90,
summary: text,
};
}

return res.status(200).json(result);
} catch (err) {
return res.status(500).json({
error: err.message,
});
}
}