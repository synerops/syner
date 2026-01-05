# Syner OS Application

## Testing Endpoints

**IMPORTANT**: When testing API endpoints, always use `curl -s` (silent mode) and pipe to `jq` for formatted JSON output.

### Example

```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{}' | jq .
```
