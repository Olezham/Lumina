import os
import openai


def get_answer(topic_title: str, materials: list, question: str) -> str:
    api_key = os.getenv("OPENAI_API_KEY", "")

    if not api_key:
        return (
            f"OpenAI API key is missing.\n"
            f"Question: {question}\n"
            f"Materials available: {len(materials)}"
        )

    combined = "\n\n---\n\n".join(f"[{m.title}]\n{m.content}" for m in materials)
    prompt = (
        f"You are a learning assistant. Use only provided materials for topic '{topic_title}'.\n"
        f"If answer is missing, say that information is not present.\n\n"
        f"MATERIALS:\n{combined}\n\n"
        f"QUESTION: {question}"
    )

    client = openai.OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1000,
    )
    return response.choices[0].message.content
