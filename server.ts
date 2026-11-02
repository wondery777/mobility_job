import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side initialization of Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// AI Job Summarization Endpoint
app.post('/api/summarize-job', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: '공고 원문 텍스트를 입력해주세요.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: '서버에 GEMINI_API_KEY가 설정되어 있지 않습니다. Settings > Secrets 패널을 확인해주세요.',
      });
    }

    const prompt = `당신은 대한민국 최고 수준의 미래 모빌리티 채용 전문 AI 어드바이저입니다.
제공된 모빌리티 분야 채용 공고 원문 텍스트를 분석하여 아래 요구되는 JSON 형식으로만 응답해주세요.

[분석 및 요약 규칙]
1. summary: 지원자가 수행할 핵심 직무 역할과 비전을 3줄 이내로 명확하고 간결하게 요약하세요.
2. required: 필수 지원 요건/자격 사항을 항목별 배열로 추출하세요.
3. preferred: 우대 사항/가산점 요소를 항목별 배열로 추출하세요.
4. skills: 본문에서 언급된 프로그래밍 언어, 툴, 프레임워크, 도메인 기술 키워드(예: C++, ROS, Python, Linux, CAN, BMS, MATLAB, Docker 등)를 정제된 문자열 배열로 추출하세요.
5. certificates: 관련 언급된 자격증(예: 정보처리기사, 전기기사, 운전면허 등) 목록을 배열로 추출하세요.
6. majors: 본문에서 요구하거나 우대하는 대학 전공(예: 기계공학과, 자동차공학과, 컴퓨터공학과, 전자공학과, 소프트웨어학과, 화학공학과, 항공우주공학과 등) 목록을 정제된 문자열 배열로 추출하세요.
7. deadline: 서류 접수 마감일을 추출하세요. (가능한 경우 YYYY-MM-DD 형식)
8. level: 경력 조건(예: '신입', '경력 3년+', '신입·경력', '경력 무관')을 추출하세요.
9. [필수 엄수] 본문에 없는 내용은 '정보 없음'으로 적고 추측하지 마.

채용 공고 원문:
${text.trim()}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: "모빌리티 채용 공고를 분석하여 정확한 JSON 객체로만 응답합니다. 본문에 없는 내용은 '정보 없음'으로 적고 추측하지 마.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: '3줄 이내의 핵심 직무 요약',
            },
            required: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '필수 조건 목록',
            },
            preferred: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '우대 사항 목록',
            },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '요구 기술 스택 키워드 목록',
            },
            certificates: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '관련 자격증 목록',
            },
            majors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '관련 또는 우대 대학 전공 목록',
            },
            deadline: {
              type: Type.STRING,
              description: '공고 마감일 (YYYY-MM-DD 또는 정보 없음)',
            },
            level: {
              type: Type.STRING,
              description: '경력 요건',
            },
          },
          required: ['summary', 'required', 'preferred', 'skills', 'certificates', 'majors', 'deadline', 'level'],
        },
      },
    });

    const rawText = response.text;
    if (!rawText) {
      return res.status(500).json({ error: 'AI 응답이 비어 있습니다.' });
    }

    try {
      const cleanedText = rawText
        .trim()
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();
      const parsed = JSON.parse(cleanedText);
      return res.json(parsed);
    } catch (parseErr) {
      console.error('Failed to parse Gemini response as JSON:', rawText);
      return res.status(500).json({
        error: 'Gemini 모델 응답을 JSON으로 파싱하는데 실패했습니다.',
        raw: rawText,
      });
    }
  } catch (error: any) {
    console.error('Error in /api/summarize-job:', error);
    return res.status(500).json({
      error: error?.message || 'Gemini API 분석 중 서버 오류가 발생했습니다.',
    });
  }
});

// Vite middleware for dev or static serving for production
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: {
      middlewareMode: true,
      port,
      host: '0.0.0.0',
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`[MobilityJob] Server listening on port ${port} (mode: ${isProduction ? 'production' : 'development'})`);
});
