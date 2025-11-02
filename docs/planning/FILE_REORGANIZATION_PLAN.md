# 📁 File Reorganization Plan

**Date:** November 2, 2025
**Status:** Proposed - Awaiting approval
**Reason:** Project has grown significantly with only basic features complete. Better organization needed for scalability.

---

## 🎯 Goals

1. **Reduce clutter** - Move rarely-used files to appropriate directories
2. **Improve discoverability** - Group related files together
3. **Better naming** - Clearer, more consistent naming conventions
4. **Scalability** - Prepare for future features and team collaboration

---

## 📋 Current Issues

### Documentation Scattered
- Multiple README files in root (README.md, README_PERFORMANCE.md, README_SECURITY.md)
- Audit files mixed with code (AUDIT_SUMMARY.txt, SECURITY_AUDIT_REPORT.md, etc.)
- Development docs in "For Me/" folder

### Components Not Well Organized
- All studio components in flat structure (components/studio/)
- Pipeline components in subfolder but others aren't
- Modal components scattered (AddClientModal, EditClientModal, AppointmentModal, etc.)

### Public Assets
- Duplicate folders (gifs, gifs 2, screenshots, screenshots 2) - **CLEANED**
- Images in app/images AND public/

### Database Files
- Migration backups (.bak files) cluttering migrations folder
- Seed data not separated from schema

---

## 🗂️ Proposed Structure

### 1. Root Level - Clean & Minimal
```
sis-website/
├── app/                    # Next.js app directory (NO CHANGE)
├── components/             # React components (REORGANIZED - see below)
├── lib/                    # Utilities and helpers (NO CHANGE)
├── public/                 # Static assets (REORGANIZED - see below)
├── supabase/              # Database files (CLEANED)
├── docs/                   # 📁 NEW - All documentation
├── .env.local
├── .gitignore
├── next.config.ts
├── package.json
├── README.md              # Main readme only
├── tailwind.config.ts
└── tsconfig.json
```

### 2. Documentation Reorganization
```
docs/
├── README.md                       # Index of all documentation
├── development/
│   ├── ARCHITECTURE.md            # MOVED from root
│   ├── DEVELOPMENT_SETUP.md       # MOVED from For Me/
│   ├── STYLING_GUIDE.md           # MOVED from For Me/
│   ├── UI_COMPONENTS_CHEATSHEET.md # MOVED from For Me/
│   └── SESSION_CONTEXT.md         # MOVED from For Me/
├── database/
│   ├── DATABASE_GUIDE.md          # MOVED from For Me/
│   ├── DATA_ISOLATION_SECURITY.md # MOVED from For Me/
│   └── RLS_POLICIES_EXPLAINED.md  # MOVED from For Me/
├── audits/
│   ├── PERFORMANCE_AUDIT.md       # MOVED from root + For Me/
│   ├── SECURITY_AUDIT_REPORT.md   # MOVED from root
│   ├── SECURITY_ISSUES_BY_FILE.md # MOVED from root
│   ├── AUDIT_SUMMARY.txt          # MOVED from root
│   └── SECURITY_AUDIT_SUMMARY.txt # MOVED from root
├── planning/
│   ├── MISSION_TRACKER.md         # MOVED from For Me/
│   ├── POST_MVP_FEATURES.md       # MOVED from For Me/
│   ├── MONTHLY_GOALS.md           # MOVED from For Me/
│   ├── APPOINTMENTS_PLAN.md       # MOVED from For Me/
│   ├── LANDING_PAGE_STATUS.md     # MOVED from For Me/
│   └── COLOR_SYSTEM.md            # MOVED from For Me/
└── onboarding/
    ├── START_HERE.md              # RENAMED from START_HERE_WHEN_YOU_RETURN.md
    └── FIXES_COMPLETED.md         # MOVED from root
```

### 3. Components Reorganization
```
components/
├── features/                      # 📁 NEW - Feature-specific components
│   ├── dashboard/
│   │   ├── AccomplishmentsList.tsx    # MOVED from studio/
│   │   ├── DailyTasksList.tsx         # MOVED from studio/
│   │   ├── RemindersList.tsx          # MOVED from studio/
│   │   └── DashboardInfoBanner.tsx    # MOVED from studio/
│   ├── calendar/
│   │   ├── Calendar.tsx               # MOVED from studio/
│   │   ├── CalendarWrapper.tsx        # MOVED from studio/
│   │   └── AppointmentModal.tsx       # MOVED from studio/
│   ├── pipeline/
│   │   ├── PipelineBoard.client.tsx   # MOVED from studio/pipeline/
│   │   ├── PipelineColumns.client.tsx # MOVED from studio/pipeline/
│   │   ├── DraggableCard.client.tsx   # MOVED from studio/pipeline/
│   │   └── PipelineStats.client.tsx   # MOVED from studio/
│   ├── clients/
│   │   ├── AddClientModal.tsx         # MOVED from studio/
│   │   ├── EditClientModal.tsx        # MOVED from studio/
│   │   └── ClientList.tsx             # Future component
│   └── workers/
│       ├── ArtistsPage.tsx            # MOVED from studio/
│       ├── AddWorkerModal.tsx         # MOVED from studio/
│       └── EditWorkerModal.tsx        # MOVED from studio/
├── auth/                          # NO CHANGE - Already well organized
│   ├── LoginForm.tsx
│   ├── SignUpForm.tsx
│   ├── LogoutButton.tsx
│   ├── ForgotPasswordForm.tsx
│   └── UpdatePasswordForm.tsx
├── layout/                        # SIMPLIFIED
│   ├── navbar/                    # Navbar components (NO CHANGE)
│   ├── ConditionalNavbar.tsx
│   ├── Container.tsx              # RENAMED (remove .server)
│   └── Section.tsx                # RENAMED (remove .server)
├── ui/                            # NO CHANGE - Already well organized
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── ...
├── shared/                        # 📁 NEW - Shared across features
│   ├── ModalCard.tsx              # MOVED from studio/
│   ├── Card.tsx                   # MOVED from studio/
│   └── CheckList.tsx              # MOVED from studio/
└── contact/                       # NO CHANGE
    └── ContactModal.tsx
```

### 4. Public Assets Cleanup
```
public/
├── assets/                        # 📁 NEW - Organized by type
│   ├── images/
│   │   └── dashboard.png          # MOVED from screenshots/
│   └── gifs/
│       ├── create-client.gif      # CONSOLIDATED
│       ├── drag-drop.gif
│       ├── edit-client.gif
│       └── demo.gif
└── CAPTURE_INSTRUCTIONS.md        # Keep for reference
```

**Delete from app/images/**: Move to public/assets/ and update references

### 5. Supabase Cleanup
```
supabase/
├── migrations/
│   ├── 00_initial_schema.sql
│   ├── 02_add_pipeline_tracking.sql
│   ├── 03_change_contact_number_to_text.sql
│   ├── 04_disable_rls_local_dev.sql
│   ├── 05_enhance_workers_and_appointments.sql
│   └── 06_dashboard_features.sql
├── archive/                       # 📁 NEW - Old/backup files
│   ├── 20251012_cleanup_database_schema.sql.bak
│   └── 20251014215637_allow_users_to_create_shops.sql.bak
├── config.toml
└── seed.sql
```

---

## 🚀 Implementation Plan

### Phase 1: Documentation (Low Risk)
- [ ] Create `docs/` directory structure
- [ ] Move all markdown files from "For Me/"
- [ ] Move audit files from root
- [ ] Update any cross-references
- [ ] Delete "For Me/" folder

### Phase 2: Public Assets (Low Risk)
- [ ] Create `public/assets/` structure
- [ ] Move images from app/images/ to public/assets/images/
- [ ] Update image references in components
- [ ] Delete old image directories
- [ ] Test build

### Phase 3: Supabase Cleanup (Low Risk)
- [ ] Create `supabase/archive/` folder
- [ ] Move .bak files to archive
- [ ] Verify migrations still work

### Phase 4: Components (MEDIUM RISK - Test Thoroughly)
- [ ] Create new `components/features/` structure
- [ ] Move components one feature at a time
- [ ] Update all imports after each move
- [ ] Test each feature after move
- [ ] Run full build and test suite
- [ ] Delete old studio/ folder when complete

### Phase 5: Naming Cleanup (Low Risk)
- [ ] Remove `.server` and `.client` extensions (Next.js 15 doesn't need them)
- [ ] Standardize component names
- [ ] Update imports

---

## ⚠️ Risks & Mitigation

### Risk 1: Breaking Imports
**Mitigation:**
- Move one folder at a time
- Test after each move
- Use TypeScript to catch import errors
- Keep git commit history clean for easy rollback

### Risk 2: Build Failures
**Mitigation:**
- Run `npm run build` after each major change
- Test in development before committing
- Keep deployments separate from reorganization

### Risk 3: Lost Files
**Mitigation:**
- Git commit before starting
- Don't delete until confirmed working
- Keep "For Me/" folder until docs/ verified

---

## 📊 Benefits

### Immediate
- Cleaner root directory
- Better documentation discoverability
- Easier to find components
- Professional structure for potential team members

### Long-term
- Easier to add new features
- Better for collaboration
- Clearer separation of concerns
- Improved maintainability

---

## 🎯 Success Criteria

- [ ] Root directory has < 15 files
- [ ] All documentation in `docs/` folder
- [ ] Components grouped by feature
- [ ] No duplicate files
- [ ] Build passes without errors
- [ ] All routes still work
- [ ] Performance unchanged

---

## 🤔 Questions for Davin

1. **Urgency**: Do this now or wait until after Polar integration?
2. **Scope**: Full reorganization or just documentation cleanup first?
3. **Naming**: Keep `.client`/`.server` suffixes or remove them?
4. **Components**: Agree with features/ grouping or prefer different organization?

---

**Recommendation:** Start with Phase 1 (documentation) and Phase 3 (supabase cleanup) as they are low-risk and provide immediate benefits. Save component reorganization for after Polar integration is complete.

**Estimated Time:**
- Phase 1: 30 minutes
- Phase 2: 45 minutes
- Phase 3: 15 minutes
- Phase 4: 2-3 hours (careful testing needed)
- Phase 5: 1 hour

**Total: ~5 hours for full reorganization**
