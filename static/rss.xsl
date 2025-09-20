<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" doctype-public="-//W3C//DTD HTML 4.01 Transitional//EN" doctype-system="http://www.w3.org/TR/html4/loose.dtd" indent="yes"/>

  <xsl:template match="/">
    <html>
      <head>
        <title><xsl:value-of select="rss/channel/title"/> - RSS Feed</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="stylesheet" href="/style.css"/>
        <style type="text/css">
          body {
            margin: 1em;
          }
          .feed-info {
            background: var(--box-bg-color);
            border: 1px solid var(--border-color);
            border-radius: 5px;
            padding: 20px;
            margin-bottom: 30px;
          }

          .feed-info h2 {
            margin-top: 0;
          }

          .item {
            border-bottom: 1px solid var(--border-color);
            padding: 20px 0;
          }

          .item:last-child {
            border-bottom: none;
          }

          .item h3 {
            margin: 0 0 10px;
          }

          .item h3 a {
            text-decoration: none;
          }

          .item h3 a:hover {
            text-decoration: underline;
          }

          .item-meta {
            color: var(--color-gray);
            font-size: 0.9em;
            margin-bottom: 15px;
            font-style: italic;
          }

          .item-description pre {
            background: var(--code-bg);
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            border: 1px solid var(--border-color);
          }

          .item-description pre code {
            background: none;
            padding: 0;
          }

        </style>
      </head>
      <body>
        <div class="header">
          <h1>
            <xsl:value-of select="rss/channel/title"/>
          </h1>
          <p><xsl:value-of select="rss/channel/description"/></p>
        </div>

        <div class="feed-info">
          <h2>📡 RSS Feed</h2>
          <p>This is an RSS feed. You can subscribe to it using your favorite RSS reader to get updates when new posts are published.</p>
          <p style="margin-bottom: 0;">
            <a href="{rss/channel/link}">Back to website</a>
          </p>
        </div>

        <xsl:for-each select="rss/channel/item">
          <div class="item">
            <h3>
              <a href="{link}" target="_blank">
                <xsl:value-of select="title"/>
              </a>
            </h3>

            <div class="item-meta">
              <xsl:if test="author">
                <strong>By: </strong> <a href="mailto:{substring-before(author, ' (')}">
                <xsl:value-of select="substring-before(substring-after(author, ' ('), ')')"/></a> •
              </xsl:if>
              <strong>Published: </strong> <xsl:value-of select="pubDate"/>
            </div>

            <p class="item-description">
              <xsl:value-of select="description" disable-output-escaping="yes"/>
            </p>
          </div>
        </xsl:for-each>

      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
