# n8n Workflow Example Configuration

## Sample n8n Workflow for Chatbot Integration

This is a reference configuration showing how the AI team can structure their n8n workflow to work with the frontend integration.

---

## 📊 Workflow Structure

```
Webhook Trigger → Process Request → AI Agent → Format Response → Return Response
```

---

## 🔧 Node Configuration

### 1. Webhook Trigger Node

**Node Type**: `n8n-nodes-base.webhook`

**Configuration**:
```json
{
  "httpMethod": "POST",
  "path": "chatbot",
  "responseMode": "lastNode",
  "options": {
    "allowedOrigins": "http://localhost:5173,https://your-domain.com"
  }
}
```

**What It Does**: 
- Listens for POST requests from frontend
- Accepts the incoming message payload
- Passes data to next node

---

### 2. Process Request Node (Function)

**Node Type**: `n8n-nodes-base.function`

**JavaScript Code**:
```javascript
// Extract data from webhook payload
const userMessage = $input.first().json.body.message;
const sessionId = $input.first().json.body.sessionId;
const timestamp = $input.first().json.body.timestamp;

// Store in workflow variables
return {
  json: {
    userMessage: userMessage,
    sessionId: sessionId,
    receivedAt: timestamp,
    processedAt: new Date().toISOString()
  }
};
```

**What It Does**:
- Extracts user message, sessionId, and timestamp
- Prepares data for AI processing
- Adds processing timestamp

---

### 3. Check Session History (Optional)

**Node Type**: `n8n-nodes-base.if`

**Configuration**:
```json
{
  "conditions": {
    "string": [
      {
        "value1": "={{$json.sessionId}}",
        "operation": "exists"
      }
    ]
  }
}
```

**Purpose**: Check if session has previous context

---

### 4. AI Agent / LLM Node

**Option A: OpenAI Node**

**Node Type**: `n8n-nodes-base.openAi`

**Configuration**:
```json
{
  "operation": "message",
  "model": "gpt-4",
  "messages": {
    "messageValues": [
      {
        "role": "system",
        "content": "You are FlashSpace AI Assistant. Help users with coworking spaces, virtual offices, and business compliance in India."
      },
      {
        "role": "user",
        "content": "={{$json.userMessage}}"
      }
    ]
  },
  "options": {
    "temperature": 0.7,
    "maxTokens": 500
  }
}
```

**Option B: Custom AI API**

**Node Type**: `n8n-nodes-base.httpRequest`

```json
{
  "method": "POST",
  "url": "https://your-ai-api.com/chat",
  "authentication": "genericCredentialType",
  "genericAuthType": "httpHeaderAuth",
  "sendHeaders": true,
  "headerParameters": {
    "parameters": [
      {
        "name": "Authorization",
        "value": "Bearer YOUR_API_KEY"
      }
    ]
  },
  "sendBody": true,
  "bodyParameters": {
    "parameters": [
      {
        "name": "message",
        "value": "={{$json.userMessage}}"
      },
      {
        "name": "session_id",
        "value": "={{$json.sessionId}}"
      }
    ]
  }
}
```

**Option C: LangChain Agent**

**Node Type**: `@langchain/n8n-nodes-langchain.agent`

**Configuration**:
```json
{
  "agent": "conversationalAgent",
  "prompt": "You are FlashSpace AI. Help with:\n- Coworking spaces\n- Virtual offices\n- Business registration\n- GST, FSSAI, licenses\n- Compliance requirements",
  "model": "gpt-4-turbo",
  "memory": true,
  "memoryKey": "={{$json.sessionId}}"
}
```

---

### 5. Format Response Node

**Node Type**: `n8n-nodes-base.function`

**JavaScript Code**:
```javascript
// Get AI response from previous node
const aiResponse = $input.first().json.output || 
                  $input.first().json.message ||
                  $input.first().json.choices[0].message.content;

const sessionId = $('Process Request').first().json.sessionId;

// Format response for frontend
return {
  json: {
    response: aiResponse,
    sessionId: sessionId,
    timestamp: new Date().toISOString()
  }
};
```

**What It Does**:
- Extracts AI response from previous node
- Formats it according to frontend specification
- Adds metadata (sessionId, timestamp)

---

### 6. Error Handling Node

**Node Type**: `n8n-nodes-base.function`

**JavaScript Code**:
```javascript
try {
  // Get error from previous node
  const error = $input.first().json.error;
  
  // Return user-friendly error message
  return {
    json: {
      response: "I'm having trouble processing your request right now. Please try again in a moment.",
      error: true,
      sessionId: $('Process Request').first().json.sessionId,
      timestamp: new Date().toISOString()
    }
  };
} catch (err) {
  return {
    json: {
      response: "An unexpected error occurred. Our team has been notified.",
      error: true,
      timestamp: new Date().toISOString()
    }
  };
}
```

---

## 🔐 Environment Variables

Set these in your n8n instance:

```env
# OpenAI API Key (if using OpenAI)
OPENAI_API_KEY=sk-...

# Custom AI API (if using custom service)
AI_API_URL=https://your-ai-api.com
AI_API_KEY=your_api_key

# Database for session storage (optional)
DB_CONNECTION_STRING=postgresql://...

# Allowed Origins for CORS
ALLOWED_ORIGINS=http://localhost:5173,https://your-domain.com
```

---

## 💾 Session Storage (Optional)

### Store Conversation History

**Node Type**: `n8n-nodes-base.postgres` or `n8n-nodes-base.mongodb`

**Store Operation**:
```sql
INSERT INTO chat_sessions (
  session_id,
  user_message,
  ai_response,
  timestamp
) VALUES (
  $1, $2, $3, $4
)
```

**Retrieve Operation**:
```sql
SELECT * FROM chat_sessions 
WHERE session_id = $1 
ORDER BY timestamp DESC 
LIMIT 10
```

---

## 📝 Example Workflow JSON

```json
{
  "name": "FlashSpace Chatbot Webhook",
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [240, 300],
      "parameters": {
        "httpMethod": "POST",
        "path": "chatbot",
        "responseMode": "lastNode"
      }
    },
    {
      "name": "Process Request",
      "type": "n8n-nodes-base.function",
      "position": [460, 300],
      "parameters": {
        "functionCode": "const userMessage = $input.first().json.body.message;\nconst sessionId = $input.first().json.body.sessionId;\n\nreturn {\n  json: {\n    userMessage,\n    sessionId,\n    processedAt: new Date().toISOString()\n  }\n};"
      }
    },
    {
      "name": "AI Agent",
      "type": "n8n-nodes-base.openAi",
      "position": [680, 300],
      "parameters": {
        "operation": "message",
        "model": "gpt-4",
        "messages": {
          "messageValues": [
            {
              "role": "system",
              "content": "You are FlashSpace AI Assistant."
            },
            {
              "role": "user",
              "content": "={{$json.userMessage}}"
            }
          ]
        }
      }
    },
    {
      "name": "Format Response",
      "type": "n8n-nodes-base.function",
      "position": [900, 300],
      "parameters": {
        "functionCode": "const aiResponse = $input.first().json.choices[0].message.content;\nconst sessionId = $('Process Request').first().json.sessionId;\n\nreturn {\n  json: {\n    response: aiResponse,\n    sessionId,\n    timestamp: new Date().toISOString()\n  }\n};"
      }
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{ "node": "Process Request", "type": "main", "index": 0 }]]
    },
    "Process Request": {
      "main": [[{ "node": "AI Agent", "type": "main", "index": 0 }]]
    },
    "AI Agent": {
      "main": [[{ "node": "Format Response", "type": "main", "index": 0 }]]
    }
  },
  "active": true,
  "settings": {
    "executionOrder": "v1"
  }
}
```

---

## 🧪 Testing Workflow

### Test with n8n Test Webhook

1. **Activate Workflow** in n8n
2. **Copy Webhook URL** from webhook node
3. **Send Test Request**:

```bash
curl -X POST 'YOUR_N8N_WEBHOOK_URL' \
  -H 'Content-Type: application/json' \
  -d '{
    "message": "Find coworking spaces in Delhi",
    "sessionId": "test_session_123",
    "timestamp": "2025-11-27T10:00:00.000Z"
  }'
```

4. **Check Execution** in n8n executions tab
5. **Verify Response** format matches specification

---

## 🎯 Best Practices

### 1. Response Time Optimization
- Cache common queries
- Use efficient AI models
- Implement timeout handling
- Add response compression

### 2. Context Management
```javascript
// Store conversation context per session
const context = await getSessionContext(sessionId);

// Add to AI prompt
const enhancedPrompt = `
Previous Context: ${context}
Current Query: ${userMessage}
`;
```

### 3. Rate Limiting
```javascript
// Check request frequency
const requestCount = await getRequestCount(sessionId);

if (requestCount > 10) {
  return {
    json: {
      response: "Please wait a moment before sending more messages.",
      error: true
    }
  };
}
```

### 4. Logging & Monitoring
```javascript
// Log all interactions
await logInteraction({
  sessionId,
  userMessage,
  aiResponse,
  timestamp: new Date(),
  responseTime: endTime - startTime
});
```

---

## 🚨 Error Scenarios

### Handle Common Errors

```javascript
try {
  // AI processing
  const response = await callAI(userMessage);
  
  return { json: { response } };
  
} catch (error) {
  if (error.code === 'RATE_LIMIT') {
    return {
      json: {
        response: "I'm receiving too many requests. Please try again shortly.",
        error: true
      }
    };
  }
  
  if (error.code === 'TIMEOUT') {
    return {
      json: {
        response: "This is taking longer than expected. Please try again.",
        error: true
      }
    };
  }
  
  // Generic error
  return {
    json: {
      response: "I encountered an error. Please try again.",
      error: true
    }
  };
}
```

---

## 📊 Monitoring & Analytics

### Track Key Metrics

```javascript
// In your workflow, track:
{
  sessionId: "session_xyz",
  userMessage: "original query",
  aiResponse: "generated response",
  responseTime: 1.5, // seconds
  tokensUsed: 150,
  model: "gpt-4",
  timestamp: "2025-11-27T10:00:00Z",
  success: true
}
```

### Useful Metrics
- Response time distribution
- Error rate
- Most common queries
- Session duration
- Token usage
- User satisfaction

---

## 🔗 Resources

- [n8n Documentation](https://docs.n8n.io/)
- [Webhook Node Docs](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [OpenAI Node Docs](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.openai/)
- [Function Node Docs](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.function/)

---

**Need Help?** Contact the AI team or refer to the integration documentation.

**Last Updated**: November 27, 2025
