# n8n Workflow Integration - Technical Details

## 🎯 Your Current Workflow Structure

Based on your workflow diagram, here's what I can see:

### Workflow Components

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  Webhook (POST)  →  Edit Fields  →  Code in JavaScript      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────┐
                    │   AI Agent      │
                    │   + OpenAI      │
                    │   + Memory      │
                    └─────────────────┘
                              ↓
                    ┌─────────────────────────────┐
                    │  Answer questions with      │
                    │  a vector store (Pinecone)  │
                    └─────────────────────────────┘
                              ↓
                    ┌─────────────────┐
                    │ OpenAI Chat     │
                    │ Model           │
                    └─────────────────┘
                              ↓
                    ┌─────────────────┐
                    │ Embeddings      │
                    │ OpenAI          │
                    └─────────────────┘
                              ↓
                    ┌─────────────────┐
                    │ Pinecone Vector │
                    │ Store           │
                    └─────────────────┘
```

Also visible:
- **"When chat message received"** trigger
- **Simple Memory** component
- **Code in JavaScript** for processing

---

## ✅ What You Already Have (Great!)

1. ✅ **Webhook Endpoint** - Ready to receive POST requests
2. ✅ **AI Agent** - Configured with OpenAI
3. ✅ **Vector Store** - Pinecone for knowledge base
4. ✅ **Memory** - Conversation context tracking
5. ✅ **Embeddings** - OpenAI embeddings for semantic search
6. ✅ **Chat Model** - OpenAI chat model for responses

---

## 🔄 How Frontend Will Integrate

### Current Frontend Integration

The frontend is already configured to send requests like this:

```javascript
// POST request to your webhook
fetch(VITE_N8N_WEBHOOK_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: userMessage,        // User's question
    sessionId: sessionId,        // For memory/context
    timestamp: new Date().toISOString()
  })
})
```

---

## 🎯 Webhook Configuration Needed

### 1. Webhook Node Setup

Your webhook should already be configured, but verify:

**Method**: POST  
**Path**: `/webhook/chatbot` (or your chosen path)  
**Response Mode**: "Last Node" or "Using Respond to Webhook"

### 2. Edit Fields Node (if needed)

This node should extract:
```javascript
{
  "message": "{{$json.body.message}}",
  "sessionId": "{{$json.body.sessionId}}",
  "timestamp": "{{$json.body.timestamp}}"
}
```

### 3. Code in JavaScript Node

This should prepare data for AI Agent:

```javascript
// Extract incoming data
const userMessage = $input.first().json.message || $input.first().json.body?.message;
const sessionId = $input.first().json.sessionId || $input.first().json.body?.sessionId;

// Format for AI Agent
return {
  json: {
    chatInput: userMessage,
    sessionId: sessionId,
    timestamp: new Date().toISOString()
  }
};
```

---

## 🤖 AI Agent Configuration

### Your AI Agent Setup Should Include:

**Agent Type**: Conversational Agent (with memory)  
**Model**: OpenAI Chat Model (gpt-4 or gpt-3.5-turbo)  
**Memory**: Simple Memory (linked to sessionId)  
**Tools**: Vector Store for knowledge retrieval

### System Prompt Suggestion

```
You are FlashSpace AI Assistant, helping users with:
- Coworking spaces and office solutions in India
- Virtual office addresses
- Business registration and compliance (GST, FSSAI, Trade License)
- Company formation and legal requirements
- Workspace recommendations based on location and budget

Always be helpful, professional, and provide accurate information about Indian business regulations and workspace solutions.
```

---

## 📊 Vector Store (Pinecone) Setup

### What to Store in Pinecone

Your vector store should contain:

1. **Workspace Information**
   - Coworking space details (locations, amenities, pricing)
   - Virtual office addresses by city
   - Meeting room availability

2. **Compliance Knowledge**
   - GST registration process
   - FSSAI license requirements
   - Company formation steps
   - Trade license procedures

3. **FAQs**
   - Common customer questions
   - Pricing information
   - Service comparisons

### Embedding Model
- Use: **OpenAI text-embedding-ada-002**
- Dimension: 1536
- Language: English (with Hindi support if needed)

---

## 💾 Memory Configuration

### Simple Memory Setup

Your memory should:
- Store conversation history per `sessionId`
- Keep last 5-10 messages for context
- Clear after session ends (browser tab close)

**Memory Key**: Use `sessionId` as the key

```javascript
// In your workflow
const memoryKey = $json.sessionId;
```

---

## 📤 Response Format

### What Frontend Expects

Your workflow should return:

```json
{
  "response": "AI generated answer here...",
  "sessionId": "session_1732704600000_abc123",
  "timestamp": "2025-11-27T10:30:02.000Z"
}
```

### Adding Response Node

At the end of your workflow, add a **"Respond to Webhook"** or **"Code"** node:

```javascript
// Get AI response
const aiResponse = $input.first().json.output || 
                  $input.first().json.response ||
                  $input.first().json.text;

const sessionId = $('Extract Data').first().json.sessionId;

// Format for frontend
return {
  json: {
    response: aiResponse,
    sessionId: sessionId,
    timestamp: new Date().toISOString()
  }
};
```

---

## 🔐 CORS Configuration

### Webhook Node Settings

Make sure your webhook allows:

```
Allowed Origins: 
- http://localhost:5173
- https://your-production-domain.com
```

**Important**: Enable CORS in n8n settings or webhook node configuration.

---

## 🧪 Testing Your Workflow

### Test with Webhook URL

1. **Get your webhook URL** from n8n (Production URL tab)
2. **Test with cURL**:

```bash
curl -X POST 'YOUR_WEBHOOK_URL' \
  -H 'Content-Type: application/json' \
  -d '{
    "message": "Find coworking spaces in Delhi",
    "sessionId": "test_session_123",
    "timestamp": "2025-11-27T10:00:00.000Z"
  }'
```

3. **Expected Response**:
```json
{
  "response": "I found several coworking spaces in Delhi...",
  "sessionId": "test_session_123",
  "timestamp": "2025-11-27T10:00:02.000Z"
}
```

### Check n8n Execution Logs

- Go to **Executions** tab in n8n
- Check if workflow executed successfully
- Verify AI response was generated
- Check vector store queries worked

---

## 🎯 Optimization Tips

### 1. Response Time
- Use **gpt-3.5-turbo** for faster responses (< 2s)
- Use **gpt-4** for better quality (3-5s)
- Cache common queries in Pinecone

### 2. Vector Store Queries
- Limit results to top 3-5 relevant docs
- Use similarity threshold: 0.7+
- Pre-filter by category if possible

### 3. Memory Management
- Clear old sessions periodically
- Limit memory to last 10 messages
- Implement session timeout (30 mins)

### 4. Error Handling
```javascript
try {
  // AI processing
  const response = await processWithAI(message);
  return { json: { response } };
} catch (error) {
  return {
    json: {
      response: "I'm having trouble right now. Please try again.",
      error: true
    }
  };
}
```

---

## 📋 Pre-Deployment Checklist

- [ ] Webhook URL is accessible (test with Postman)
- [ ] CORS is configured for frontend domain
- [ ] AI Agent is properly configured
- [ ] Vector Store (Pinecone) has data loaded
- [ ] Memory is linked to sessionId
- [ ] Response format matches specification
- [ ] Error handling is implemented
- [ ] Test with sample queries works
- [ ] Response time is acceptable (< 5s)
- [ ] Production API keys are configured

---

## 🚀 Sharing Webhook URL

### What to Share with Frontend Team

1. **Production Webhook URL**
   ```
   https://n8n.your-domain.com/webhook/your-webhook-id
   ```

2. **Confirm These Details**:
   - ✅ CORS enabled for frontend domain
   - ✅ Accepts POST requests
   - ✅ Returns JSON with `response` field
   - ✅ Handles errors gracefully
   - ✅ Response time < 5 seconds

3. **Share Test Results**:
   - Screenshot of successful test
   - Sample request/response
   - Average response time

---

## 🐛 Common Issues & Fixes

### Issue: Webhook Not Receiving Requests
**Fix**: 
- Check if webhook is activated in n8n
- Verify URL is correct
- Test with Postman first

### Issue: CORS Errors
**Fix**:
- Add frontend domain to allowed origins
- Enable CORS in n8n settings
- Check browser console for exact error

### Issue: No AI Response
**Fix**:
- Check OpenAI API key is valid
- Verify model name is correct
- Check n8n execution logs for errors

### Issue: Vector Store Not Working
**Fix**:
- Verify Pinecone API key
- Check if index exists
- Confirm embeddings are loaded

### Issue: Memory Not Persisting
**Fix**:
- Use sessionId as memory key
- Check memory node configuration
- Verify sessionId is being passed

---

## 📞 Need Help?

### Debug Steps
1. Check n8n execution logs
2. Test webhook with Postman
3. Verify OpenAI API quota
4. Check Pinecone index status
5. Review error messages in logs

### Contact
- **Frontend Issues**: Frontend team
- **n8n/Workflow Issues**: AI team
- **Integration Issues**: Both teams coordinate

---

## 🎉 You're Almost Ready!

Your workflow looks great! Just need to:
1. ✅ Share webhook URL with frontend team
2. ✅ Verify CORS settings
3. ✅ Test end-to-end integration
4. ✅ Deploy! 🚀

---

**Last Updated**: November 27, 2025  
**Workflow Status**: ✅ Ready for Integration
