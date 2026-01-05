import os
import sys
import json
import time # For slight delays/rate limiting safety
from dotenv import load_dotenv
from lib.db import Database
from lib.reddit import RedditClient
from lib.brain import Brain

# Load environment variables
load_dotenv()

def main():
    print("Redditor Agent Starting...")
    
    # 1. Initialize Infrastructure
    try:
        db = Database()
        brain = Brain()
    except Exception as e:
        print(f"Initialization Failed: {e}")
        sys.exit(1)

    # 2. Fetch Accounts
    accounts = db.get_active_accounts()
    print(f"Found {len(accounts)} active accounts.")

    # 3. Process Each Account
    for account in accounts:
        print(f"Processing Account: {account['username']}")
        
        # In a real scenario, credentials should be securely retrieved.
        # For this PoC, we expect them in an env var specific to the user or passed via constraints.
        # But wait, the GitHub Action has REDDIT_ACCOUNTS_JSON.
        # Let's try to parse that to find credentials for this username.
        
        creds_map = {}
        try:
            creds_json = os.getenv("REDDIT_ACCOUNTS_JSON", "{}")
            creds_map = json.loads(creds_json)
        except:
            print("Failed to parse REDDIT_ACCOUNTS_JSON")

        user_creds = creds_map.get(account['username'])
        if not user_creds:
            print(f"No credentials found for {account['username']}, skipping.")
            continue

        reddit_client = RedditClient(user_creds)
        if not reddit_client.check_credentials():
             print(f"Invalid credentials for {account['username']}, skipping.")
             continue

        # Get Persona
        persona = db.get_persona(account['current_persona_id'])
        if not persona:
            print("No persona assigned.")
            continue

        # Get Targets
        targets = db.get_targets(account['id'])
        
        for target in targets:
            print(f"Scanning r/{target['subreddit']}...")
            posts = reddit_client.scan_subreddit(target['subreddit'], limit=5)
            
            for post in posts:
                # Check history
                if db.has_interacted(account['id'], post['id']):
                    continue

                # Decide
                print(f"Analyzing post: {post['title']}")
                decision = brain.decide(persona, post)
                
                if decision.get('should_reply'):
                    print(f"Decided to reply! Reason: {decision.get('reason')}")
                    content = decision.get('reply_content')
                    if content:
                        # Post to Reddit
                        try:
                            reply = reddit_client.reply_to_post(post['id'], content)
                            # Log
                            db.log_interaction(
                                account_id=account['id'],
                                action_type='comment',
                                reddit_id=post['id'],
                                content=content,
                                permalink=reply.permalink
                            )
                            print("Reply posted successfully.")
                        except Exception as e:
                            print(f"Failed to reply: {e}")
                else:
                    print(f"Skipping. Reason: {decision.get('reason')}")
                
            time.sleep(2) # Be nice to API

    print("Agent run complete.")

if __name__ == "__main__":
    main()
