const https = require('https');
const fs = require('fs');
const path = require('path');

// Google News RSS feeds for AI topics
const RSS_FEEDS = [
  'https://news.google.com/rss/search?q=artificial+intelligence&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=OpenAI+OR+ChatGPT+OR+Claude+AI&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=machine+learning+business&hl=en-US&gl=US&ceid=US:en',
];

// Fetch RSS feed
function fetchRSS(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

// Parse RSS XML (simple parser without dependencies)
function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const title = (itemXml.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
    const link = (itemXml.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || '';
    const pubDate = (itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1] || '';
    const source = (itemXml.match(/<source[^>]*>([\s\S]*?)<\/source>/) || [])[1] || '';

    // Clean up CDATA and HTML entities
    const cleanTitle = title
      .replace(/<!\[CDATA\[|\]\]>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    items.push({
      title: cleanTitle,
      link: link.replace(/<!\[CDATA\[|\]\]>/g, ''),
      pubDate: new Date(pubDate),
      source: source.replace(/<!\[CDATA\[|\]\]>/g, ''),
    });
  }

  return items;
}

// Calculate relative time
function getRelativeTime(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return '1d ago';
  return `${diffDays}d ago`;
}

// Categorize news based on keywords
function categorizeNews(title) {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('tool') || lowerTitle.includes('app') ||
      lowerTitle.includes('software') || lowerTitle.includes('platform') ||
      lowerTitle.includes('launch') || lowerTitle.includes('release')) {
    return 'tools';
  }
  if (lowerTitle.includes('business') || lowerTitle.includes('company') ||
      lowerTitle.includes('startup') || lowerTitle.includes('investment') ||
      lowerTitle.includes('funding') || lowerTitle.includes('market') ||
      lowerTitle.includes('enterprise') || lowerTitle.includes('revenue')) {
    return 'business';
  }
  return 'news';
}

// Generate tags from title
function generateTags(title) {
  const tagKeywords = {
    '#OpenAI': ['openai', 'chatgpt', 'gpt-4', 'gpt-5', 'sam altman'],
    '#Google': ['google', 'deepmind', 'gemini', 'bard'],
    '#Microsoft': ['microsoft', 'copilot', 'azure'],
    '#Meta': ['meta', 'llama', 'facebook'],
    '#Anthropic': ['anthropic', 'claude'],
    '#AIResearch': ['research', 'study', 'paper', 'breakthrough'],
    '#Business': ['business', 'enterprise', 'company'],
    '#Funding': ['funding', 'investment', 'raises', 'valuation'],
    '#Regulation': ['regulation', 'law', 'policy', 'government'],
  };

  const lowerTitle = title.toLowerCase();
  const tags = [];

  for (const [tag, keywords] of Object.entries(tagKeywords)) {
    if (keywords.some(kw => lowerTitle.includes(kw))) {
      tags.push(tag);
    }
  }

  // Always add #AI tag
  if (tags.length === 0) tags.push('#AI');

  return tags.slice(0, 3); // Max 3 tags
}

// Generate HTML for a single post
function generatePostHTML(item, category) {
  const tags = generateTags(item.title);
  const relativeTime = getRelativeTime(item.pubDate);
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);

  return `                    <article class="feed-post animate-on-scroll" data-category="${category}">
                        <div class="post-header">
                            <span class="post-category">${categoryLabel}</span>
                            <span class="post-time">${relativeTime}</span>
                        </div>
                        <p class="post-content"><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a>${item.source ? ` <span class="post-source">— ${item.source}</span>` : ''}</p>
                        <div class="post-tags">
                            ${tags.map(tag => `<span class="tag">${tag}</span>`).join('\n                            ')}
                        </div>
                    </article>`;
}

// Main function
async function main() {
  console.log('Fetching AI news from Google News RSS...');

  try {
    // Fetch all feeds
    const allItems = [];

    for (const feedUrl of RSS_FEEDS) {
      try {
        const xml = await fetchRSS(feedUrl);
        const items = parseRSS(xml);
        allItems.push(...items);
        console.log(`Fetched ${items.length} items from feed`);
      } catch (err) {
        console.error(`Error fetching feed: ${err.message}`);
      }
    }

    // Remove duplicates based on title
    const seen = new Set();
    const uniqueItems = allItems.filter(item => {
      const key = item.title.toLowerCase().substring(0, 50);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sort by date (newest first)
    uniqueItems.sort((a, b) => b.pubDate - a.pubDate);

    // Take top 15 items
    const topItems = uniqueItems.slice(0, 15);

    console.log(`Processing ${topItems.length} unique news items...`);

    // Generate HTML for all posts
    const postsHTML = topItems.map(item => {
      const category = categorizeNews(item.title);
      return generatePostHTML(item, category);
    }).join('\n\n');

    // Read the current ai-pulse.html
    const htmlPath = path.join(__dirname, '..', 'ai-pulse.html');
    let html = fs.readFileSync(htmlPath, 'utf8');

    // Replace the feed content
    const feedStartMarker = '<!-- Feed posts -->\n                <div class="feed">';
    const feedEndMarker = '</div>\n\n                <!-- Load more -->';

    const startIdx = html.indexOf(feedStartMarker);
    const endIdx = html.indexOf(feedEndMarker);

    if (startIdx === -1 || endIdx === -1) {
      throw new Error('Could not find feed markers in ai-pulse.html');
    }

    const newFeedContent = `<!-- Feed posts -->
                <div class="feed">
                    <!-- Last updated: ${new Date().toISOString()} -->
${postsHTML}
                `;

    html = html.substring(0, startIdx) + newFeedContent + html.substring(endIdx);

    // Write the updated file
    fs.writeFileSync(htmlPath, html);

    console.log('Successfully updated ai-pulse.html with fresh AI news!');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
