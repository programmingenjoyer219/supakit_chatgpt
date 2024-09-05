import { PUBLIC_GEMINI_API_KEY } from "$env/static/public";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from '$lib/supabaseClient';

const genAI = new GoogleGenerativeAI(PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel(
  {
    model: "gemini-1.5-flash",
    generationConfig: {
      candidateCount: 1,
      maxOutputTokens: 500,
      temperature: 1.0,
    },
  }
);

export async function getResponseToPrompt(prompt, chat_id) {
  try {
    const history = await getChatHistory(chat_id);
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(prompt);
    const response = result.response.text();
    await addResponseToDB(response, chat_id);
  } catch (error) {
    throw new Error("Error generating response: " + error);
  }
}

async function getChatHistory(chat_id) {
  try {
    let { data, error } = await supabase
      .from('messages')
      .select('role, content')
      .eq('chat_id', chat_id)
      .order('created_at', { ascending: true });

    if (error) throw new Error("Error fetching chat history: " + error);

    const history = data.map(m => {
      return { role: m.role, parts: [{ text: m.content }] };
    });
    history.pop();
    return history;
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function addResponseToDB(response, chat_id) {
  try {
    const { error } = await supabase
      .from('messages')
      .insert([
        { chat_id, content: response, role: "model" },
      ]);
    if (error) throw new Error("Error adding response to supabase: " + error);
  } catch (err) {
    throw new Error("Error adding response to supabase: " + err);
  }
}