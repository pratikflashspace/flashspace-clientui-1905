# n8n Webhook Integration - AI Team Quick Start

## 🎯 Your Workflow Analysis

Based on your n8n workflow diagram, I can see you have:
- ✅ **Webhook** (POST endpoint) - Already configured
- ✅ **AI Agent** with OpenAI Chat Model
- ✅ **Vector Store** integration (Pinecone)
- ✅ **Simple Memory** for conversation context
- ✅ **"When chat message received"** trigger

**Your workflow is already well-structured!** 🎉

## 📋 What We Need From AI Team

### 1. Webhook URL
Please provide the **production webhook URL** from your n8n workflow.

**It should look like**: 
- `https://your-n8n-instance.com/webhook/chatbot` or
- `https://n8n.your-domain.com/webhook/<webhook-id>`

**Update in**: `Frontend/.env` file
```env
VITE_N8N_WEBHOOK_URL=<YOUR_ACTUAL_WEBHOOK_URL>
```

---

## 📤 Request Format (What We Send)

The frontend will send **POST** requests to your webhook with this JSON payload:

```json
{
  "message": "User's question or message",
  "sessionId": "session_1732704600000_a3f9k2m1p",
  "timestamp": "2025-11-27T10:30:00.000Z"
}
```

### Field Descriptions
- **message** (string, required): The actual user message/query
- **sessionId** (string, required): Unique identifier to track conversation context
- **timestamp** (string, required): ISO 8601 timestamp when message was sent

### Example Requests

#### Example 1: Coworking Space Query
```json
{
  "message": "Find coworking spaces in Delhi NCR region",
  "sessionId": "session_1732704600000_abc123",
  "timestamp": "2025-11-27T10:30:00.000Z"
}
```

#### Example 2: GST Registration
```json
{
  "message": "Help me with GST Registration complete registration process",
  "sessionId": "session_1732704600000_xyz789",
  "timestamp": "2025-11-27T10:31:15.000Z"
}
```

#### Example 3: General Query
```json
{
  "message": "What are the pricing options for virtual office in Mumbai?",
  "sessionId": "session_1732704600000_def456",
  "timestamp": "2025-11-27T10:32:30.000Z"
}
```

---

## 📥 Response Format (What We Expect)

Your n8n workflow should return a JSON response with the AI-generated answer.

### Preferred Format
```json
{
  "response": "Here is the AI chatbot response text...",
  "sessionId": "session_1732704600000_abc123",
  "timestamp": "2025-11-27T10:30:02.000Z"
}
```

### Alternative Formats (Also Supported)
```json
{
  "message": "AI response text here..."
}
```

### Field Descriptions
- **response** (string, required): The AI-generated response to user's query
- **sessionId** (string, optional): Same sessionId that was sent in request
- **timestamp** (string, optional): When the response was generated

### Example Responses

#### Example 1: Workspace Query Response
```json
{
  "response": "I found several coworking spaces in Delhi NCR:\n\n1. Connaught Place Hub - Premium workspace in CP\n2. Nehru Place Tech Center - Startup-friendly space\n3. Saket Business Park - Modern facilities\n\nWould you like more details about any specific location?",
  "sessionId": "session_1732704600000_abc123",
  "timestamp": "2025-11-27T10:30:02.000Z"
}
```

#### Example 2: GST Registration Response
```json
{
  "response": "I can help you with GST Registration! Here's what you'll need:\n\n✅ PAN Card\n✅ Aadhaar Card\n✅ Business Address Proof\n✅ Bank Account Details\n\nThe process takes 5-7 working days. Would you like me to connect you with our compliance team?",
  "sessionId": "session_1732704600000_xyz789",
  "timestamp": "2025-11-27T10:31:17.000Z"
}
```

---

## 🔐 Authentication & Security

### CORS Configuration
Please configure your n8n webhook to allow requests from:

**Development**:
```
http://localhost:5173
http://localhost:5000
```

**Production** (update with actual domain):
```
https://your-production-domain.com
https://www.your-production-domain.com
```

### Headers Required
```
Access-Control-Allow-Origin: <frontend-domain>
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## 🧪 Testing Your Webhook

### Using cURL
```bash
curl -X POST https://your-n8n-webhook-url.com/webhook/chatbot \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, test message",
    "sessionId": "test_session_123",
    "timestamp": "2025-11-27T10:00:00.000Z"
  }'
```

### Using Postman
1. **Method**: POST
2. **URL**: Your n8n webhook URL
3. **Headers**: 
   - Content-Type: application/json
4. **Body** (raw JSON):
```json
{
  "message": "Test query about coworking spaces",
  "sessionId": "test_123",
  "timestamp": "2025-11-27T10:00:00.000Z"
}
```

### Expected Result
You should receive a 200 OK response with JSON containing the AI response.

---

## 🎨 Frontend Behavior

### What Happens When User Sends Message

1. **User types** message in chat input
2. **Frontend sends** POST request to your webhook
3. **Loading indicator** appears (animated dots)
4. **Your AI processes** the message
5. **Response received** from webhook
6. **AI message displayed** in chat
7. **Chat scrolls** to show latest message

### Timeout Handling
- Frontend waits up to 30 seconds for response
- If timeout occurs, user sees error message
- User can retry sending the message

---

## 📊 Session Management

### How Sessions Work

Each browser tab gets a unique session ID:
```
Format: session_<timestamp>_<random_string>
Example: session_1732704600000_a3f9k2m1p
```

**Storage**: Browser sessionStorage (cleared when tab closes)

**Purpose**: 
- Track conversation context
- Enable multi-turn conversations
- Allow AI to reference previous messages

### Implementation Suggestion
In your n8n workflow, you can:
1. Store conversation history per sessionId
2. Use sessionId to maintain context
3. Reference previous messages in the same session

---

## ⚡ Performance Recommendations

### Response Time
- **Target**: < 3 seconds
- **Maximum**: < 10 seconds
- **Timeout**: 30 seconds (frontend limit)

### Rate Limiting
Consider implementing rate limits:
- Per sessionId: 10 requests/minute
- Per IP: 50 requests/hour

### Caching
For common queries, consider caching responses to improve speed.

---

## 🐛 Error Scenarios

### What to Return on Errors

#### AI Service Down
```json
{
  "response": "I'm experiencing technical difficulties. Please try again in a moment.",
  "error": true
}
```

#### Invalid Request
```json
{
  "response": "I didn't quite understand that. Could you please rephrase?",
  "error": true
}
```

#### Rate Limit Exceeded
```json
{
  "response": "You're asking questions too quickly. Please wait a moment before trying again.",
  "error": true
}
```

### HTTP Status Codes
- **200**: Success - Response generated
- **400**: Bad Request - Invalid payload
- **429**: Too Many Requests - Rate limited
- **500**: Internal Error - AI service issue
- **503**: Service Unavailable - Maintenance

---

## 📋 Common Query Types

### 1. Workspace Queries
```
"Find coworking spaces in [city]"
"What are the prices for virtual office?"
"Show me meeting rooms in [location]"
```

### 2. Business Setup
```
"Help with GST registration"
"Company registration process"
"FSSAI license requirements"
```

### 3. Compliance
```
"What documents needed for business registration?"
"How long does GST registration take?"
"Trade license requirements"
```

### 4. Pricing & Plans
```
"Compare workspace plans"
"What's the cheapest virtual office?"
"Monthly vs yearly pricing"
```

---

## 🔄 Integration Steps

### For AI Team

1. **Setup n8n Workflow**
   - Create webhook trigger node
   - Add AI processing logic
   - Configure response format

2. **Configure CORS**
   - Allow frontend domain
   - Enable POST method
   - Allow Content-Type header

3. **Test Webhook**
   - Use Postman/cURL to test
   - Verify response format
   - Check error handling

4. **Share URL**
   - Provide webhook URL to frontend team
   - Confirm it's accessible
   - Verify it's production-ready

5. **Monitor & Optimize**
   - Track response times
   - Monitor error rates
   - Optimize slow queries

---

## 📞 Support & Communication

### Questions About

**Request/Response Format**: Contact Frontend Team
**AI Logic/Responses**: AI Team handles internally
**Performance Issues**: Check both teams

### Deployment Checklist

- [ ] n8n workflow is active
- [ ] Webhook URL is accessible
- [ ] CORS is configured correctly
- [ ] Response format matches specification
- [ ] Error handling is implemented
- [ ] Performance is acceptable (< 3s)
- [ ] Rate limiting is configured
- [ ] Testing is complete

---

## 🚀 Go Live Process

1. **AI Team**: Share production webhook URL
2. **Frontend Team**: Update `.env` with URL
3. **Both Teams**: Test in staging environment
4. **Both Teams**: Verify in production
5. **Monitor**: Check logs and user feedback

---

**Questions?** Contact the Frontend or AI team lead.

**Last Updated**: November 27, 2025
