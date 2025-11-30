# Quick Integration Setup - Based on Your Workflow

## 🎯 Your Workflow → Frontend Integration

Your n8n workflow already has everything needed! Here's the quick setup:

---

## ✅ What You Already Have

Your workflow includes:
1. ✅ **Webhook (POST)** - Entry point ✓
2. ✅ **Edit Fields** - Data extraction ✓
3. ✅ **Code in JavaScript** - Pre-processing ✓
4. ✅ **AI Agent** - OpenAI integration ✓
5. ✅ **Vector Store** - Pinecone knowledge base ✓
6. ✅ **Memory** - Context tracking ✓
7. ✅ **Embeddings** - OpenAI embeddings ✓

**Status**: Your workflow is production-ready! 🎉

---

## 🔧 Small Adjustments Needed

### 1. Verify Webhook Response Format

At the end of your workflow, ensure the response matches:

```json
{
  "response": "AI answer here",
  "sessionId": "session_id_from_request",
  "timestamp": "2025-11-27T10:00:00.000Z"
}
```

### 2. Update JavaScript Code Node (if needed)

In your "Code in JavaScript" node:

```javascript
// Extract from webhook body
const message = $input.first().json.body?.message || $input.first().json.message;
const sessionId = $input.first().json.body?.sessionId || $input.first().json.sessionId;
const timestamp = $input.first().json.body?.timestamp || new Date().toISOString();

// Pass to AI Agent
return {
  json: {
    chatInput: message,
    sessionId: sessionId,
    timestamp: timestamp
  }
};
```

### 3. Add Response Formatting Node (Optional)

Add a final "Code" node before webhook response:

```javascript
// Get AI response (adjust based on your AI Agent output)
const aiResponse = $input.first().json.output || 
                  $input.first().json.response ||
                  $input.first().json.text;

// Get sessionId from earlier node
const sessionId = $('Code in JavaScript').first().json.sessionId;

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

## 📝 Frontend Request Format

Your webhook will receive:

```json
{
  "message": "User's question here",
  "sessionId": "session_1732704600000_abc123",
  "timestamp": "2025-11-27T10:30:00.000Z"
}
```

### Example Requests

**Query 1: Coworking Space**
```json
{
  "message": "Find coworking spaces in Delhi NCR region",
  "sessionId": "session_1732704600000_abc123",
  "timestamp": "2025-11-27T10:30:00.000Z"
}
```

**Query 2: GST Registration**
```json
{
  "message": "Help me with GST Registration complete registration process",
  "sessionId": "session_1732704700000_xyz789",
  "timestamp": "2025-11-27T10:35:00.000Z"
}
```

**Query 3: Pricing**
```json
{
  "message": "What are the pricing options for virtual office in Mumbai?",
  "sessionId": "session_1732704800000_def456",
  "timestamp": "2025-11-27T10:40:00.000Z"
}
```

---

## 🤖 AI Agent Configuration

### Recommended System Prompt

Update your AI Agent's system prompt to:

```
You are FlashSpace AI Assistant. You help users with:

1. WORKSPACE SOLUTIONS:
   - Coworking spaces across India
   - Virtual office addresses
   - Meeting rooms and event spaces
   - Private cabins and dedicated desks

2. BUSINESS SETUP & COMPLIANCE:
   - GST Registration
   - Company Registration (Pvt Ltd, LLP, OPC)
   - FSSAI License
   - Trade License
   - Professional Tax
   - Labour License
   - Business address for registration

3. LOCATIONS:
   - Delhi NCR (Delhi, Noida, Gurgaon)
   - Mumbai, Bangalore, Pune
   - Chennai, Hyderabad, Kolkata
   - All major Indian cities

4. TONE & STYLE:
   - Be friendly and professional
   - Provide accurate information
   - Ask clarifying questions when needed
   - Guide users to relevant services
   - Use Indian context and examples

When users ask about workspaces, provide specific details like:
- Location options
- Pricing ranges
- Amenities available
- Booking process

When users ask about compliance, explain:
- Required documents
- Timeline (processing time)
- Costs involved
- Next steps
```

---

## 💾 Memory Configuration

### Link Memory to SessionId

In your **Simple Memory** node:
- **Memory Key**: `{{$json.sessionId}}`
- **Keep Last**: 10 messages
- **Clear After**: Session ends

This ensures each user's conversation context is maintained separately.

---

## 📊 Vector Store (Pinecone) Data

### Ensure Your Pinecone Index Contains:

**1. Workspace Information**
```
- Coworking space names and locations
- Pricing: Day pass, monthly, yearly plans
- Amenities: WiFi, parking, cafeteria, meeting rooms
- Capacity: Number of seats available
- Cities covered: Delhi, Mumbai, Bangalore, etc.
```

**2. Compliance Knowledge**
```
- GST registration: Documents, process, timeline
- Company registration: Types, requirements, costs
- FSSAI license: Categories, application process
- Trade license: By state/city requirements
- Professional tax: State-wise rules
```

**3. FAQs**
```
- "How much does a virtual office cost?"
- "What documents needed for GST?"
- "Can I use virtual office for company registration?"
- "How long does business registration take?"
```

---

## 🔐 CORS Configuration

### Enable CORS in Webhook

**n8n Webhook Settings**:
```
Allowed Origins:
- http://localhost:5173 (development)
- https://your-production-domain.com (production)
- https://www.your-production-domain.com (production www)
```

**OR** if global n8n CORS:
```
Environment Variables:
N8N_CORS_ORIGIN=http://localhost:5173,https://your-domain.com
```

---

## 🧪 Testing Checklist

### 1. Test Webhook URL
```bash
curl -X POST 'YOUR_WEBHOOK_URL' \
  -H 'Content-Type: application/json' \
  -d '{
    "message": "Hello, test message",
    "sessionId": "test_123",
    "timestamp": "2025-11-27T10:00:00.000Z"
  }'
```

**Expected Response** (200 OK):
```json
{
  "response": "Hello! I'm FlashSpace AI Assistant...",
  "sessionId": "test_123",
  "timestamp": "2025-11-27T10:00:02.000Z"
}
```

### 2. Test with Real Queries

**Test 1: Workspace Query**
```bash
curl -X POST 'YOUR_WEBHOOK_URL' \
  -H 'Content-Type: application/json' \
  -d '{
    "message": "Find coworking spaces in Mumbai",
    "sessionId": "test_456",
    "timestamp": "2025-11-27T10:05:00.000Z"
  }'
```

**Test 2: GST Query**
```bash
curl -X POST 'YOUR_WEBHOOK_URL' \
  -H 'Content-Type: application/json' \
  -d '{
    "message": "How do I register for GST?",
    "sessionId": "test_789",
    "timestamp": "2025-11-27T10:10:00.000Z"
  }'
```

### 3. Test Memory/Context

Send two messages with same sessionId:

**Message 1**:
```json
{"message": "I need a coworking space", "sessionId": "test_memory"}
```

**Message 2** (should remember context):
```json
{"message": "What are the prices?", "sessionId": "test_memory"}
```

AI should understand "prices" refers to coworking space from previous message.

---

## 🚀 Go-Live Steps

### Step 1: Get Webhook URL
1. Open your n8n workflow
2. Click on **Webhook** node
3. Copy **Production URL** (not Test URL)
4. Should look like: `https://n8n.your-domain.com/webhook/abc123`

### Step 2: Share with Frontend Team
Send them:
```
✅ Production Webhook URL: <YOUR_URL>
✅ CORS Configured: Yes
✅ Response Format: Verified
✅ Test Results: Attached
✅ Average Response Time: X seconds
```

### Step 3: Frontend Updates .env
They will update:
```env
VITE_N8N_WEBHOOK_URL=<YOUR_WEBHOOK_URL>
```

### Step 4: Integration Testing
- Frontend team tests locally
- Both teams test on staging
- Verify all user flows work
- Check error scenarios

### Step 5: Production Deployment
- Deploy frontend with webhook URL
- Monitor n8n executions
- Check response times
- Fix any issues quickly

---

## 📊 Monitoring

### Track These Metrics

**In n8n**:
- Execution success rate
- Average response time
- Error rate
- Most common queries

**What to Monitor**:
```
✅ Executions/hour
✅ Average response time: Target < 3 seconds
✅ Error rate: Should be < 2%
✅ OpenAI API usage
✅ Pinecone query count
```

---

## 🐛 Troubleshooting

### Issue: Slow Responses (> 5 seconds)
**Solutions**:
- Switch to gpt-3.5-turbo (faster than gpt-4)
- Reduce vector store results (top 3 instead of 10)
- Optimize Pinecone queries
- Cache common answers

### Issue: AI Gives Wrong Information
**Solutions**:
- Update system prompt
- Add more data to Pinecone
- Improve embeddings quality
- Adjust similarity threshold

### Issue: Memory Not Working
**Solutions**:
- Verify sessionId is being passed
- Check memory key configuration
- Test with same sessionId twice

### Issue: CORS Errors
**Solutions**:
- Add frontend domain to allowed origins
- Check n8n CORS settings
- Test webhook directly (bypass CORS)

---

## ✅ Final Checklist

Before sharing webhook URL:

- [ ] Webhook is active (not paused)
- [ ] Test URL works with curl/Postman
- [ ] Response format is correct
- [ ] CORS is configured
- [ ] AI Agent system prompt is set
- [ ] Vector store has data
- [ ] Memory is linked to sessionId
- [ ] Error handling works
- [ ] Response time < 5 seconds
- [ ] Production API keys configured

---

## 🎉 You're Ready!

Your workflow looks perfect! Just:

1. ✅ Copy your webhook URL
2. ✅ Test it once with curl
3. ✅ Share with frontend team
4. ✅ Monitor after deployment

**Questions?** Check the other documentation files or contact the frontend team!

---

**Last Updated**: November 27, 2025  
**Status**: ✅ Ready to Share Webhook URL
