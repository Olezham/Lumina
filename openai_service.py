import os
import openai

def get_answer(topic_title: str, materials: list, question: str) -> str:
    """
    Отправляет вопрос в OpenAI с контекстом из материалов.
    Если API ключ не задан — возвращает демо-ответ.
    """
    api_key = os.getenv("OPENAI_API_KEY", "")

    if not api_key:
        return (
            f"⚠️ OpenAI API ключ не настроен. "
            f"Задайте переменную окружения OPENAI_API_KEY.\n\n"
            f"Вопрос получен: «{question}»\n"
            f"Материалов в теме: {len(materials)} шт."
        )

    combined = "\n\n---\n\n".join(
        f"[{m.title}]\n{m.content}" for m in materials
    )

    prompt = (
        f"Ты — учебный ассистент. Тебе предоставлены учебные материалы по теме «{topic_title}».\n"
        f"Отвечай ТОЛЬКО на основе этих материалов. "
        f"Если ответа нет, скажи: «В предоставленных материалах нет точной информации по этому вопросу.»\n\n"
        f"=== УЧЕБНЫЕ МАТЕРИАЛЫ ===\n{combined}\n"
        f"=== КОНЕЦ МАТЕРИАЛОВ ===\n\n"
        f"Вопрос: {question}"
    )

    client = openai.OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1000,
    )
    return response.choices[0].message.content
