import os
import json
from openai import OpenAI

class Brain:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def decide(self, persona, post_context):
        """
        Ask the LLM if we should reply to this post, and if so, what to say.
        Expects a JSON response.
        """
        system_prompt = f"""
        You are a Reddit user with the following persona:
        {persona.get('system_prompt')}
        
        Your configuration: {json.dumps(persona.get('config', {}))}

        Analyze the following Reddit post/comment and decide if you should reply.
        Return ONLY a JSON object with this format:
        {{
            "should_reply": boolean,
            "reason": "string explaining why",
            "reply_content": "string (the comment to post) or null"
        }}
        """

        user_content = f"""
        Subreddit: r/{post_context.get('subreddit')}
        Title: {post_context.get('title')}
        Body: {post_context.get('body')}
        Author: {post_context.get('author')}
        """

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o", # Or gpt-3.5-turbo
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content}
                ],
                response_format={"type": "json_object"}
            )
            content = response.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            print(f"Brain Error: {e}")
            return {"should_reply": False, "reason": "Error"}
