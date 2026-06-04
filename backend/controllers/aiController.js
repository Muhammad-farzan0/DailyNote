import axios from 'axios';

export const generateDescription = async (req, res, next) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  try {
    const model = 'gpt2';
    const url = `https://api-inference.huggingface.co/models/${model}`;
    const response = await axios.post(
      url,
      { inputs: prompt },
      { headers: { Authorization: `Bearer ${process.env.HF_API_TOKEN}` } }
    );
    let generatedText = response.data[0]?.generated_text || '';
    if (generatedText.startsWith(prompt)) {
      generatedText = generatedText.slice(prompt.length).trim();
    }
    res.json({ text: generatedText });
  } catch (err) {
    console.error('Hugging Face error:', err.response?.data || err.message);
    // Fallback response – does not crash
    res.json({
      text: `✨ AI generated (fallback): "${prompt}"\n\n(The AI service is temporarily unavailable. Please try again later.)`
    });
  }
};

export const suggestDeadline = async (req, res, next) => {
  try {
    const { title } = req.body;
    let days = title?.toLowerCase().includes('urgent') ? 1 : 3;
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + days);
    res.json({ suggestedDueDate: deadline });
  } catch (err) {
    next(err);
  }
};