# Settings Views Design (Frontend & Backend Integration)

This document explains the structure, data flow, and backend integration of the settings views. These components use the `FormView` abstraction and are fully wired to persist changes to the backend and update the UI in real time.

---

## 1. File/Component Relationship

```mermaid
graph TD
  Settings --> SettingsOrg
  Settings --> SettingsUser
  Settings --> SettingsApp
  SettingsOrg --> FormView
  SettingsUser --> FormView
  SettingsApp --> FormView
  FormView --> Form
  SettingsOrg --> GetOrgPreferences
  SettingsOrg --> SetOrgPreferences
  SettingsUser --> GetUserPreferences
  SettingsUser --> SetUserPreferences
  SettingsApp --> GetAppPreferences
  SettingsApp --> SetAppPreferences
```

---

## 2. Data & Event Lifecycle: How Settings Work

```mermaid
sequenceDiagram
  participant User
  participant SettingsOrg as SettingsOrg.tsx
  participant Backend as Go Preferences
  User->>SettingsOrg: Open Org tab
  SettingsOrg->>Backend: GetOrgPreferences()
  Backend-->>SettingsOrg: OrgPreferences JSON
  SettingsOrg->>FormView: Render formFields
  User->>FormView: Edit fields, press Save
  FormView->>SettingsOrg: onSubmit(formData)
  SettingsOrg->>Backend: SetOrgPreferences(formData)
  Backend-->>SettingsOrg: Save confirmation
  SettingsOrg->>FormView: Update UI with new data
```

**Narrative:**

- When a user opens a settings tab, the component fetches the relevant preferences from the backend (Go).
- The data is mapped to form fields and rendered using `FormView`.
- When the user edits and saves, the new data is sent to the backend, persisted, and the UI is updated.

---

## 3. Preferences Structure (Backend)

```mermaid
classDiagram
  class OrgPreferences {
    string Version
    bool Telemetry
    string Theme
    string Language
    string DeveloperName
    string LogLevel
    bool Experimental
    string SupportURL
  }
  class UserPreferences {
    string Version
    string Theme
    string Language
    string Name
    string Email
    Chain[] Chains
  }
  class AppPreferences {
    string Version
    string Name
    Bounds Bounds
    string[] RecentProjects
    string LastView
    map~string,string~ LastTab
    bool MenuCollapsed
    bool HelpCollapsed
  }
```

---

## 4. Rendering & Update Logic

```mermaid
flowchart TD
  SettingsOrg -->|fetch| GetOrgPreferences
  GetOrgPreferences -->|returns| OrgPreferences
  OrgPreferences -->|map| formFields
  formFields --> FormView
  FormView -->|onSubmit| SettingsOrg
  SettingsOrg -->|save| SetOrgPreferences
  SetOrgPreferences -->|writes| org_prefs.json
  SetOrgPreferences -->|confirms| SettingsOrg
  SettingsOrg -->|update| FormView
```

---

## 5. Backend Persistence

- Preferences are stored as JSON files on disk (e.g., `org_prefs.json`, `user_prefs.json`, `app_prefs.json`).
- Each `Get*Preferences` function loads and parses the file, returning a struct.
- Each `Set*Preferences` function serializes the struct and writes it to disk.
- The backend ensures directories exist and handles errors gracefully.

---

## 6. Real-Time UI Update

- After saving, the frontend updates its state with the new preferences.
- If the user cancels, the form resets to the last saved state.
- Status messages are emitted for user feedback.

---

## Summary

- **SettingsOrg**, **SettingsUser**, and **SettingsApp** are entry points for editing organization, user, and app preferences.
- Each uses `FormView` and is fully integrated with backend Go code for persistence.
- The system ensures that changes are immediately reflected in both the backend and the UI.
- No files in `./frontend/wails` are documented here, as they are auto-generated.
