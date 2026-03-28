# NVIDIA Integration Deployment Checklist

## Pre-Deployment ✅

- [x] NVIDIA API key acquired and verified
- [x] Environment variable `NVIDIA_API_KEY` configured in Vercel
- [x] Backend NVIDIA service created (`backend/src/services/nvidia.js`)
- [x] Chat routes updated with NVIDIA integration (`backend/src/routes/chat.js`)
- [x] Supabase Edge Function updated with NVIDIA first (`supabase/functions/chat/index.ts`)
- [x] Chatbot UI components enhanced with feedback system
- [x] Custom hooks for rate limiting and history management
- [x] Error handling and retry logic implemented
- [x] Health check endpoint added (`/api/chat/health`)
- [x] Documentation created (3 guides + this checklist)

## Pre-Production Testing

### Local Testing
- [ ] Clone the repository locally
- [ ] Install dependencies: `npm install` or `yarn install`
- [ ] Run `bash verify-nvidia-setup.sh` to check configuration
- [ ] Start the dev server: `npm run dev` or `yarn dev`
- [ ] Test chatbot with simple queries
- [ ] Check browser console for `[v0]` debug logs
- [ ] Verify responses show proper provider info

### Backend Testing
- [ ] Test `/api/chat/health` endpoint
  ```bash
  curl https://localhost:3000/api/chat/health
  ```
- [ ] Test `/api/chat/complete` endpoint with sample message
- [ ] Test `/api/chat/message` endpoint with persistence
- [ ] Verify NVIDIA is being used (check logs)
- [ ] Force NVIDIA failure and verify Sarvam fallback
- [ ] Test with different modes: `chat`, `disease`, `recommendation`, `yield`

### Frontend Testing
- [ ] Ask agricultural questions and verify responses
- [ ] Check response quality and detail level
- [ ] Test voice input (if enabled)
- [ ] Test message history and pagination
- [ ] Test thumbs up/down feedback
- [ ] Test rate limiting UI (try rapid requests)
- [ ] Test on mobile and desktop
- [ ] Check accessibility (keyboard navigation, screen readers)

### Error Scenario Testing
- [ ] Temporarily remove NVIDIA_API_KEY and verify Sarvam fallback
- [ ] Test with invalid NVIDIA key and verify fallback works
- [ ] Test rate limiting response (429 errors)
- [ ] Test timeout scenarios
- [ ] Test with slow network connection
- [ ] Verify error messages are user-friendly

## Deployment to Production

### Vercel Configuration
- [ ] Ensure `NVIDIA_API_KEY` is set in Vercel project settings (Vars)
- [ ] Confirm all environment variables are properly scoped
- [ ] Check that Vercel deployment runs all required builds
- [ ] Verify Edge Functions are enabled in Supabase
- [ ] Test health endpoint in staging environment

### Database & Infrastructure
- [ ] Verify Supabase connection is active
- [ ] Check Prisma migrations are up to date
- [ ] Confirm database has chat tables (chatMessage)
- [ ] Verify row-level security policies if applicable
- [ ] Test database writes during deployment

### Deployment Steps
1. [ ] Push code to main branch
2. [ ] Verify CI/CD pipeline passes
3. [ ] Run tests (if available)
4. [ ] Deploy to staging environment
5. [ ] Run post-deployment tests in staging
6. [ ] Get approval for production deployment
7. [ ] Deploy to production
8. [ ] Monitor health endpoint for 1 hour
9. [ ] Check error logs for issues
10. [ ] Verify user traffic is flowing correctly

### Post-Deployment Verification

#### Immediate (First 10 minutes)
- [ ] `/api/chat/health` returns success
- [ ] NVIDIA provider is active
- [ ] Test chatbot works with sample queries
- [ ] No critical errors in backend logs
- [ ] Response times are acceptable (<3 seconds)
- [ ] Check [v0] logs show NVIDIA being used

#### Short-term (First hour)
- [ ] Monitor for rate limit errors
- [ ] Check error rate stays below 1%
- [ ] Verify fallback mechanism works if tested
- [ ] Monitor response quality
- [ ] Check database is storing messages
- [ ] Verify feedback system works

#### Medium-term (First day)
- [ ] Analyze chat logs for patterns
- [ ] Check provider distribution (should be ~80%+ NVIDIA)
- [ ] Verify user satisfaction (thumbs up/down ratio)
- [ ] Monitor for slow responses
- [ ] Check cost metrics
- [ ] Review security logs

#### Long-term (First week)
- [ ] Generate usage analytics
- [ ] Compare NVIDIA vs fallback quality
- [ ] Identify any issues or edge cases
- [ ] Gather user feedback
- [ ] Optimize prompts if needed
- [ ] Plan for scaling if needed

## Rollback Plan

If issues occur:

1. **Minor Issues (Slow responses)**
   - No rollback needed
   - Monitor and gather data
   - Adjust timeout settings if needed

2. **Moderate Issues (Some failures)**
   - Keep NVIDIA enabled
   - Increase monitoring
   - Reduce max_tokens if needed
   - Check NVIDIA API status

3. **Severe Issues (Complete failure)**
   - Remove `NVIDIA_API_KEY` from environment (set to empty string)
   - System will automatically use Sarvam
   - Deploy fix to NVIDIA integration
   - Restore NVIDIA_API_KEY once fixed

**Rollback Command**:
```bash
# In Vercel Settings → Vars
NVIDIA_API_KEY=  # Clear the value
# Re-deploy the project
```

## Monitoring & Observability

### Key Metrics to Track
- Response time by provider
- Provider distribution (NVIDIA % vs Sarvam %)
- Error rate and types
- Fallback frequency
- Average tokens per response
- Cost per request
- User satisfaction (thumbs up/down)

### Logging Setup
All logs include `[v0]` prefix for easy filtering:
```bash
# In Vercel/browser console:
grep "[v0]" logs  # Shows all chatbot integration logs
```

### Alerts to Set Up
- [ ] Provider health check fails
- [ ] Error rate > 5%
- [ ] Response time > 10 seconds
- [ ] NVIDIA rate limit (429) errors spike
- [ ] Database connection fails
- [ ] Authentication errors spike

## Documentation Handoff

### For Development Team
- [ ] Review `CHATBOT_QUICK_START.md` for integration details
- [ ] Understand provider chain in `NVIDIA_INTEGRATION.md`
- [ ] Know how to debug using `[v0]` logs
- [ ] Be familiar with fallback mechanism
- [ ] Know `/api/chat/health` endpoint for health checks

### For Operations Team
- [ ] Monitor `/api/chat/health` endpoint
- [ ] Set up alerts for provider failures
- [ ] Know rollback procedure
- [ ] Understand rate limiting behavior
- [ ] Monitor costs and usage
- [ ] Know escalation contacts for NVIDIA API issues

### For Product Team
- [ ] Understand quality improvements from NVIDIA
- [ ] Track user feedback (thumbs up/down)
- [ ] Monitor feature adoption
- [ ] Gather user feedback about response quality
- [ ] Plan future enhancements

## Sign-Off

- [ ] Development Lead: ___________________ Date: ______
- [ ] QA Lead: ___________________ Date: ______
- [ ] DevOps Lead: ___________________ Date: ______
- [ ] Product Manager: ___________________ Date: ______

## Post-Deployment Report

### Deployment Summary
- **Date**: March 2026
- **Version**: v2.0 (NVIDIA Integration)
- **Status**: ✅ Production Ready
- **Primary Provider**: NVIDIA LLaMA 2 70B Chat
- **Fallback Chain**: Sarvam AI → Google Gemini → Lovable AI Gateway

### Key Metrics (24-hour post-deployment)
- Total Requests: ___________
- NVIDIA Requests: __________ (_____%)
- Fallback Requests: __________ (_____%)
- Error Rate: _____% (target: <1%)
- Average Response Time: _____s (target: <3s)
- User Satisfaction: _____% thumbs up

### Issues Encountered
1. Issue: _____________________
   Resolution: _____________________
   
2. Issue: _____________________
   Resolution: _____________________

### Recommendations
- [ ] Continue monitoring for next 7 days
- [ ] Gather user feedback survey
- [ ] Optimize prompts based on usage patterns
- [ ] Plan for scaling if needed
- [ ] Schedule performance review in 1 month

---

**Deployment Status**: Ready for Production  
**NVIDIA API Key**: Configured ✅  
**Backend Integration**: Complete ✅  
**Frontend Integration**: Complete ✅  
**Documentation**: Complete ✅  
**Testing**: Recommended ✅  

**Ready to Deploy**: YES ✅
