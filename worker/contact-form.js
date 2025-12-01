/**
 * Cloudflare Worker for Contact Form Submission Proxy
 *
 * This worker acts as a secure intermediary between the frontend form
 * and Google Apps Script, protecting the Apps Script URL from exposure.
 */

// CORS headers for allowing requests from your domain
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*', // Will be restricted in production
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400', // 24 hours
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // Max 5 requests per minute per IP

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: CORS_HEADERS,
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
        },
      });
    }

    try {
      // Rate limiting check
      const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
      const rateLimitKey = `rate_limit:${clientIP}`;

      // Check rate limit using KV (if available)
      if (env.RATE_LIMIT_KV) {
        const currentCount = await env.RATE_LIMIT_KV.get(rateLimitKey);
        const count = currentCount ? parseInt(currentCount) : 0;

        if (count >= MAX_REQUESTS_PER_WINDOW) {
          return new Response(
            JSON.stringify({
              error: '請求過於頻繁，請稍後再試',
              retryAfter: 60
            }),
            {
              status: 429,
              headers: {
                'Content-Type': 'application/json',
                'Retry-After': '60',
                ...CORS_HEADERS,
              },
            }
          );
        }

        // Increment rate limit counter
        await env.RATE_LIMIT_KV.put(
          rateLimitKey,
          (count + 1).toString(),
          { expirationTtl: 60 }
        );
      }

      // Parse and validate request body
      const formData = await request.json();

      // Validate required fields
      const { name, email, category, message } = formData;

      if (!name || !email || !message) {
        return new Response(
          JSON.stringify({ error: '缺少必填欄位' }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...CORS_HEADERS,
            },
          }
        );
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return new Response(
          JSON.stringify({ error: 'Email 格式不正確' }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...CORS_HEADERS,
            },
          }
        );
      }

      // Prepare data for Google Sheets
      const sheetData = {
        name: name.trim(),
        email: email.trim(),
        category: category || 'other',
        message: message.trim(),
        timestamp: new Date().toISOString(),
        source: 'portfolio-website',
        ip: clientIP,
        userAgent: request.headers.get('User-Agent') || 'unknown',
      };

      // Forward to Google Apps Script
      // The actual URL is stored as an environment variable for security
      const appsScriptUrl = env.APPS_SCRIPT_URL;

      if (!appsScriptUrl) {
        console.error('APPS_SCRIPT_URL environment variable not configured');
        return new Response(
          JSON.stringify({ error: '伺服器配置錯誤' }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...CORS_HEADERS,
            },
          }
        );
      }

      // Make request to Google Apps Script
      const appsScriptResponse = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sheetData),
      });

      // Check if Apps Script responded successfully
      if (!appsScriptResponse.ok) {
        throw new Error(`Apps Script returned ${appsScriptResponse.status}`);
      }

      // Return success response
      return new Response(
        JSON.stringify({
          success: true,
          message: '訊息已成功送出'
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...CORS_HEADERS,
          },
        }
      );

    } catch (error) {
      console.error('Error processing form submission:', error);

      return new Response(
        JSON.stringify({
          error: '送出時發生錯誤，請稍後再試',
          details: error.message
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...CORS_HEADERS,
          },
        }
      );
    }
  },
};
