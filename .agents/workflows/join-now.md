---
description: Onboarding flow for new gym members
---

# Member Onboarding Workflow

This workflow describes the process of converting a visitor into an elite gym member through the GYMOS platform.

## 1. Landing Page conversion
When a user clicks the **"Join Now"** button in the navbar:
- The `JoinNowModal` is triggered.
- User provides their **Name** and **Mobile Number**.
- User selects a membership tier: **Elite Monthly**, **Pro Quarterly**, or **Titan Yearly**.

## 2. Lead Generation
- Upon confirmation, the system generates a unique **Reference ID**.
- This data should be sent to the backend `/api/leads` (to be implemented if persistence is needed).
- The user is instructed to visit the front desk for biometric enrollment.

## 3. Physical Enrollment (Admin Side)
- The admin uses the **Admin Portal** (`/admin/members`) to create a new member record.
- Match the visitor's mobile number with their lead data.
- Capture biometric/photo data if necessary.
- The member is now active in the system.

## 4. Digital Activation
- The new member can now log in at `/member/login` using their mobile number.
- They gain access to their **Dashboard** where they can see their status, expiry date, and upcoming events.
- They can start using the **Attendance Scanner** (`/member/attendance`) immediately.

// turbo
## Verification
To verify the conversion flow:
1. Navigate to the landing page root `/`.
2. Click **Join Now**.
3. Complete the 3-step form.
4. Ensure the success message displays the correct plan and a generated Reference ID.
