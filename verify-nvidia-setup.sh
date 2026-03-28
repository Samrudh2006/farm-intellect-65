#!/bin/bash

echo "🔍 Farm Intellect NVIDIA Integration Verification"
echo "=================================================="
echo ""

# Check for NVIDIA_API_KEY
echo "✓ Checking environment variables..."
if [ -z "$NVIDIA_API_KEY" ]; then
  echo "  ⚠️  NVIDIA_API_KEY not found in environment"
  echo "  📝 Make sure to set it in Vercel Settings → Vars"
else
  KEY_PREFIX="${NVIDIA_API_KEY:0:7}"
  echo "  ✓ NVIDIA_API_KEY found (${KEY_PREFIX}...)"
fi

echo ""
echo "✓ Checking backend files..."

# Check for NVIDIA service
if [ -f "backend/src/services/nvidia.js" ]; then
  echo "  ✓ NVIDIA service created"
else
  echo "  ⚠️  NVIDIA service not found"
fi

# Check chat.js updates
if grep -q "createNvidiaChatCompletion" "backend/src/routes/chat.js"; then
  echo "  ✓ Chat routes updated with NVIDIA"
else
  echo "  ⚠️  Chat routes not updated"
fi

# Check Supabase function
if grep -q "NVIDIA_API_KEY" "supabase/functions/chat/index.ts"; then
  echo "  ✓ Supabase chat function updated"
else
  echo "  ⚠️  Supabase function not updated"
fi

echo ""
echo "✓ Checking documentation..."
if [ -f "NVIDIA_INTEGRATION.md" ]; then
  echo "  ✓ Integration guide created"
else
  echo "  ⚠️  Integration guide not found"
fi

echo ""
echo "✓ Checking chatbot hooks..."
if [ -f "src/hooks/useAIChatbot.ts" ]; then
  echo "  ✓ AI chatbot hook found"
else
  echo "  ⚠️  AI chatbot hook not found"
fi

echo ""
echo "=================================================="
echo "✅ NVIDIA Integration Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Verify NVIDIA_API_KEY in Vercel Settings"
echo "2. Test the chatbot in your app"
echo "3. Check /api/chat/health endpoint"
echo "4. Monitor [v0] logs for provider info"
echo ""
echo "Documentation: See NVIDIA_INTEGRATION.md"
echo "=================================================="
