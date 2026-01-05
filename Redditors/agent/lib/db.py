from supabase import create_client, Client
import os

class Database:
    def __init__(self):
        url = os.environ.get("SUPABASE_URL")
        key = os.environ.get("SUPABASE_KEY")
        if not url or not key:
            raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY")
        self.supabase: Client = create_client(url, key)

    def get_active_accounts(self):
        response = self.supabase.table('accounts').select("*").eq('is_active', True).execute()
        return response.data

    def get_persona(self, persona_id):
        response = self.supabase.table('personas').select("*").eq('id', persona_id).execute()
        return response.data[0] if response.data else None

    def get_targets(self, account_id):
        response = self.supabase.table('targets').select("*").eq('account_id', account_id).execute()
        return response.data

    def has_interacted(self, account_id, reddit_id):
        response = self.supabase.table('history').select("id").eq('account_id', account_id).eq('reddit_id', reddit_id).execute()
        return len(response.data) > 0

    def log_interaction(self, account_id, action_type, reddit_id, content, permalink):
        data = {
            "account_id": account_id,
            "action_type": action_type,
            "reddit_id": reddit_id,
            "content": content,
            "permalink": permalink
        }
        self.supabase.table('history').insert(data).execute()
