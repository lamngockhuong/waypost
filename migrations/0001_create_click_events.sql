CREATE TABLE click_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  domain TEXT NOT NULL,
  redirect_id TEXT NOT NULL,
  source_path TEXT NOT NULL,
  target_url TEXT NOT NULL,
  country TEXT,
  device TEXT,
  referrer TEXT,
  user_agent TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_click_domain_time ON click_events(domain, timestamp);
CREATE INDEX idx_click_redirect ON click_events(redirect_id, timestamp);
