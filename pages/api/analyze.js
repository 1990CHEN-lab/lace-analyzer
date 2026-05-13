export default async function handler(req, res) {
try {
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
return res.status(500).json({
error: "Missing OPENAI_API_KEY",
});
}

const { image } = req.body;

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
response_format: {
type: "json_object",
},
messages: [
{
role: "system",
content:
"你是高级法式蕾丝布料美学分析师。必须返回JSON。",
},
{
role: "user",
content: [
{
type: "text",
text:
"分析这张蕾丝/布料图片，返回JSON格式：{color:0-100,material:0-100,detail:0-100,style:0-100,summary:'中文详细分析'}",
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

console.log(data);

const content = data.choices?.[0]?.message?.content;

if (!content) {
return res.status(500).json({
error: "OpenAI 返回为空",
});
}

let result;

try {
result = JSON.parse(content);
} catch (e) {
return res.status(500).json({
error: "JSON解析失败",
raw: content,
});
}

return res.status(200).json(result);
} catch (err) {
return res.status(500).json({
error: err.message,
});
}
}