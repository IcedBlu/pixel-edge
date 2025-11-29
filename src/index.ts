import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

// 定义类型，让 TypeScript 识别 Cloudflare 的环境变量
type Bindings = {
  AI: Ai
}

const app = new Hono<{ Bindings: Bindings }>()

// 1. 简单的前端页面
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>PixelEdge AI</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-900 text-white flex flex-col items-center justify-center min-h-screen p-4">
      <div class="max-w-lg w-full bg-gray-800 p-6 rounded-xl shadow-2xl">
        <h1 class="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">PixelEdge AI</h1>
        <p class="text-gray-400 mb-6">Running on Cloudflare Workers AI (Stable Diffusion)</p>
        
        <textarea id="prompt" class="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-purple-500" rows="3" placeholder="描述你想生成的画面，例如：Cyberpunk cat sitting on a neon roof..."></textarea>
        
        <button id="generateBtn" onclick="generate()" class="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors">
          生成图片
        </button>

        <div id="result" class="mt-6 flex justify-center">
          <!-- 图片将显示在这里 -->
        </div>
        <p id="loading" class="hidden mt-4 text-center text-purple-400 animate-pulse">正在边缘节点渲染中...</p>
      </div>

      <script>
        async function generate() {
          const prompt = document.getElementById('prompt').value;
          if (!prompt) return alert('请输入提示词');

          const btn = document.getElementById('generateBtn');
          const loading = document.getElementById('loading');
          const result = document.getElementById('result');
          
          btn.disabled = true;
          btn.classList.add('opacity-50');
          loading.classList.remove('hidden');
          result.innerHTML = '';

          try {
            // 请求后端 API
            const response = await fetch('/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt })
            });

            if (!response.ok) throw new Error('生成失败');

            const blob = await response.blob();
            const imgUrl = URL.createObjectURL(blob);
            const img = document.createElement('img');
            img.src = imgUrl;
            img.className = "rounded-lg shadow-lg border border-gray-600";
            result.appendChild(img);
          } catch (e) {
            alert(e.message);
          } finally {
            btn.disabled = false;
            btn.classList.remove('opacity-50');
            loading.classList.add('hidden');
          }
        }
      </script>
    </body>
    </html>
  `)
})

// 2. AI 生成 API
app.post('/generate', async (c) => {
  const body = await c.req.json();
  const prompt = body.prompt || 'A beautiful landscape';

  try {
    // 调用 Cloudflare Workers AI 模型
    // 模型列表参考：https://developers.cloudflare.com/workers-ai/models/
    const response = await c.env.AI.run(
      '@cf/stabilityai/stable-diffusion-xl-base-1.0', 
      {
        prompt: prompt
      }
    );

    // 直接返回图片二进制流
    return new Response(response, {
      headers: {
        'content-type': 'image/png',
      },
    });

  } catch (e) {
    return c.json({ error: 'AI 生成失败: ' + e.message }, 500);
  }
})

export default app
