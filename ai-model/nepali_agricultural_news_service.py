#!/usr/bin/env python3
"""
Nepali Agricultural News Service
Automatically fetches, categorizes, and stores agricultural news from Nepali websites
"""

import os
import sys
import json
import uuid
import logging
import requests
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from urllib.parse import urljoin, urlparse
import time
import re

# Web scraping
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# Database
import psycopg2
from psycopg2.extras import RealDictCursor
from sqlalchemy import create_engine, text

# AI/ML
from transformers import pipeline
import torch

# Scheduling
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger

# Date handling
from dateutil import parser as date_parser
import pytz

# Environment variables
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('agricultural_news.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# =============================================================================
# CONFIGURATION SECTION
# =============================================================================

# Database Configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', 5432)),
    'database': os.getenv('DB_NAME', 'agricultural_news_db'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'your_password')
}

# Target Nepali Agricultural News Websites
TARGET_URLS = [
    {
        'name': 'Nepal Agricultural Research Council',
        'url': 'https://narc.gov.np/news',
        'type': 'government'
    },
    {
        'name': 'Krishi Daily',
        'url': 'https://krishidaily.com',
        'type': 'news'
    },
    {
        'name': 'Nepal Agricultural Market',
        'url': 'https://nam.gov.np/news',
        'type': 'market'
    },
    {
        'name': 'Ministry of Agriculture',
        'url': 'https://moald.gov.np/news',
        'type': 'government'
    }
]

# AI Model Configuration
CATEGORIES = [
    'crop_pests',
    'market_prices',
    'weather_advisory',
    'policy_update',
    'technology_innovation',
    'fertilizer_seeds',
    'irrigation_water',
    'livestock_dairy',
    'organic_farming',
    'uncategorized'
]

# Scheduling Configuration
SCHEDULE_TIME = "06:00"  # Run daily at 6 AM
TIMEZONE = "Asia/Kathmandu"

# =============================================================================
# DATABASE SETUP
# =============================================================================

def setup_database():
    """Create database tables if they don't exist"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()

        # Create news table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS news (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                title VARCHAR(500) NOT NULL,
                content TEXT,
                image_url VARCHAR(1000),
                source VARCHAR(100) NOT NULL,
                publish_date TIMESTAMP,
                category VARCHAR(50) DEFAULT 'uncategorized',
                url VARCHAR(1000) UNIQUE NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        """)

        # Create news_category table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS news_category (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                title VARCHAR(500) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        """)

        # Create index for better performance
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_news_url ON news(url);
            CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
            CREATE INDEX IF NOT EXISTS idx_news_publish_date ON news(publish_date);
        """)

        conn.commit()
        cursor.close()
        conn.close()
        logger.info("✅ Database tables created successfully!")

    except Exception as e:
        logger.error(f"❌ Database setup failed: {e}")
        raise

# =============================================================================
# WEB SCRAPING PIPELINE
# =============================================================================

def create_session():
    """Create a requests session with retry strategy"""
    session = requests.Session()

    # Configure retry strategy
    retry_strategy = Retry(
        total=3,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
    )

    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)

    # Set headers to mimic browser
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })

    return session

def extract_date_from_text(text: str) -> Optional[datetime]:
    """Extract date from text using various patterns"""
    if not text:
        return None

    # Common Nepali date patterns
    date_patterns = [
        r'(\d{4}-\d{2}-\d{2})',  # YYYY-MM-DD
        r'(\d{2}/\d{2}/\d{4})',  # MM/DD/YYYY
        r'(\d{2}-\d{2}-\d{4})',  # DD-MM-YYYY
        r'(\d{1,2}\s+(?:Baisakh|Jestha|Asar|Shrawan|Bhadra|Ashoj|Kartik|Mangsir|Poush|Magh|Falgun|Chaitra)\s+\d{4})',  # Nepali months
    ]

    for pattern in date_patterns:
        match = re.search(pattern, text)
        if match:
            try:
                date_str = match.group(1)
                return date_parser.parse(date_str)
            except:
                continue

    return None

def scrape_narc_news(session, base_url: str) -> List[Dict]:
    """Scrape news from Nepal Agricultural Research Council"""
    articles = []
    try:
        response = session.get(base_url, timeout=30)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        # Find news articles (adjust selectors based on actual site structure)
        news_items = soup.find_all('div', class_='news-item') or soup.find_all('article') or soup.find_all('div', class_='post')

        for item in news_items[:10]:  # Limit to 10 articles
            try:
                # Extract title
                title_elem = item.find('h2') or item.find('h3') or item.find('a')
                title = title_elem.get_text(strip=True) if title_elem else "No title"

                # Extract URL
                link_elem = item.find('a')
                url = urljoin(base_url, link_elem['href']) if link_elem and link_elem.get('href') else None

                if not url:
                    continue

                # Extract content
                content_elem = item.find('p') or item.find('div', class_='excerpt')
                content = content_elem.get_text(strip=True) if content_elem else ""

                # Extract image
                img_elem = item.find('img')
                image_url = urljoin(base_url, img_elem['src']) if img_elem and img_elem.get('src') else None

                # Extract date
                date_elem = item.find('time') or item.find('span', class_='date')
                publish_date = None
                if date_elem:
                    publish_date = extract_date_from_text(date_elem.get_text())

                if not publish_date:
                    publish_date = datetime.now()

                articles.append({
                    'title': title,
                    'content': content,
                    'image_url': image_url,
                    'source': 'Nepal Agricultural Research Council',
                    'publish_date': publish_date,
                    'url': url
                })

            except Exception as e:
                logger.warning(f"Error parsing article: {e}")
                continue

    except Exception as e:
        logger.error(f"Error scraping NARC: {e}")

    return articles

def scrape_generic_news(session, site_config: Dict) -> List[Dict]:
    """Generic scraper for news sites"""
    articles = []
    try:
        response = session.get(site_config['url'], timeout=30)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        # Generic selectors for news sites
        selectors = [
            'article', '.post', '.news-item', '.entry', '.story',
            'div[class*="news"]', 'div[class*="article"]', 'div[class*="post"]'
        ]

        news_items = []
        for selector in selectors:
            news_items = soup.select(selector)
            if news_items:
                break

        for item in news_items[:10]:
            try:
                # Extract title
                title_selectors = ['h1', 'h2', 'h3', '.title', '.headline']
                title = "No title"
                for selector in title_selectors:
                    title_elem = item.select_one(selector)
                    if title_elem:
                        title = title_elem.get_text(strip=True)
                        break

                # Extract URL
                link_elem = item.find('a')
                url = urljoin(site_config['url'], link_elem['href']) if link_elem and link_elem.get('href') else None

                if not url:
                    continue

                # Extract content
                content_selectors = ['p', '.excerpt', '.summary', '.content']
                content = ""
                for selector in content_selectors:
                    content_elem = item.select_one(selector)
                    if content_elem:
                        content = content_elem.get_text(strip=True)
                        break

                # Extract image
                img_elem = item.find('img')
                image_url = urljoin(site_config['url'], img_elem['src']) if img_elem and img_elem.get('src') else None

                # Extract date
                date_selectors = ['time', '.date', '.published', '.timestamp']
                publish_date = datetime.now()
                for selector in date_selectors:
                    date_elem = item.select_one(selector)
                    if date_elem:
                        extracted_date = extract_date_from_text(date_elem.get_text())
                        if extracted_date:
                            publish_date = extracted_date
                            break

                articles.append({
                    'title': title,
                    'content': content,
                    'image_url': image_url,
                    'source': site_config['name'],
                    'publish_date': publish_date,
                    'url': url
                })

            except Exception as e:
                logger.warning(f"Error parsing article from {site_config['name']}: {e}")
                continue

    except Exception as e:
        logger.error(f"Error scraping {site_config['name']}: {e}")

    return articles

def scrape_all_sites() -> List[Dict]:
    """Scrape all configured news sites"""
    session = create_session()
    all_articles = []

    for site_config in TARGET_URLS:
        logger.info(f"Scraping {site_config['name']}...")

        if site_config['name'] == 'Nepal Agricultural Research Council':
            articles = scrape_narc_news(session, site_config['url'])
        else:
            articles = scrape_generic_news(session, site_config)

        all_articles.extend(articles)
        logger.info(f"Found {len(articles)} articles from {site_config['name']}")

        # Be respectful - add delay between requests
        time.sleep(2)

    logger.info(f"Total articles scraped: {len(all_articles)}")
    return all_articles

# =============================================================================
# AI-DRIVEN CATEGORIZATION
# =============================================================================

class NewsCategorizer:
    def __init__(self):
        """Initialize the news categorizer with a pre-trained model"""
        try:
            # Use a lightweight model for text classification
            self.classifier = pipeline(
                "text-classification",
                model="facebook/bart-large-mnli",  # Zero-shot classification model
                device=0 if torch.cuda.is_available() else -1
            )
            logger.info("✅ AI categorizer initialized successfully!")
        except Exception as e:
            logger.error(f"❌ Failed to initialize AI categorizer: {e}")
            self.classifier = None

    def categorize_article(self, title: str, content: str) -> str:
        """Categorize an article based on its title and content"""
        if not self.classifier:
            return "uncategorized"

        try:
            # Combine title and content for classification
            text = f"{title} {content}"[:1000]  # Limit text length

            # Define category descriptions for zero-shot classification
            category_descriptions = {
                'crop_pests': 'Information about crop diseases, pests, and plant health issues',
                'market_prices': 'Agricultural market prices, commodity prices, and market trends',
                'weather_advisory': 'Weather forecasts, climate information, and weather-related agricultural advice',
                'policy_update': 'Government policies, regulations, and agricultural policy changes',
                'technology_innovation': 'New agricultural technologies, innovations, and farming methods',
                'fertilizer_seeds': 'Information about fertilizers, seeds, and agricultural inputs',
                'irrigation_water': 'Irrigation systems, water management, and water-related agricultural topics',
                'livestock_dairy': 'Livestock farming, dairy production, and animal husbandry',
                'organic_farming': 'Organic farming practices, sustainable agriculture, and eco-friendly farming'
            }

            # Perform zero-shot classification
            candidate_labels = list(category_descriptions.values())
            result = self.classifier(text, candidate_labels)

            # Get the best matching category
            best_score = result['scores'][0]
            best_label = result['labels'][0]

            # Map back to category name
            for category, description in category_descriptions.items():
                if description == best_label:
                    # Only assign category if confidence is high enough
                    if best_score > 0.3:
                        return category
                    else:
                        return "uncategorized"

            return "uncategorized"

        except Exception as e:
            logger.error(f"Error categorizing article: {e}")
            return "uncategorized"

# =============================================================================
# DATABASE OPERATIONS
# =============================================================================

def upsert_article(conn, article: Dict, category: str) -> bool:
    """Insert or update article in database"""
    try:
        cursor = conn.cursor()

        # Check if article already exists
        cursor.execute("SELECT id FROM news WHERE url = %s", (article['url'],))
        existing = cursor.fetchone()

        if existing:
            # Update existing article
            cursor.execute("""
                UPDATE news SET
                    title = %s,
                    content = %s,
                    image_url = %s,
                    source = %s,
                    publish_date = %s,
                    category = %s,
                    is_active = TRUE,
                    updated_at = NOW()
                WHERE url = %s
            """, (
                article['title'],
                article['content'],
                article['image_url'],
                article['source'],
                article['publish_date'],
                category,
                article['url']
            ))
            logger.info(f"Updated article: {article['title']}")
            return False  # Not a new article
        else:
            # Insert new article
            cursor.execute("""
                INSERT INTO news (id, title, content, image_url, source, publish_date, category, url, is_active)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, TRUE)
            """, (
                str(uuid.uuid4()),
                article['title'],
                article['content'],
                article['image_url'],
                article['source'],
                article['publish_date'],
                category,
                article['url']
            ))
            logger.info(f"Inserted new article: {article['title']}")
            return True  # New article

    except Exception as e:
        logger.error(f"Error upserting article: {e}")
        return False

def deactivate_old_articles(conn):
    """Deactivate articles older than 7 days"""
    try:
        cursor = conn.cursor()
        cutoff_date = datetime.now() - timedelta(days=7)

        cursor.execute("""
            UPDATE news SET is_active = FALSE, updated_at = NOW()
            WHERE publish_date < %s AND is_active = TRUE
        """, (cutoff_date,))

        deactivated_count = cursor.rowcount
        logger.info(f"Deactivated {deactivated_count} old articles")

    except Exception as e:
        logger.error(f"Error deactivating old articles: {e}")

def get_summary_stats(conn) -> Dict:
    """Get summary statistics for the current run"""
    try:
        cursor = conn.cursor()

        # Count articles by category
        cursor.execute("""
            SELECT category, COUNT(*) as count
            FROM news
            WHERE is_active = TRUE
            GROUP BY category
            ORDER BY count DESC
        """)

        category_stats = dict(cursor.fetchall())

        # Total active articles
        cursor.execute("SELECT COUNT(*) FROM news WHERE is_active = TRUE")
        total_active = cursor.fetchone()[0]

        # Articles from today
        today = datetime.now().date()
        cursor.execute("""
            SELECT COUNT(*) FROM news
            WHERE DATE(publish_date) = %s
        """, (today,))
        today_count = cursor.fetchone()[0]

        return {
            'total_active': total_active,
            'today_count': today_count,
            'category_stats': category_stats
        }

    except Exception as e:
        logger.error(f"Error getting summary stats: {e}")
        return {}

# =============================================================================
# MAIN PIPELINE
# =============================================================================

def run_news_pipeline():
    """Main pipeline: scrape, categorize, and store news"""
    logger.info("🚀 Starting agricultural news pipeline...")

    start_time = datetime.now()
    stats = {
        'new_articles': 0,
        'updated_articles': 0,
        'errors': 0
    }

    try:
        # Setup database
        setup_database()

        # Initialize AI categorizer
        categorizer = NewsCategorizer()

        # Scrape articles
        articles = scrape_all_sites()

        if not articles:
            logger.warning("No articles found!")
            return

        # Connect to database
        conn = psycopg2.connect(**DB_CONFIG)

        # Process each article
        for article in articles:
            try:
                # Categorize article
                category = categorizer.categorize_article(article['title'], article['content'])

                # Store in database
                is_new = upsert_article(conn, article, category)

                if is_new:
                    stats['new_articles'] += 1
                else:
                    stats['updated_articles'] += 1

            except Exception as e:
                logger.error(f"Error processing article: {e}")
                stats['errors'] += 1

        # Deactivate old articles
        deactivate_old_articles(conn)

        # Get summary statistics
        summary_stats = get_summary_stats(conn)

        # Commit and close
        conn.commit()
        conn.close()

        # Log summary
        end_time = datetime.now()
        duration = end_time - start_time

        logger.info("=" * 50)
        logger.info("📊 PIPELINE SUMMARY")
        logger.info("=" * 50)
        logger.info(f"⏱️ Duration: {duration}")
        logger.info(f"📰 New articles: {stats['new_articles']}")
        logger.info(f"🔄 Updated articles: {stats['updated_articles']}")
        logger.info(f"❌ Errors: {stats['errors']}")
        logger.info(f"📈 Total active articles: {summary_stats.get('total_active', 0)}")
        logger.info(f"📅 Today's articles: {summary_stats.get('today_count', 0)}")
        logger.info("📊 Category distribution:")
        for category, count in summary_stats.get('category_stats', {}).items():
            logger.info(f"   {category}: {count}")
        logger.info("=" * 50)

    except Exception as e:
        logger.error(f"❌ Pipeline failed: {e}")
        stats['errors'] += 1

# =============================================================================
# SCHEDULER
# =============================================================================

def setup_scheduler():
    """Setup the scheduler to run the pipeline daily"""
    scheduler = BlockingScheduler(timezone=TIMEZONE)

    # Add the job to run daily at specified time
    scheduler.add_job(
        run_news_pipeline,
        CronTrigger(hour=int(SCHEDULE_TIME.split(':')[0]),
                   minute=int(SCHEDULE_TIME.split(':')[1])),
        id='agricultural_news_pipeline',
        name='Daily Agricultural News Pipeline',
        replace_existing=True
    )

    logger.info(f"✅ Scheduler configured to run daily at {SCHEDULE_TIME} {TIMEZONE}")
    return scheduler

# =============================================================================
# REST API (Optional)
# =============================================================================

from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/api/news', methods=['GET'])
def get_news():
    """Get latest active news articles"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        # Get query parameters
        category = request.args.get('category')
        limit = int(request.args.get('limit', 10))

        # Build query
        query = """
            SELECT id, title, content, image_url, source, publish_date, category, url
            FROM news
            WHERE is_active = TRUE
        """
        params = []

        if category:
            query += " AND category = %s"
            params.append(category)

        query += " ORDER BY publish_date DESC LIMIT %s"
        params.append(limit)

        cursor.execute(query, params)
        articles = cursor.fetchall()

        # Convert to list of dicts
        result = []
        for article in articles:
            result.append({
                'id': str(article['id']),
                'title': article['title'],
                'content': article['content'],
                'image_url': article['image_url'],
                'source': article['source'],
                'publish_date': article['publish_date'].isoformat() if article['publish_date'] else None,
                'category': article['category'],
                'url': article['url']
            })

        cursor.close()
        conn.close()

        return jsonify({
            'success': True,
            'count': len(result),
            'articles': result
        })

    except Exception as e:
        logger.error(f"API error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get available categories with counts"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT category, COUNT(*) as count
            FROM news
            WHERE is_active = TRUE
            GROUP BY category
            ORDER BY count DESC
        """)

        categories = [{'category': row[0], 'count': row[1]} for row in cursor.fetchall()]

        cursor.close()
        conn.close()

        return jsonify({
            'success': True,
            'categories': categories
        })

    except Exception as e:
        logger.error(f"API error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# =============================================================================
# MAIN EXECUTION
# =============================================================================

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description='Nepali Agricultural News Service')
    parser.add_argument('--run-now', action='store_true', help='Run the pipeline immediately')
    parser.add_argument('--start-scheduler', action='store_true', help='Start the scheduler')
    parser.add_argument('--start-api', action='store_true', help='Start the REST API')
    parser.add_argument('--api-port', type=int, default=5000, help='API port (default: 5000)')

    args = parser.parse_args()

    if args.run_now:
        # Run pipeline immediately
        run_news_pipeline()

    elif args.start_scheduler:
        # Start the scheduler
        scheduler = setup_scheduler()
        logger.info("🕐 Starting scheduler...")
        scheduler.start()

    elif args.start_api:
        # Start the REST API
        logger.info(f"🌐 Starting REST API on port {args.api_port}...")
        app.run(host='0.0.0.0', port=args.api_port, debug=False)

    else:
        # Default: run pipeline immediately
        run_news_pipeline()
