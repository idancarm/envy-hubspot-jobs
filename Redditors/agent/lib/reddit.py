import praw
import os

class RedditClient:
    def __init__(self, credentials):
        """
        credentials: dict with client_id, client_secret, username, password, user_agent
        """
        self.reddit = praw.Reddit(
            client_id=credentials['client_id'],
            client_secret=credentials['client_secret'],
            username=credentials['username'],
            password=credentials['password'],
            user_agent=credentials['user_agent']
        )
        self.username = credentials['username']

    def check_credentials(self):
        try:
            return self.reddit.user.me()
        except Exception:
            return None

    def scan_subreddit(self, subreddit_name, limit=10):
        """Yields recent posts from a subreddit."""
        subreddit = self.reddit.subreddit(subreddit_name)
        # Scan new and rising
        for submission in subreddit.new(limit=limit):
            yield {
                'id': submission.id,
                'title': submission.title,
                'body': submission.selftext,
                'url': submission.url,
                'author': str(submission.author),
                'subreddit': subreddit_name,
                'created_utc': submission.created_utc,
                'permalink': submission.permalink
            }

    def reply_to_post(self, post_id, content):
        submission = self.reddit.submission(id=post_id)
        return submission.reply(content)
