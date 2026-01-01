# IELTS Prep Platform - Technical Master File
## Complete Low-Level System Specification
### Version: 2.0 | Date: 2026-01-01 | Total Lines: 7000+

---

# TABLE OF CONTENTS

1. [System Overview](#1-system-overview)
2. [Technology Stack](#2-technology-stack)
3. [Database Schema (Supabase)](#3-database-schema-supabase)
4. [Edge Functions & API Logic](#4-edge-functions--api-logic)
5. [Authentication & Security](#5-authentication--security)
6. [IELTS Logic Engine](#6-ielts-logic-engine)
7. [Frontend Architecture](#7-frontend-architecture)
8. [External Integrations](#8-external-integrations)
9. [File Storage Architecture](#9-file-storage-architecture)
10. [UI/UX Design Patterns](#10-uiux-design-patterns)
11. [AI Content Generation](#11-ai-content-generation)
12. [Complete Function Reference](#12-complete-function-reference)
13. [Known Technical Debt](#13-known-technical-debt)

---

# 1. SYSTEM OVERVIEW

## 1.1 Purpose
An AI-powered IELTS preparation platform supporting all four modules:
- **Reading** - Passage-based comprehension tests
- **Listening** - Audio-based comprehension tests  
- **Writing** - Essay/report tasks with AI evaluation
- **Speaking** - Voice recording with AI evaluation

## 1.2 Core Features
- Admin-created official IELTS tests (Cambridge style)
- AI-generated practice tests (via Gemini API)
- Real-time scoring with IELTS band calculation
- AI-powered explanations for wrong answers
- Flashcard system for vocabulary
- Analytics dashboard for performance tracking
- Test state preservation across sessions
- Multi-part audio playback with timestamps
- Word highlighting and note-taking

## 1.3 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + Vite)                      │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ Reading  │  │ Listening│  │ Writing  │  │ Speaking │            │
│  │  Module  │  │  Module  │  │  Module  │  │  Module  │            │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘            │
│       │             │             │             │                   │
│       └─────────────┴──────┬──────┴─────────────┘                   │
│                            │                                        │
│                    ┌───────▼───────┐                                │
│                    │  TanStack     │                                │
│                    │  Query Cache  │                                │
│                    └───────┬───────┘                                │
└────────────────────────────┼────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SUPABASE BACKEND                                  │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ Auth (JWT)   │  │ PostgreSQL   │  │ Storage      │              │
│  │ + RLS        │  │ Database     │  │ (5 Buckets)  │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    EDGE FUNCTIONS (Deno)                       │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│ │
│  │  │generate-ai-     │  │evaluate-writing-│  │evaluate-speaking││ │
│  │  │practice         │  │submission       │  │submission       ││ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘│ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│ │
│  │  │explain-answer   │  │analyze-         │  │generate-gemini- ││ │
│  │  │                 │  │performance      │  │tts              ││ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘│ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    GOOGLE GEMINI API                                 │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ Text Gen     │  │ TTS Audio    │  │ Vision       │              │
│  │ (2.5-flash)  │  │ (preview-tts)│  │ (multimodal) │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
```

---

# 2. TECHNOLOGY STACK

## 2.1 Frontend

```
Framework:        React 18.3.1
Build Tool:       Vite
Language:         TypeScript 5.4.5
Styling:          Tailwind CSS + shadcn/ui components
State Management: TanStack Query (React Query) 5.83.0
Routing:          React Router DOM 6.30.1
Forms:            React Hook Form + Zod validation
Charts:           Recharts 2.15.4
Animations:       Tailwind CSS Animate
Toast:            Sonner 1.7.4
Date Handling:    date-fns 3.6.0
```

## 2.2 Backend

```
Database:         Supabase (PostgreSQL)
Auth:             Supabase Auth (Email/Password + OAuth ready)
Storage:          Supabase Storage (5 buckets)
Edge Functions:   Deno (20 functions)
AI Gateway:       Google Gemini API (user-provided keys)
```

## 2.3 Complete Dependencies List

```json
{
  "@hookform/resolvers": "^3.10.0",
  "@radix-ui/react-accordion": "^1.2.11",
  "@radix-ui/react-alert-dialog": "^1.1.14",
  "@radix-ui/react-aspect-ratio": "^1.1.7",
  "@radix-ui/react-avatar": "^1.1.10",
  "@radix-ui/react-checkbox": "^1.3.2",
  "@radix-ui/react-collapsible": "^1.1.11",
  "@radix-ui/react-context-menu": "^2.2.15",
  "@radix-ui/react-dialog": "^1.1.14",
  "@radix-ui/react-dropdown-menu": "^2.1.15",
  "@radix-ui/react-hover-card": "^1.1.14",
  "@radix-ui/react-label": "^2.1.7",
  "@radix-ui/react-menubar": "^1.1.15",
  "@radix-ui/react-navigation-menu": "^1.2.13",
  "@radix-ui/react-popover": "^1.1.14",
  "@radix-ui/react-progress": "^1.1.7",
  "@radix-ui/react-radio-group": "^1.3.7",
  "@radix-ui/react-scroll-area": "^1.2.9",
  "@radix-ui/react-select": "^2.2.5",
  "@radix-ui/react-separator": "^1.1.7",
  "@radix-ui/react-slider": "^1.3.5",
  "@radix-ui/react-slot": "^1.2.3",
  "@radix-ui/react-switch": "^1.2.5",
  "@radix-ui/react-tabs": "^1.1.12",
  "@radix-ui/react-toast": "^1.2.14",
  "@radix-ui/react-toggle": "^1.1.9",
  "@radix-ui/react-toggle-group": "^1.1.10",
  "@radix-ui/react-tooltip": "^1.2.7",
  "@supabase/supabase-js": "^2.86.2",
  "@tanstack/react-query": "^5.83.0",
  "@testing-library/dom": "^10.4.1",
  "@testing-library/jest-dom": "^6.9.1",
  "@testing-library/react": "^16.3.1",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "cmdk": "^1.1.1",
  "date-fns": "^3.6.0",
  "embla-carousel-react": "^8.6.0",
  "input-otp": "^1.4.2",
  "lucide-react": "^0.462.0",
  "next-themes": "^0.3.0",
  "react": "^18.3.1",
  "react-day-picker": "^8.10.1",
  "react-dom": "^18.3.1",
  "react-hook-form": "^7.61.1",
  "react-resizable-panels": "^2.1.9",
  "react-router-dom": "^6.30.1",
  "recharts": "^2.15.4",
  "sonner": "^1.7.4",
  "tailwind-merge": "^2.6.0",
  "tailwindcss-animate": "^1.0.7",
  "vaul": "^0.9.9",
  "zod": "^3.25.76"
}
```

---

# 3. DATABASE SCHEMA (SUPABASE)

## 3.1 User & Auth Tables

### `profiles`
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | - | Primary key, references auth.users |
| email | text | Yes | - | User email |
| full_name | text | Yes | - | Display name |
| avatar_url | text | Yes | - | Profile image URL |
| created_at | timestamptz | No | now() | Account creation |
| updated_at | timestamptz | No | now() | Last update |

**RLS Policies:**
```sql
-- SELECT: Users can view their own profile
USING (auth.uid() = id)

-- INSERT: Users can create their own profile
WITH CHECK (auth.uid() = id)

-- UPDATE: Users can update their own profile
USING (auth.uid() = id)

-- DELETE: Disabled
```

**Trigger:**
```sql
-- Automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### `admin_users`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| user_id | uuid | No | - (FK to profiles) |
| created_at | timestamptz | No | now() |

**RLS Policies:**
```sql
-- SELECT: Only admins can view admin list
USING (is_admin(auth.uid()))

-- INSERT/UPDATE/DELETE: Disabled (manual DB management only)
```

### `subscriptions`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| user_id | uuid | No | - |
| plan_name | text | No | - |
| price | numeric | No | - |
| status | enum | No | 'pending' |
| start_date | timestamptz | No | now() |
| end_date | timestamptz | No | - |

**Status Enum:** `active | cancelled | expired | pending`

**RLS Policies:**
```sql
-- SELECT: Users can view their own subscriptions
USING (auth.uid() = user_id)

-- INSERT: Users can create their own subscriptions
WITH CHECK (auth.uid() = user_id)

-- UPDATE/DELETE: Disabled
```

### `promotions`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| name | text | No | - |
| description | text | Yes | - |
| is_active | boolean | No | true |
| start_date | timestamptz | No | - |
| end_date | timestamptz | No | - |

**RLS Policies:**
```sql
-- SELECT: Anyone can view active promotions
USING (is_active = true AND start_date <= now() AND end_date >= now())

-- INSERT/UPDATE/DELETE: Disabled (admin only via service role)
```

---

## 3.2 Reading Module Tables

### `reading_tests`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| title | text | No | - |
| book_name | text | No | - |
| test_number | integer | No | - |
| test_type | text | No | 'academic' |
| time_limit | integer | No | 60 |
| total_questions | integer | No | 40 |
| is_published | boolean | No | true |
| created_at | timestamptz | No | now() |
| updated_at | timestamptz | No | now() |

**RLS Policies:**
```sql
-- SELECT (Public): Anyone can view published tests
USING (is_published = true)

-- SELECT (Admin): Admins can view all tests
USING (is_admin(auth.uid()))

-- INSERT/UPDATE/DELETE: Admins only
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()))
```

### `reading_passages`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| test_id | uuid | No | - (FK) |
| passage_number | integer | No | - |
| title | text | No | - |
| content | text | No | - |
| show_labels | boolean | No | true |
| created_at | timestamptz | No | now() |

### `reading_paragraphs`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| passage_id | uuid | No | - (FK) |
| label | text | No | - |
| content | text | No | - |
| is_heading | boolean | No | false |
| order_index | integer | No | - |

### `reading_question_groups`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| passage_id | uuid | No | - (FK) |
| question_type | text | No | - |
| instruction | text | Yes | - |
| start_question | integer | No | - |
| end_question | integer | No | - |
| options | jsonb | Yes | - |
| display_as_paragraph | boolean | Yes | false |
| show_bullets | boolean | Yes | false |
| show_headings | boolean | Yes | false |
| use_dropdown | boolean | Yes | false |

**Supported Question Types (18 total):**
```typescript
type ReadingQuestionType =
  | 'TRUE_FALSE_NOT_GIVEN'
  | 'YES_NO_NOT_GIVEN'
  | 'MULTIPLE_CHOICE'
  | 'MULTIPLE_CHOICE_SINGLE'
  | 'MULTIPLE_CHOICE_MULTIPLE'
  | 'MATCHING_HEADINGS'
  | 'MATCHING_INFORMATION'
  | 'MATCHING_FEATURES'
  | 'MATCHING_SENTENCE_ENDINGS'
  | 'FILL_IN_BLANK'
  | 'SENTENCE_COMPLETION'
  | 'SUMMARY_COMPLETION'
  | 'SUMMARY_WORD_BANK'
  | 'NOTE_COMPLETION'
  | 'TABLE_COMPLETION'
  | 'FLOWCHART_COMPLETION'
  | 'MAP_LABELING'
  | 'SHORT_ANSWER';
```

### `reading_questions`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| passage_id | uuid | No | - (FK) |
| question_group_id | uuid | Yes | - |
| question_number | integer | No | - |
| question_text | text | No | - |
| question_type | text | No | - |
| correct_answer | text | No | - |
| options | jsonb | Yes | - |
| option_format | text | Yes | 'A' |
| heading | text | Yes | - |
| instruction | text | Yes | - |
| table_data | jsonb | Yes | - |

### `reading_test_submissions`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| test_id | uuid | No | - (FK) |
| user_id | uuid | No | - |
| answers | jsonb | No | '{}' |
| score | integer | No | 0 |
| total_questions | integer | No | 40 |
| band_score | numeric | Yes | - |
| completed_at | timestamptz | No | now() |

**RLS Policies:**
```sql
-- SELECT: Users can view their own + anyone can view top scores
USING (auth.uid() = user_id OR true)

-- INSERT: Users can create their own submissions
WITH CHECK (auth.uid() = user_id)

-- UPDATE/DELETE: Disabled
```

---

## 3.3 Listening Module Tables

### `listening_tests`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| title | text | No | - |
| book_name | text | No | - |
| test_number | integer | No | - |
| test_type | text | No | 'academic' |
| time_limit | integer | No | 30 |
| total_questions | integer | No | 40 |
| is_published | boolean | No | false |
| audio_url | text | Yes | - |
| audio_url_part1 | text | Yes | - |
| audio_url_part2 | text | Yes | - |
| audio_url_part3 | text | Yes | - |
| audio_url_part4 | text | Yes | - |
| transcript_part1 | text | Yes | - |
| transcript_part2 | text | Yes | - |
| transcript_part3 | text | Yes | - |
| transcript_part4 | text | Yes | - |

### `listening_question_groups`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| test_id | uuid | No | - (FK) |
| question_type | text | No | - |
| instruction | text | Yes | - |
| start_question | integer | No | - |
| end_question | integer | No | - |
| options | jsonb | Yes | - |
| group_heading | text | Yes | - |
| group_heading_alignment | text | Yes | 'center' |
| start_timestamp_seconds | numeric | Yes | - |

**Listening Question Types (12 total):**
```typescript
type ListeningQuestionType =
  | 'FILL_IN_BLANK'
  | 'MULTIPLE_CHOICE_SINGLE'
  | 'MULTIPLE_CHOICE_MULTIPLE'
  | 'MATCHING_CORRECT_LETTER'
  | 'TABLE_COMPLETION'
  | 'FLOWCHART_COMPLETION'
  | 'NOTE_COMPLETION'
  | 'MAP_LABELING'
  | 'DRAG_AND_DROP_OPTIONS'
  | 'SENTENCE_COMPLETION'
  | 'SHORT_ANSWER'
  | 'SUMMARY_COMPLETION';
```

### `listening_questions`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| group_id | uuid | No | - (FK) |
| question_number | integer | No | - |
| question_text | text | No | - |
| correct_answer | text | No | - |
| options | jsonb | Yes | - |
| option_format | text | Yes | 'A' |
| heading | text | Yes | - |
| is_given | boolean | No | false |
| table_data | jsonb | Yes | - |

### `listening_test_submissions`
Same structure as reading_test_submissions.

---

## 3.4 Writing Module Tables

### `writing_tests`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| title | text | No | - |
| description | text | Yes | - |
| time_limit | integer | No | 60 |
| is_published | boolean | No | false |

### `writing_tasks`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| writing_test_id | uuid | Yes | - (FK) |
| task_type | enum | No | - |
| instruction | text | No | - |
| text_content | text | Yes | - |
| image_url | text | Yes | - |
| image_width | integer | Yes | - |
| image_height | integer | Yes | - |
| word_limit_min | integer | No | 150 |
| word_limit_max | integer | Yes | - |

**Task Type Enum:** `task1 | task2`

### `writing_submissions`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| task_id | uuid | No | - (FK) |
| user_id | uuid | No | - |
| submission_text | text | No | - |
| word_count | integer | No | - |
| overall_band | numeric | Yes | - |
| evaluation_report | jsonb | Yes | - |
| submitted_at | timestamptz | Yes | now() |

**Evaluation Report Structure:**
```typescript
interface WritingEvaluationReport {
  task_achievement_response: {
    band: number;          // 0-9, 0.5 increments
    strengths: string;     // Markdown with **bold** and ==highlights==
    weaknesses: string;
    suggestions_for_improvement: string;
  };
  coherence_and_cohesion: {
    band: number;
    strengths: string;
    weaknesses: string;
    suggestions_for_improvement: string;
  };
  lexical_resource: {
    band: number;
    strengths: string;
    weaknesses: string;
    suggestions_for_improvement: string;
  };
  grammatical_range_and_accuracy: {
    band: number;
    strengths: string;
    weaknesses: string;
    suggestions_for_improvement: string;
  };
  overall_suggestions: string;
}
```

---

## 3.5 Speaking Module Tables

### `speaking_tests`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| name | text | No | - |
| description | text | Yes | - |
| test_type | text | No | 'academic' |
| is_published | boolean | No | false |

### `speaking_question_groups`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| test_id | uuid | No | - (FK) |
| part_number | integer | No | - |
| instruction | text | Yes | - |
| cue_card_topic | text | Yes | - |
| cue_card_content | text | Yes | - |
| time_limit_seconds | integer | Yes | - |
| preparation_time_seconds | integer | Yes | - |
| speaking_time_seconds | integer | Yes | - |
| total_part_time_limit_seconds | integer | Yes | - |
| min_required_questions | integer | Yes | - |
| options | jsonb | Yes | - |

### `speaking_questions`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| group_id | uuid | No | - (FK) |
| question_number | integer | No | - |
| question_text | text | No | - |
| order_index | integer | No | - |
| is_required | boolean | No | true |

### `speaking_submissions`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| test_id | uuid | No | - (FK) |
| user_id | uuid | No | - |
| audio_url_part1 | text | Yes | - |
| audio_url_part2 | text | Yes | - |
| audio_url_part3 | text | Yes | - |
| transcript_part1 | text | Yes | - |
| transcript_part2 | text | Yes | - |
| transcript_part3 | text | Yes | - |
| overall_band | numeric | Yes | - |
| evaluation_report | jsonb | Yes | - |
| submitted_at | timestamptz | Yes | now() |

**Speaking Evaluation Report Structure:**
```typescript
interface SpeakingEvaluationReport {
  fluency_coherence: {
    band: number;
    strengths: string;
    weaknesses: string;
    suggestions_for_improvement: string;
  };
  lexical_resource: {
    band: number;
    strengths: string;
    weaknesses: string;
    suggestions_for_improvement: string;
  };
  grammatical_range_accuracy: {
    band: number;
    strengths: string;
    weaknesses: string;
    suggestions_for_improvement: string;
  };
  pronunciation: {
    band: number;
    strengths: string;
    weaknesses: string;
    suggestions_for_improvement: string;
  };
  part_by_part_analysis: {
    part1: { summary: string; strengths: string; weaknesses: string; };
    part2: { topic_coverage: string; organization_quality: string; cue_card_fulfillment: string; };
    part3: { depth_of_discussion: string; question_notes: string; };
  };
  improvement_recommendations: string[];
  strengths_to_maintain: string[];
  examiner_notes: string;
  transcripts: Record<string, string>;  // "part1-q{id}": "transcript text"
}
```

---

## 3.6 AI Practice Tables

### `ai_practice_tests`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| user_id | uuid | No | - |
| module | text | No | - |
| topic | text | No | - |
| question_type | text | No | - |
| difficulty | text | No | - |
| time_minutes | integer | No | - |
| total_questions | integer | No | - |
| payload | jsonb | No | '{}' |
| audio_url | text | Yes | - |
| audio_format | text | Yes | - |
| sample_rate | integer | Yes | - |
| generated_at | timestamptz | No | now() |

**Payload Structure (varies by module):**
```typescript
// Reading Payload
interface ReadingPayload {
  passage: {
    title: string;
    content: string;  // With [A], [B], [C] paragraph labels
  };
  instruction: string;
  questions: Array<{
    question_number: number;
    question_text: string;
    correct_answer: string;
    explanation: string;
    options?: string[];
    heading?: string;
  }>;
  headings?: Array<{ id: string; text: string }>;  // For matching headings
  options?: Array<{ letter: string; text: string }>;  // For matching info
  display_options?: {
    display_as_paragraph?: boolean;
    show_bullets?: boolean;
    show_headings?: boolean;
    note_style_enabled?: boolean;
    note_categories?: Array<{
      title: string;
      items: Array<{ text_before: string; question_number: number; text_after: string }>;
    }>;
  };
}

// Listening Payload
interface ListeningPayload {
  dialogue: string;  // "Speaker1: ...\nSpeaker2: ..."
  speaker_names: Record<string, string>;  // { "Speaker1": "Manager", "Speaker2": "Client" }
  instruction: string;
  questions: Array<{
    question_number: number;
    question_text: string;
    correct_answer: string;
    explanation: string;
    options?: string[];
  }>;
  options?: string[];  // For matching types
  drag_options?: string[];  // For drag-and-drop
  flowchart_steps?: Array<{
    id: string;
    text: string;
    hasBlank: boolean;
    blankNumber?: number;
  }>;
  flowchart_title?: string;
  distractor_options?: string[];
  note_sections?: Array<{
    title: string;
    items: Array<{ text_before: string; question_number: number; text_after: string }>;
  }>;
  map_labels?: Array<{ id: string; text: string }>;
  landmarks?: Array<{ id: string; text: string }>;
  map_description?: string;
  table_headers?: string[];
  table_rows?: Array<{ label: string; cells: string[] }>;
}

// Writing Task 1 Payload
interface WritingTask1Payload {
  instruction: string;
  visual_description: string;  // Natural language description
  chart_data?: {
    type: 'BAR_CHART' | 'LINE_GRAPH' | 'PIE_CHART' | 'TABLE' | 'PROCESS_DIAGRAM' | 'MAP' | 'MIXED_CHARTS';
    title: string;
    subtitle?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    data?: Array<{ label: string; value: number; color?: string }>;
    series?: Array<{ name: string; data: Array<{ x: string; y: number }> }>;
    rows?: string[][];
    headers?: string[];
    steps?: Array<{ label: string; description?: string }>;
    mapData?: {
      before?: { year: string; features: Array<{ label: string; type: string }> };
      after?: { year: string; features: Array<{ label: string; type: string }> };
    };
    charts?: ChartData[];  // For mixed charts
  };
}

// Writing Task 2 Payload
interface WritingTask2Payload {
  instruction: string;
  essay_question: string;
}

// Speaking Payload
interface SpeakingPayload {
  part1: {
    instruction: string;
    questions: Array<{ question_number: number; question_text: string }>;
    time_per_question_seconds: number;
  };
  part2: {
    cue_card_topic: string;
    cue_card_content: string;  // Bullet points
    preparation_time_seconds: number;
    speaking_time_seconds: number;
  };
  part3: {
    instruction: string;
    questions: Array<{ question_number: number; question_text: string }>;
    time_per_question_seconds: number;
  };
}
```

### `ai_practice_results`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| test_id | uuid | No | - (FK) |
| user_id | uuid | No | - |
| module | text | No | - |
| answers | jsonb | No | '{}' |
| question_results | jsonb | No | '[]' |
| score | integer | No | 0 |
| total_questions | integer | No | 0 |
| band_score | numeric | Yes | - |
| time_spent_seconds | integer | No | 0 |
| completed_at | timestamptz | No | now() |

### `ai_practice_topic_completions`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| user_id | uuid | No | - |
| module | text | No | - |
| topic | text | No | - |
| completed_count | integer | No | 0 |
| updated_at | timestamptz | No | now() |

**Unique Constraint:** `(user_id, module, topic)`

---

## 3.7 Supporting Tables

### `flashcard_decks`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| user_id | uuid | No | - |
| name | text | No | - |
| description | text | Yes | - |

### `flashcard_cards`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| deck_id | uuid | No | - (FK) |
| user_id | uuid | No | - |
| word | text | No | - |
| meaning | text | No | - |
| example | text | Yes | - |
| translation | text | Yes | - |
| status | text | No | 'learning' |
| review_count | integer | No | 0 |
| correct_count | integer | No | 0 |
| next_review_at | timestamptz | Yes | - |

### `user_secrets`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| user_id | uuid | No | - |
| secret_name | text | No | - |
| encrypted_value | text | No | - |

**Purpose:** Stores user's Gemini API key (encrypted with AES-GCM)

### `gemini_daily_usage`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| user_id | uuid | No | - |
| usage_date | date | No | CURRENT_DATE |
| tokens_used | integer | No | 0 |
| requests_count | integer | No | 0 |

**Unique Constraint:** `(user_id, usage_date)`

### `user_analytics`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| user_id | uuid | No | - |
| module_type | text | No | - |
| tests_analyzed | integer | No | 0 |
| analysis_data | jsonb | No | '{}' |
| generated_at | timestamptz | No | now() |

### `test_results`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| user_id | uuid | No | - |
| test_type | text | No | - |
| answers | jsonb | Yes | - |
| score | numeric | Yes | - |
| band_score | numeric | Yes | - |
| feedback | jsonb | Yes | - |
| completed_at | timestamptz | No | now() |

---

## 3.8 Database Functions

### `is_admin(check_user_id uuid) → boolean`
```sql
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = check_user_id
  );
$$;
```

### `has_active_subscription(p_user_id uuid) → boolean`
```sql
CREATE OR REPLACE FUNCTION public.has_active_subscription(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = p_user_id
      AND status = 'active'
      AND end_date > now()
  );
$$;
```

### `is_promotion_active() → boolean`
```sql
CREATE OR REPLACE FUNCTION public.is_promotion_active()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.promotions
    WHERE is_active = true
      AND start_date <= now()
      AND end_date >= now()
  );
$$;
```

### `can_user_submit(p_user_id uuid) → boolean`
```sql
CREATE OR REPLACE FUNCTION public.can_user_submit(p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    p_user_id IS NOT NULL 
    AND (
      public.has_active_subscription(p_user_id) 
      OR public.is_promotion_active()
    );
$$;
```

### `increment_topic_completion(p_user_id, p_module, p_topic)`
```sql
CREATE OR REPLACE FUNCTION public.increment_topic_completion(
  p_user_id uuid, 
  p_module text, 
  p_topic text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.ai_practice_topic_completions (user_id, module, topic, completed_count)
  VALUES (p_user_id, p_module, p_topic, 1)
  ON CONFLICT (user_id, module, topic)
  DO UPDATE SET 
    completed_count = ai_practice_topic_completions.completed_count + 1,
    updated_at = now();
END;
$$;
```

### `handle_new_user() → trigger`
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', '')
  );
  RETURN NEW;
END;
$$;
```

### `update_updated_at_column() → trigger`
```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
```

---

# 4. EDGE FUNCTIONS & API LOGIC

## 4.1 Function Overview

| Function | JWT Required | Purpose | Lines of Code |
|----------|--------------|---------|---------------|
| `generate-ai-practice` | Yes | Generate AI practice tests | ~2700 |
| `evaluate-writing-submission` | Yes | AI evaluation of writing | ~430 |
| `evaluate-speaking-submission` | Yes | AI evaluation of speaking | ~500 |
| `evaluate-ai-practice-writing` | Yes | Evaluate AI practice writing | ~350 |
| `evaluate-ai-speaking-part` | Yes | Evaluate individual speaking parts | ~300 |
| `evaluate-ai-speaking` | Yes | Full speaking evaluation | ~400 |
| `explain-answer` | No | Explain wrong answers | ~240 |
| `explain-answer-followup` | Yes | Follow-up explanations | ~200 |
| `analyze-performance` | Yes | Generate analytics | ~350 |
| `translate-word` | No | Word translation | ~150 |
| `generate-listening-audio` | Yes | TTS audio generation | ~400 |
| `generate-gemini-tts` | Yes | Gemini TTS | ~300 |
| `transcribe-listening-audio` | No | Audio transcription | ~250 |
| `analyze-listening-audio` | Yes | Audio analysis | ~200 |
| `import-full-listening-test` | No | Bulk import tests | ~500 |
| `import-listening-audio` | No | Import audio files | ~300 |
| `admin-listening-action` | No | Admin actions | ~250 |
| `set-user-gemini-api-key` | Yes | Store encrypted API key | ~150 |
| `gemini-quota` | Yes | Check quota usage | ~100 |
| `ai-speaking-session` | Yes | Live speaking session | ~350 |

---

## 4.2 generate-ai-practice (Core Function - 2700+ lines)

### Location
`supabase/functions/generate-ai-practice/index.ts`

### Model Selection & Fallback Logic
```typescript
// Gemini models sorted by performance for IELTS generation
const GEMINI_MODELS = [
  'gemini-2.5-flash',      // Primary: best balance for IELTS generation
  'gemini-2.5-pro',        // High quality fallback 
  'gemini-2.0-flash',      // Fast reliable fallback
  'gemini-2.0-flash-lite', // Emergency fallback (lower quality but fast)
];
```

### Gemini API Call Configuration
```typescript
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,        // Balanced creativity/consistency
        maxOutputTokens: 8192,   // Allow long responses for passages
      },
    }),
  }
);
```

### Pre-flight API Validation
```typescript
// Validates API key using lightweight /models endpoint before generation
async function preflightApiCheck(apiKey: string, skipPreflight: boolean = false): Promise<{ ok: boolean; error?: string }> {
  if (skipPreflight) return { ok: true };
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=1`,
    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorStatus = errorData?.error?.status || '';
    
    if (response.status === 403 || errorStatus === 'PERMISSION_DENIED') {
      return { ok: false, error: 'API_KEY_INVALID: Your Gemini API key appears to be invalid...' };
    }
  }
  return { ok: true };
}
```

### Rate Limiting & Retry Logic
```typescript
async function waitWithBackoff(attempt: number, baseDelayMs: number = 1000): Promise<void> {
  const delay = Math.min(baseDelayMs * Math.pow(2, attempt), 30000); // Max 30 seconds
  console.log(`Waiting ${delay}ms before retry (attempt ${attempt + 1})...`);
  await new Promise(resolve => setTimeout(resolve, delay));
}

// In callGemini function:
for (const model of GEMINI_MODELS) {
  let retryCount = 0;
  while (retryCount <= maxRetries) {
    try {
      const response = await fetch(...);
      if (!response.ok) {
        if (response.status === 429 || errorStatus === 'RESOURCE_EXHAUSTED') {
          if (retryCount < maxRetries) {
            await waitWithBackoff(retryCount);
            retryCount++;
            continue;
          }
          isQuotaExceeded = true;
          break; // Try next model
        }
        break; // Non-recoverable error, try next model
      }
      // Success
      return text;
    } catch (err) {
      await waitWithBackoff(retryCount);
      retryCount++;
    }
  }
}
```

### JSON Extraction from Gemini Response
```typescript
function extractJsonFromResponse(text: string): string {
  if (!text || typeof text !== 'string') {
    throw new Error('Empty or invalid response from AI');
  }
  
  // 1. Try markdown code blocks: ```json ... ```
  const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    const extracted = codeBlockMatch[1].trim();
    if (extracted.startsWith('{') || extracted.startsWith('[')) {
      return extracted;
    }
  }
  
  // 2. Try finding JSON object directly: { ... }
  const jsonObjectMatch = text.match(/\{[\s\S]*\}/);
  if (jsonObjectMatch) return jsonObjectMatch[0];
  
  // 3. Try finding JSON array: [ ... ]
  const jsonArrayMatch = text.match(/\[[\s\S]*\]/);
  if (jsonArrayMatch) return jsonArrayMatch[0];
  
  // 4. Last resort: return trimmed text
  const trimmed = text.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return trimmed;
  }
  
  throw new Error('Could not extract valid JSON from AI response');
}
```

### Reading Question Type Prompts (Complete List)

```typescript
// TRUE_FALSE_NOT_GIVEN
function getReadingPrompt(questionType: string, topic: string, difficulty: string, questionCount: number) {
  const difficultyDesc = difficulty === 'easy' ? 'Band 5-5.5' : 
                         difficulty === 'medium' ? 'Band 6-6.5' : 
                         difficulty === 'hard' ? 'Band 7-7.5' : 
                         'Band 8-9 (Expert level)';
  
  const basePrompt = `Generate an IELTS Academic Reading test with the following specifications:

Topic: ${topic}
Difficulty: ${difficulty} (${difficultyDesc})

Requirements:
1. Create a reading passage with these specifications:
   - Total word count: approximately 750 words
   - Number of paragraphs: 6 paragraphs, labeled [A], [B], [C], [D], [E], [F]
   - Academic in tone and style
   - Well-structured with clear paragraph labels
`;

  switch (questionType) {
    case 'TRUE_FALSE_NOT_GIVEN':
      return basePrompt + `2. Create ${questionCount} True/False/Not Given questions...
      
Return ONLY valid JSON in this exact format:
{
  "passage": {
    "title": "The title of the passage",
    "content": "The full passage text with paragraph labels..."
  },
  "instruction": "Do the following statements agree with the information...",
  "questions": [
    {
      "question_number": 1,
      "question_text": "Statement about the passage",
      "correct_answer": "TRUE",
      "explanation": "Why this is the correct answer"
    }
  ]
}`;

    case 'MATCHING_HEADINGS':
      return basePrompt + `2. Create a matching headings question...
{
  "passage": {...},
  "instruction": "Choose the correct heading for each paragraph...",
  "headings": [
    {"id": "i", "text": "First heading option"},
    {"id": "ii", "text": "Second heading option"}
  ],
  "questions": [
    {"question_number": 1, "question_text": "Paragraph A", "correct_answer": "ii", "explanation": "..."}
  ]
}`;

    case 'FILL_IN_BLANK':
      // Randomly select display variation and word limit
      const fillVariations = ['standard', 'paragraph', 'bullets', 'headings', 'note_style'];
      const selectedVariation = fillVariations[Math.floor(Math.random() * fillVariations.length)];
      const wordLimitOptions = [1, 2, 3];
      const selectedWordLimit = wordLimitOptions[Math.floor(Math.random() * wordLimitOptions.length)];
      
      return basePrompt + `2. Create ${questionCount} fill-in-the-blank questions.

CRITICAL WORD LIMIT RULE:
- Maximum word limit: ${selectedWordLimit} word(s) per answer
- Every answer MUST be ${selectedWordLimit === 1 ? 'exactly 1 word' : `1-${selectedWordLimit} words`}
...`;

    // ... 15 more question types with similar detailed prompts
  }
}
```

### Listening TTS Configuration
```typescript
interface SpeakerVoiceConfig {
  gender: 'male' | 'female';
  accent: string;
  voiceName: string;
}

// Available Gemini TTS voices
const GEMINI_VOICES = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Aoede', 'Leda'];

// TTS API Call
async function generateAudio(
  apiKey: string, 
  script: string, 
  speakerConfig?: SpeakerConfigInput,
  maxRetries = 3
): Promise<{ audioBase64: string; sampleRate: number } | null> {
  const ttsPrompt = useTwoSpeakers
    ? `Read the following conversation slowly and clearly, as if for a language listening test...`
    : `Read the following monologue slowly and clearly...`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: ttsPrompt }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: useTwoSpeakers 
            ? {
                multiSpeakerVoiceConfig: {
                  speakerVoiceConfigs: [
                    { speaker: "Speaker1", voiceConfig: { prebuiltVoiceConfig: { voiceName: speaker1Voice } } },
                    { speaker: "Speaker2", voiceConfig: { prebuiltVoiceConfig: { voiceName: speaker2Voice } } },
                  ],
                },
              }
            : {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: speaker1Voice } },
              },
        },
      }),
    }
  );

  const data = await response.json();
  const audioData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  
  return audioData ? { audioBase64: audioData, sampleRate: 24000 } : null;
}
```

### Writing Task 1 Visual Generation
```typescript
// Chart types for Task 1
type ChartType = 'BAR_CHART' | 'LINE_GRAPH' | 'PIE_CHART' | 'TABLE' | 'PROCESS_DIAGRAM' | 'MAP' | 'MIXED_CHARTS';

// JSON schema for visual data
const writingTask1Prompt = `Generate an IELTS Writing Task 1 with a ${chartType}.

Return JSON with this structure:
{
  "instruction": "The ${chartType.toLowerCase()} shows...",
  "visual_description": "Detailed description of what the chart shows...",
  "chart_data": {
    "type": "${chartType}",
    "title": "Chart title",
    "subtitle": "Data source/year",
    "xAxisLabel": "Category",
    "yAxisLabel": "Percentage (%)",
    "data": [
      {"label": "Category A", "value": 45},
      {"label": "Category B", "value": 30}
    ]
  }
}`;
```

---

## 4.3 evaluate-writing-submission

### Location
`supabase/functions/evaluate-writing-submission/index.ts`

### Model Fallback Order (Extended)
```typescript
const GEMINI_MODELS_FALLBACK_ORDER = [
  'gemini-2.5-pro',
  'gemini-pro-latest',
  'gemini-3-pro-preview',
  'gemini-exp-1206',
  'gemini-2.5-flash',
  'gemini-flash-latest',
  'gemini-2.0-flash',
  'gemini-2.0-flash-001',
  'gemini-2.5-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-2.0-flash-lite-001',
  'gemini-2.0-flash-lite',
  'gemma-3-27b-it',
  'gemma-3-12b-it',
  'gemma-3-4b-it',
  'gemma-3-1b-it',
  'gemma-3n-e4b-it',
  'gemma-3n-e2b-it'
];
```

### System Prompt (Writing Evaluation)
```typescript
const prompt = `You are an expert IELTS writing examiner and a supportive English teacher. 
Please provide a detailed evaluation of your student's IELTS ${task.task_type === 'task1' ? 'Task 1 Report' : 'Task 2 Essay'} submission.

IMPORTANT: Write your feedback as a teacher speaking directly to the student. 
Use "you" and "your" when addressing them. 
Do NOT use technical terms like "prompt" - instead say "the question", "the task", or "what was asked".

**When providing strengths, weaknesses, and suggestions, use markdown for emphasis:**
- Wrap **important words or phrases** in double asterisks for bolding
- Wrap ==key terms or examples== in double equals signs for highlighting

Evaluation Criteria (each with Band 0-9, 0.5 increments):
1. Task Achievement/Response
2. Coherence and Cohesion
3. Lexical Resource
4. Grammatical Range and Accuracy
5. Overall Suggestions for Improvement

${task.task_type === 'task1' ? `This is Task 1. The student should describe a visual (chart, graph, diagram, map, or process).
${imageBase64 ? 'I have provided the actual image. Evaluate how accurately the student has described it.' : ''}` : 
`This is Task 2. The student should respond to the essay question.`}

Task Instructions: "${task.instruction}"
Student's Submission: "${submission.submission_text}"
Word Count: ${submission.submission_text.split(/\s+/).filter(Boolean).length}
Minimum Word Limit: ${task.word_limit_min}

Format response as JSON:
{
  "overall_band": number,
  "evaluation_report": {
    "task_achievement_response": {
      "band": number,
      "strengths": string,
      "weaknesses": string,
      "suggestions_for_improvement": string
    },
    "coherence_and_cohesion": {...},
    "lexical_resource": {...},
    "grammatical_range_and_accuracy": {...},
    "overall_suggestions": string
  }
}`;
```

### Vision Integration for Task 1
```typescript
// Fetch and encode image for vision-enabled evaluation
if (task.task_type === 'task1' && task.image_url) {
  const imageResponse = await fetch(task.image_url);
  if (imageResponse.ok) {
    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBytes = new Uint8Array(imageBuffer);
    let binary = '';
    for (let i = 0; i < imageBytes.length; i++) {
      binary += String.fromCharCode(imageBytes[i]);
    }
    imageBase64 = btoa(binary);
  }
}

// Include in Gemini request
const parts: any[] = [{ text: prompt }];
if (imageBase64 && task.task_type === 'task1') {
  let mimeType = 'image/png';
  if (task.image_url?.includes('.jpg')) mimeType = 'image/jpeg';
  
  parts.push({
    inline_data: {
      mime_type: mimeType,
      data: imageBase64
    }
  });
}
```

### Submission Cleanup Logic
```typescript
// Keep only the last 3 submissions per user per test
const sortedAttemptTimestamps = Array.from(attemptsMap.keys())
  .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

if (sortedAttemptTimestamps.length > 3) {
  const timestampsToDelete = sortedAttemptTimestamps.slice(3);
  const submissionIdsToDelete = timestampsToDelete.flatMap(ts => attemptsMap.get(ts) || []);
  
  await supabaseClient
    .from('writing_submissions')
    .delete()
    .in('id', submissionIdsToDelete);
}
```

---

## 4.4 evaluate-speaking-submission

### Location
`supabase/functions/evaluate-speaking-submission/index.ts`

### Audio Processing
```typescript
// Build contents array with audio for each question
const contents: Array<{ parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> }> = [];

questionGroups?.forEach(group => {
  group.speaking_questions?.forEach(question => {
    const audioKey = `part${group.part_number}-q${question.id}`;
    
    if (audioData[audioKey]) {
      const audioBase64 = audioData[audioKey].split(',')[1];
      
      // Validate audio has actual content (not empty recording)
      if (audioBase64 && audioBase64.length > 1000) {
        contents.push({ parts: [{ text: `Your Audio Response for Question ${question.question_number}:` }] });
        contents.push({ parts: [{ inlineData: { mimeType: 'audio/webm', data: audioBase64 } }] });
        contents.push({ parts: [{ text: `Provide transcript using key "${audioKey}"...` }] });
      } else {
        contents.push({ parts: [{ text: `Empty/silent recording for Q${question.question_number}. Score as 0.` }] });
      }
    }
  });
});
```

### Evaluation Criteria
```typescript
const evaluationPrompt = `
**Evaluation Criteria:**

1. **Fluency and Coherence**: Band 0-9
   - Speaking smoothly, logically, connecting ideas
   - Pauses, repetition, unclear connections

2. **Lexical Resource**: Band 0-9
   - Range of vocabulary
   - Accuracy and appropriateness

3. **Grammatical Range and Accuracy**: Band 0-9
   - Variety of grammatical structures
   - Accuracy and control

4. **Pronunciation**: Band 0-9
   - Clarity and understandability
   - Intonation and stress patterns

**Part-by-Part Analysis:**
- Part 1: Introduction & Interview (summary, strengths, weaknesses)
- Part 2: Individual Long Turn (topic coverage, organization, cue card fulfillment)
- Part 3: Two-way Discussion (depth, question handling)

**Include in response:**
{
  "overall_band": number,
  "evaluation_report": {
    "fluency_coherence": {...},
    "lexical_resource": {...},
    "grammatical_range_accuracy": {...},
    "pronunciation": {...},
    "part_by_part_analysis": {...},
    "improvement_recommendations": string[],
    "strengths_to_maintain": string[],
    "examiner_notes": string,
    "transcripts": {
      "part1-q[id]": "Transcript...",
      "part2-q[id]": "Transcript...",
      "part3-q[id]": "Transcript..."
    }
  }
}`;
```

---

## 4.5 explain-answer

### Location
`supabase/functions/explain-answer/index.ts`

### System Prompt
```typescript
const systemPrompt = `You are an expert ${testTypeLabel} tutor. Your task is to explain 
${isCorrect ? 'why a student\'s answer was correct' : 'why a student\'s answer was incorrect'} 
in a helpful and educational way.

Guidelines:
- Be concise but thorough (4-6 sentences)
- ${isCorrect 
    ? 'Explain what made this the correct answer and reinforce the key concept' 
    : 'IMPORTANT: First explain specifically why the student\'s answer is wrong. Then explain why the correct answer is right.'}
- ${testType === 'listening' 
    ? 'Reference the specific part of the transcript that contains the answer' 
    : 'Reference the specific part of the passage that supports the answer'}
- Provide helpful tips for similar questions in the future
- Be encouraging and supportive
- Use simple, clear language
- If the provided "correct answer" seems wrong, mention this and suggest reporting to admin
`;
```

### Special Handling: MCQ Multiple
```typescript
if (isMCQMultiple) {
  const userAnswers: string[] = userAnswer.split(',').map(a => a.trim());
  const correctAnswersArr: string[] = correctAnswer.split(',').map(a => a.trim());
  
  const correctOnes = userAnswers.filter(a => correctAnswersArr.includes(a));
  const wrongOnes = userAnswers.filter(a => !correctAnswersArr.includes(a));
  const missedOnes = correctAnswersArr.filter(a => !userAnswers.includes(a));
  
  mcqMultipleGuidelines = `
This is a MULTIPLE CHOICE MULTIPLE ANSWERS question.
- Student selected: ${userAnswers.join(', ') || '(none)'}
- Correct answers: ${correctAnswersArr.join(', ')}
- Correctly identified: ${correctOnes.join(', ') || '(none)'}
- Incorrectly selected: ${wrongOnes.join(', ') || '(none)'}
- Missed: ${missedOnes.join(', ') || '(none)'}

Address each selection individually.`;
}
```

---

# 5. AUTHENTICATION & SECURITY

## 5.1 Authentication Flow

### Location
`src/hooks/useAuth.tsx`

### Implementation
```typescript
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Set up auth state listener FIRST (important for race conditions)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // 2. THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { full_name: fullName }
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Dev Bypass Mode
```typescript
// For development/testing - bypasses real authentication
const BYPASS_AUTH = false; // Set to true to bypass

const MOCK_USER: User = {
  id: '00000000-0000-0000-0000-000000000000',
  email: 'dev@example.com',
  user_metadata: { full_name: 'Dev User' },
  // ...
};
```

---

## 5.2 API Key Encryption

### Encryption Algorithm
- **Method:** AES-GCM (Galois/Counter Mode)
- **Key Size:** 256-bit (32 bytes)
- **IV Size:** 12 bytes (randomly generated per encryption)
- **Storage Format:** Base64 encoded (IV + ciphertext concatenated)

### Encryption (Edge Function: set-user-gemini-api-key)
```typescript
async function encryptApiKey(apiKeyValue: string, encryptionKey: string): Promise<string> {
  const encoder = new TextEncoder();
  
  // Generate random IV (12 bytes for AES-GCM)
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // Import encryption key (use first 32 bytes)
  const keyData = encoder.encode(encryptionKey);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData.slice(0, 32),
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );
  
  // Encrypt the API key
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    encoder.encode(apiKeyValue)
  );
  
  // Combine IV + ciphertext and encode as base64
  const combined = new Uint8Array([...iv, ...new Uint8Array(encrypted)]);
  return btoa(String.fromCharCode(...combined));
}
```

### Decryption (Edge Functions)
```typescript
async function decryptApiKey(encryptedValue: string, encryptionKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  
  // Decode from base64
  const combined = Uint8Array.from(atob(encryptedValue), c => c.charCodeAt(0));
  
  // Extract IV (first 12 bytes) and ciphertext
  const iv = combined.slice(0, 12);
  const encryptedData = combined.slice(12);
  
  // Import decryption key
  const keyData = encoder.encode(encryptionKey);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData.slice(0, 32),
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );
  
  // Decrypt
  const decryptedData = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    cryptoKey,
    encryptedData
  );
  
  return decoder.decode(decryptedData);
}
```

### Environment Variable
```
app_encryption_key  # Stored as Supabase Edge Function secret
                    # Must be at least 32 characters
```

---

## 5.3 Row Level Security (RLS) Patterns

### Pattern 1: User-Owned Data
```sql
-- Applied to: profiles, subscriptions, flashcard_*, ai_practice_*, user_secrets, gemini_daily_usage

-- SELECT
CREATE POLICY "Users can view their own data"
ON table_name FOR SELECT
USING (auth.uid() = user_id);

-- INSERT
CREATE POLICY "Users can create their own data"
ON table_name FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE
CREATE POLICY "Users can update their own data"
ON table_name FOR UPDATE
USING (auth.uid() = user_id);

-- DELETE (often disabled)
CREATE POLICY "Users can delete their own data"
ON table_name FOR DELETE
USING (auth.uid() = user_id);
```

### Pattern 2: Admin Access
```sql
-- Applied to: reading_tests, listening_tests, writing_tests, speaking_tests, admin_users

-- SELECT/INSERT/UPDATE/DELETE
CREATE POLICY "Admins can manage content"
ON table_name FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));
```

### Pattern 3: Published Content (Public Read)
```sql
-- Applied to: all test tables and their related questions

-- Public view of published content
CREATE POLICY "Anyone can view published content"
ON table_name FOR SELECT
USING (is_published = true);

-- Nested check for related tables
CREATE POLICY "Anyone can view related published content"
ON child_table FOR SELECT
USING (EXISTS (
  SELECT 1 FROM parent_table
  WHERE parent_table.id = child_table.parent_id
    AND parent_table.is_published = true
));
```

### Pattern 4: Submission Tables
```sql
-- Applied to: *_test_submissions tables

-- Users view their own + public leaderboard
CREATE POLICY "Users can view their own submissions"
ON submissions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view top scores"
ON submissions FOR SELECT
USING (true);

-- Only insert own submissions
CREATE POLICY "Users can create their own submissions"
ON submissions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- No update/delete allowed
```

---

# 6. IELTS LOGIC ENGINE

## 6.1 Answer Validation

### Location
`src/lib/ieltsAnswerValidation.ts` (1052 lines)

### Main Function
```typescript
export function checkIeltsAnswer(userAnswer: string, correctAnswers: string): boolean {
  if (!userAnswer || !correctAnswers) return false;

  const user = normalizeString(userAnswer);
  
  // Split correct answers by "/" for alternatives
  const rawAnswers = correctAnswers.split('/').map(a => a.trim());
  
  for (const rawCorrect of rawAnswers) {
    // Handle optional words: (the) hospital
    const { allVariations } = parseOptionalWords(rawCorrect);
    
    for (const correct of allVariations) {
      const normalizedCorrect = normalizeString(correct);
      
      // 1. EXACT MATCH (case-insensitive)
      if (user === normalizedCorrect) return true;

      // 2. MATCH WITHOUT SPACES
      if (removeAllSpaces(user) === removeAllSpaces(normalizedCorrect)) return true;

      // 3. SPELLING VARIATIONS (British/American)
      if (matchWithSpellingVariations(user, normalizedCorrect)) return true;

      // 4. DATE FORMAT VARIATIONS
      if (matchDate(user, normalizedCorrect)) return true;

      // 5. TIME FORMAT VARIATIONS
      if (matchTime(user, normalizedCorrect)) return true;

      // 6. NUMBER FORMAT VARIATIONS
      if (matchNumber(user, normalizedCorrect)) return true;

      // 6b. NUMBER + TEXT VARIATIONS
      if (matchNumberWithText(user, normalizedCorrect)) return true;

      // 7. MEASUREMENT VARIATIONS
      if (matchMeasurement(user, normalizedCorrect)) return true;

      // 8. CURRENCY VARIATIONS
      if (matchCurrency(user, normalizedCorrect)) return true;

      // 9. PHONE NUMBER VARIATIONS
      if (matchPhoneNumber(user, normalizedCorrect)) return true;

      // 10. ALPHANUMERIC CODE VARIATIONS
      if (matchAlphanumericCode(user, normalizedCorrect)) return true;

      // 11. HYPHEN/SPACE VARIATIONS
      if (matchWithHyphens(user, normalizedCorrect)) return true;

      // 12. ARTICLE VARIATIONS ("the", "a", "an")
      const withoutArticle = (s: string) => s.replace(/^(the|a|an)\s+/, '');
      if (withoutArticle(user) === withoutArticle(normalizedCorrect)) return true;
    }
  }
  return false;
}
```

### Complete Spelling Variations Dictionary (100+ words)
```typescript
const SPELLING_VARIATIONS: Record<string, string[]> = {
  // -our/-or variations
  colour: ['colour', 'color'],
  honour: ['honour', 'honor'],
  favour: ['favour', 'favor'],
  behaviour: ['behaviour', 'behavior'],
  neighbour: ['neighbour', 'neighbor'],
  labour: ['labour', 'labor'],
  harbour: ['harbour', 'harbor'],
  vapour: ['vapour', 'vapor'],
  flavour: ['flavour', 'flavor'],
  rumour: ['rumour', 'rumor'],
  humour: ['humour', 'humor'],
  tumour: ['tumour', 'tumor'],
  
  // -ise/-ize variations
  organise: ['organise', 'organize'],
  organisation: ['organisation', 'organization'],
  realise: ['realise', 'realize'],
  recognise: ['recognise', 'recognize'],
  analyse: ['analyse', 'analyze'],
  apologise: ['apologise', 'apologize'],
  characterise: ['characterise', 'characterize'],
  criticise: ['criticise', 'criticize'],
  emphasise: ['emphasise', 'emphasize'],
  specialise: ['specialise', 'specialize'],
  standardise: ['standardise', 'standardize'],
  summarise: ['summarise', 'summarize'],
  prioritise: ['prioritise', 'prioritize'],
  visualise: ['visualise', 'visualize'],
  minimise: ['minimise', 'minimize'],
  maximise: ['maximise', 'maximize'],
  utilise: ['utilise', 'utilize'],
  
  // -re/-er variations
  centre: ['centre', 'center'],
  metre: ['metre', 'meter'],
  litre: ['litre', 'liter'],
  theatre: ['theatre', 'theater'],
  fibre: ['fibre', 'fiber'],
  calibre: ['calibre', 'caliber'],
  
  // -ogue/-og variations
  catalogue: ['catalogue', 'catalog'],
  dialogue: ['dialogue', 'dialog'],
  analogue: ['analogue', 'analog'],
  prologue: ['prologue', 'prolog'],
  
  // -ence/-ense variations
  defence: ['defence', 'defense'],
  offence: ['offence', 'offense'],
  licence: ['licence', 'license'],
  pretence: ['pretence', 'pretense'],
  
  // -ll-/-l- variations
  travelling: ['travelling', 'traveling'],
  traveller: ['traveller', 'traveler'],
  cancelled: ['cancelled', 'canceled'],
  cancelling: ['cancelling', 'canceling'],
  labelled: ['labelled', 'labeled'],
  modelling: ['modelling', 'modeling'],
  counsellor: ['counsellor', 'counselor'],
  jewellery: ['jewellery', 'jewelry'],
  
  // Other variations
  grey: ['grey', 'gray'],
  programme: ['programme', 'program'],
  cheque: ['cheque', 'check'],
  tyre: ['tyre', 'tire'],
  aluminium: ['aluminium', 'aluminum'],
  aeroplane: ['aeroplane', 'airplane'],
  storey: ['storey', 'story'],
  plough: ['plough', 'plow'],
  mould: ['mould', 'mold'],
  doughnut: ['doughnut', 'donut'],
  practise: ['practise', 'practice'],
  focussed: ['focussed', 'focused'],
  ageing: ['ageing', 'aging'],
  judgement: ['judgement', 'judgment'],
  acknowledgement: ['acknowledgement', 'acknowledgment'],
  learnt: ['learnt', 'learned'],
  burnt: ['burnt', 'burned'],
  dreamt: ['dreamt', 'dreamed'],
  spelt: ['spelt', 'spelled'],
  smelt: ['smelt', 'smelled'],
};
```

### Number Word Mapping (Complete)
```typescript
const NUMBER_WORDS: Record<string, string[]> = {
  '0': ['zero', 'o', 'oh', '0', 'nil', 'nought'],
  '1': ['one', '1', 'a'],
  '2': ['two', '2'],
  '3': ['three', '3'],
  '4': ['four', '4'],
  '5': ['five', '5'],
  '6': ['six', '6'],
  '7': ['seven', '7'],
  '8': ['eight', '8'],
  '9': ['nine', '9'],
  '10': ['ten', '10'],
  '11': ['eleven', '11'],
  '12': ['twelve', '12'],
  '13': ['thirteen', '13'],
  '14': ['fourteen', '14'],
  '15': ['fifteen', '15'],
  '16': ['sixteen', '16'],
  '17': ['seventeen', '17'],
  '18': ['eighteen', '18'],
  '19': ['nineteen', '19'],
  '20': ['twenty', '20'],
  '21': ['twenty-one', 'twenty one', 'twentyone', '21'],
  '22': ['twenty-two', 'twenty two', 'twentytwo', '22'],
  // ... up to 31
  '30': ['thirty', '30'],
  '40': ['forty', '40'],
  '50': ['fifty', '50'],
  '60': ['sixty', '60'],
  '70': ['seventy', '70'],
  '80': ['eighty', '80'],
  '90': ['ninety', '90'],
  '100': ['hundred', 'one hundred', 'a hundred', '100'],
  '1000': ['thousand', 'one thousand', 'a thousand', '1000', '1,000'],
  '1000000': ['million', 'one million', 'a million', '1000000', '1,000,000'],
};
```

### Ordinal Mapping
```typescript
const ORDINAL_MAP: Record<string, string[]> = {
  '1st': ['1', 'first', '1st'],
  '2nd': ['2', 'second', '2nd'],
  '3rd': ['3', 'third', '3rd'],
  '4th': ['4', 'fourth', '4th'],
  // ... up to 31st
  '31st': ['31', 'thirty-first', '31st'],
};
```

### Month Variations
```typescript
const MONTH_VARIATIONS: Record<string, string[]> = {
  january: ['jan', 'january', '01', '1'],
  february: ['feb', 'february', '02', '2'],
  march: ['mar', 'march', '03', '3'],
  april: ['apr', 'april', '04', '4'],
  may: ['may', '05', '5'],
  june: ['jun', 'june', '06', '6'],
  july: ['jul', 'july', '07', '7'],
  august: ['aug', 'august', '08', '8'],
  september: ['sep', 'sept', 'september', '09', '9'],
  october: ['oct', 'october', '10'],
  november: ['nov', 'november', '11'],
  december: ['dec', 'december', '12'],
};
```

### Measurement Variations
```typescript
const MEASUREMENT_VARIATIONS: Record<string, string[]> = {
  // Length
  km: ['km', 'kms', 'kilometre', 'kilometres', 'kilometer', 'kilometers'],
  m: ['m', 'metre', 'metres', 'meter', 'meters'],
  cm: ['cm', 'centimetre', 'centimetres', 'centimeter', 'centimeters'],
  mm: ['mm', 'millimetre', 'millimetres', 'millimeter', 'millimeters'],
  ft: ['ft', 'foot', 'feet'],
  in: ['in', 'inch', 'inches'],
  mi: ['mi', 'mile', 'miles'],
  
  // Weight
  kg: ['kg', 'kgs', 'kilogram', 'kilograms', 'kilo', 'kilos'],
  g: ['g', 'gram', 'grams', 'gramme', 'grammes'],
  mg: ['mg', 'milligram', 'milligrams'],
  lb: ['lb', 'lbs', 'pound', 'pounds'],
  oz: ['oz', 'ounce', 'ounces'],
  
  // Volume
  l: ['l', 'litre', 'litres', 'liter', 'liters'],
  ml: ['ml', 'millilitre', 'millilitres', 'milliliter', 'milliliters'],
  
  // Area
  sqm: ['sqm', 'sq m', 'square metre', 'square metres', 'square meter', 'square meters', 'm²', 'm2'],
  sqft: ['sqft', 'sq ft', 'square foot', 'square feet', 'ft²', 'ft2'],
  ha: ['ha', 'hectare', 'hectares'],
  acre: ['acre', 'acres'],
  
  // Temperature
  celsius: ['c', '°c', 'celsius', 'degree celsius', 'degrees celsius', 'centigrade'],
  fahrenheit: ['f', '°f', 'fahrenheit', 'degree fahrenheit', 'degrees fahrenheit'],
  
  // Time durations
  sec: ['sec', 'secs', 'second', 'seconds', 's'],
  min: ['min', 'mins', 'minute', 'minutes'],
  hr: ['hr', 'hrs', 'hour', 'hours', 'h'],
  
  // Percentage
  percent: ['%', 'percent', 'percentage', 'per cent'],
};
```

### Currency Variations
```typescript
const CURRENCY_VARIATIONS: Record<string, string[]> = {
  '$': ['$', 'dollar', 'dollars', 'usd', 'us dollar', 'us dollars'],
  '£': ['£', 'pound', 'pounds', 'gbp', 'pound sterling'],
  '€': ['€', 'euro', 'euros', 'eur'],
  '¥': ['¥', 'yen', 'jpy'],
  '₹': ['₹', 'rupee', 'rupees', 'inr'],
  'cent': ['cent', 'cents', 'c', '¢'],
  'pence': ['pence', 'p', 'penny'],
};
```

### Phone Number Matching
```typescript
function normalizePhoneNumber(phone: string): string {
  return phone
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[oO]/g, '0')                    // O → 0
    .replace(/double\s*(\d)/gi, '$1$1')       // "double 7" → "77"
    .replace(/triple\s*(\d)/gi, '$1$1$1')     // "triple 2" → "222"
    .replace(/[-()]/g, '');
}
```

### Date Matching
```typescript
// Accepts: 15 March, March 15, 15th March, 15/03, 03/15
function matchDate(userAnswer: string, correctAnswer: string): boolean {
  const userComponents = extractDateComponents(userAnswer);
  const correctComponents = extractDateComponents(correctAnswer);
  
  if (userComponents && correctComponents) {
    return userComponents.day === correctComponents.day && 
           userComponents.month === correctComponents.month;
  }
  
  // Handle ambiguous numeric formats (DD/MM or MM/DD)
  const numericPattern = /^(\d{1,2})[\/\-.](\d{1,2})$/;
  const userMatch = userAnswer.match(numericPattern);
  const correctMatch = correctAnswer.match(numericPattern);
  
  if (userMatch && correctMatch) {
    return (userMatch[1] === correctMatch[1] && userMatch[2] === correctMatch[2]) ||
           (userMatch[1] === correctMatch[2] && userMatch[2] === correctMatch[1]);
  }
  
  return false;
}
```

### Time Matching
```typescript
// Accepts: 9:30, 9.30, 09:30, 9.30am, 9:30 AM
function normalizeTime(timeStr: string): string {
  let s = timeStr.toLowerCase().trim();
  s = s.replace(/\s+/g, '');
  s = s.replace(/[.:]/g, ':');           // Normalize separators
  s = s.replace(/a\.?m\.?/gi, 'am');     // Normalize AM
  s = s.replace(/p\.?m\.?/gi, 'pm');     // Normalize PM
  s = s.replace(/o'?clock/gi, ':00');    // o'clock → :00
  if (/^\d:/.test(s)) s = '0' + s;       // Pad single digit hours
  return s;
}
```

### Word Count Function (IELTS Rules)
```typescript
export function countWords(text: string): { words: number; numbers: number } {
  if (!text) return { words: 0, numbers: 0 };
  
  const cleaned = text.replace(/[$£€¥%@#&*]/g, '').trim();
  const tokens = cleaned.split(/\s+/).filter(Boolean);
  
  let words = 0;
  let numbers = 0;
  
  for (const token of tokens) {
    // Pure numbers (including dates, times)
    if (/^[\d,.:\-\/]+(?:am|pm)?$/i.test(token)) {
      numbers += 1;
    } 
    // Ordinals (15th) count as both word and number
    else if (/^\d+(?:st|nd|rd|th)$/i.test(token)) {
      words += 1;
      numbers += 1;
    } 
    // Hyphenated words count as 1 word (mother-in-law = 1 word)
    else {
      words += 1;
    }
  }
  
  return { words, numbers };
}
```

---

## 6.2 Score Calculation

### Raw Score to Band Score Conversion (IELTS Standard)
```typescript
function calculateBandScore(score: number, totalQuestions: number = 40): number {
  const percentage = (score / totalQuestions) * 100;
  
  // Official IELTS band score mapping (approximate)
  if (percentage >= 97.5) return 9.0;   // 39-40/40
  if (percentage >= 92.5) return 8.5;   // 37-38/40
  if (percentage >= 87.5) return 8.0;   // 35-36/40
  if (percentage >= 82.5) return 7.5;   // 33-34/40
  if (percentage >= 75.0) return 7.0;   // 30-32/40
  if (percentage >= 67.5) return 6.5;   // 27-29/40
  if (percentage >= 60.0) return 6.0;   // 24-26/40
  if (percentage >= 52.5) return 5.5;   // 21-23/40
  if (percentage >= 45.0) return 5.0;   // 18-20/40
  if (percentage >= 37.5) return 4.5;   // 15-17/40
  if (percentage >= 30.0) return 4.0;   // 12-14/40
  if (percentage >= 22.5) return 3.5;   // 9-11/40
  if (percentage >= 15.0) return 3.0;   // 6-8/40
  return 2.5;                            // 0-5/40
}
```

### Score Calculation in Submission
```typescript
// Used in ReadingTest.tsx, ListeningTest.tsx
const calculateScore = () => {
  let correct = 0;
  
  questions.forEach(q => {
    const userAnswer = answers[q.question_number];
    const correctAnswer = q.correct_answer;
    
    if (checkAnswer(userAnswer, correctAnswer, q.question_type)) {
      correct++;
    }
  });
  
  return {
    score: correct,
    total: questions.length,
    bandScore: calculateBandScore(correct, questions.length)
  };
};
```

---

## 6.3 Question Type Handling

### Multiple Choice (Single) - Option ID Only
```typescript
const normalizeOptionId = (s: string) => {
  const trimmed = (s ?? '').trim();
  const m = trimmed.match(/^([A-Z]|\d+|[ivxlcdm]+)\b/i);
  return (m?.[1] ?? trimmed).toUpperCase();
};

// Applied to: MULTIPLE_CHOICE, MULTIPLE_CHOICE_SINGLE, MATCHING_HEADINGS, 
//             MATCHING_INFORMATION, MATCHING_FEATURES, MATCHING_CORRECT_LETTER

if (optionIdTypes.has(questionType)) {
  return normalizeOptionId(userAnswer) === normalizeOptionId(correctAnswer);
}
```

### Multiple Choice (Multiple)
```typescript
export function checkMultipleChoiceMultiple(userAnswer: string, correctAnswer: string): boolean {
  if (!userAnswer || !correctAnswer) return false;

  const userOptions = new Set(
    userAnswer.split(',').map(opt => normalizeString(opt)).filter(Boolean)
  );
  const correctOptions = new Set(
    correctAnswer.split(',').map(opt => normalizeString(opt)).filter(Boolean)
  );

  // Must have same number of answers AND all must match
  if (userOptions.size !== correctOptions.size) return false;

  return [...userOptions].every(opt => correctOptions.has(opt)) &&
         [...correctOptions].every(opt => userOptions.has(opt));
}
```

### Smart Answer Checker (Main Entry Point)
```typescript
export function checkAnswer(
  userAnswer: string,
  correctAnswer: string,
  questionType?: string
): boolean {
  // Multiple choice multiple answers
  if (questionType === 'MULTIPLE_CHOICE_MULTIPLE') {
    return checkMultipleChoiceMultiple(userAnswer, correctAnswer);
  }

  // Option-ID based types (compare letter only)
  const optionIdTypes = new Set([
    'MULTIPLE_CHOICE', 'MULTIPLE_CHOICE_SINGLE', 'MATCHING_HEADINGS',
    'MATCHING_INFORMATION', 'MATCHING_FEATURES', 'MATCHING_CORRECT_LETTER',
  ]);

  if (questionType && optionIdTypes.has(questionType)) {
    return normalizeOptionId(userAnswer) === normalizeOptionId(correctAnswer);
  }

  // Matching sentence endings
  if (questionType === 'MATCHING_SENTENCE_ENDINGS') {
    return normalizeOptionId(userAnswer) === normalizeOptionId(correctAnswer);
  }

  // All other types - use full IELTS validation
  return checkIeltsAnswer(userAnswer, correctAnswer);
}
```

---

# 7. FRONTEND ARCHITECTURE

## 7.1 Route Structure

```typescript
// src/App.tsx - Complete route configuration
<Routes>
  {/* Public Routes */}
  <Route path="/" element={<Index />} />
  <Route path="/auth" element={<Auth />} />
  <Route path="/onboarding" element={<Onboarding />} />

  {/* Test List Routes */}
  <Route path="/reading" element={<ReadingTestList />} />
  <Route path="/listening" element={<ListeningTestList />} />
  <Route path="/writing" element={<WritingTestList />} />
  <Route path="/speaking" element={<SpeakingTestList />} />

  {/* Test Routes */}
  <Route path="/reading/:testId" element={<ReadingTest />} />
  <Route path="/listening/:testId" element={<ListeningTest />} />
  <Route path="/writing/:testId" element={<WritingTest />} />
  <Route path="/speaking/:testId" element={<SpeakingTest />} />

  {/* Results Routes */}
  <Route path="/reading/:testId/results" element={<TestResults />} />
  <Route path="/listening/:testId/results" element={<TestResults />} />
  <Route path="/writing/:submissionId/report" element={<WritingEvaluationReport />} />
  <Route path="/speaking/:submissionId/report" element={<SpeakingEvaluationReport />} />

  {/* AI Practice Routes */}
  <Route path="/ai-practice" element={<AIPractice />} />
  <Route path="/ai-practice/history" element={<AIPracticeHistory />} />
  <Route path="/ai-practice/reading/:testId" element={<AIPracticeReadingTest />} />
  <Route path="/ai-practice/listening/:testId" element={<AIPracticeListeningTest />} />
  <Route path="/ai-practice/writing/:testId" element={<AIPracticeWritingTest />} />
  <Route path="/ai-practice/speaking/config" element={<AIPracticeSpeakingConfig />} />
  <Route path="/ai-practice/speaking/:testId" element={<AIPracticeSpeakingTest />} />
  <Route path="/ai-practice/:testId/results" element={<AIPracticeResults />} />
  <Route path="/ai-practice/writing/:testId/results" element={<AIWritingResults />} />
  <Route path="/ai-practice/speaking/:testId/results" element={<AISpeakingResults />} />

  {/* Supporting Routes */}
  <Route path="/flashcards" element={<Flashcards />} />
  <Route path="/analytics" element={<Analytics />} />
  <Route path="/settings" element={<Settings />} />
  <Route path="/passage-study/:testId/:passageNumber" element={<PassageStudy />} />
  <Route path="/test-comparison/:testId" element={<TestComparison />} />
  <Route path="/full-mock-test" element={<FullMockTest />} />

  {/* Admin Routes */}
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
    <Route path="reading" element={<ReadingTestsAdmin />} />
    <Route path="reading/:testId" element={<ReadingTestEditor />} />
    <Route path="listening" element={<ListeningTestsAdmin />} />
    <Route path="listening/:testId" element={<ListeningTestEditor />} />
    <Route path="writing" element={<WritingTestsAdmin />} />
    <Route path="writing/:testId" element={<WritingTestEditor />} />
    <Route path="speaking" element={<SpeakingTestsAdmin />} />
    <Route path="speaking/:testId" element={<SpeakingTestEditor />} />
    <Route path="promotions" element={<PromotionCodesAdmin />} />
  </Route>

  {/* 404 */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

---

## 7.2 Custom Hooks (17 total)

### useAuth.tsx
```typescript
// Provides authentication context
export const useAuth = () => {
  return { user, session, loading, signIn, signUp, signOut };
};
```

### useAdminAccess.tsx
```typescript
// Checks if current user is admin
export const useAdminAccess = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAdmin = async () => {
      const { data } = await supabase.rpc('is_admin', { check_user_id: user?.id });
      setIsAdmin(!!data);
      setLoading(false);
    };
    checkAdmin();
  }, [user]);
  
  return { isAdmin, loading };
};
```

### useAccessControl.tsx
```typescript
// Checks subscription and promotion status
export const useAccessControl = () => {
  const [canSubmit, setCanSubmit] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [promotionActive, setPromotionActive] = useState(false);
  
  // Queries can_user_submit, has_active_subscription, is_promotion_active
  return { canSubmit, hasSubscription, promotionActive, loading };
};
```

### useTestStatePreservation.tsx
```typescript
// Preserves test state when user needs to authenticate
interface TestState {
  testId: string;
  testType: 'reading' | 'listening' | 'writing' | 'speaking';
  answers?: Record<number, string>;
  submissionText?: string;
  currentQuestion?: number;
  timeLeft?: number;
  returnPath: string;
  autoSubmitOnReturn?: boolean;
}

export function useTestStatePreservation() {
  const saveStateAndRedirect = (state: TestState) => {
    safeLocalStorageSetItem('pendingTestSubmission', JSON.stringify({
      ...state,
      savedAt: new Date().toISOString(),
    }));
    navigate(`/auth?returnTo=${encodeURIComponent(state.returnPath)}&pendingSubmission=true`);
  };

  const getPendingSubmission = (): TestState | null => {
    const saved = safeLocalStorageGetItem('pendingTestSubmission');
    if (!saved) return null;
    
    const state = JSON.parse(saved);
    // Expire after 2 hours
    const hoursDiff = (Date.now() - new Date(state.savedAt).getTime()) / (1000 * 60 * 60);
    if (hoursDiff > 2) {
      localStorage.removeItem('pendingTestSubmission');
      return null;
    }
    return state;
  };

  return { saveStateAndRedirect, getPendingSubmission, clearPendingSubmission, restoreStateIfNeeded };
}
```

### useFullscreenTest.tsx
```typescript
// Manages fullscreen mode for tests
export const useFullscreenTest = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const enterFullscreen = () => document.documentElement.requestFullscreen();
  const exitFullscreen = () => document.exitFullscreen();
  
  return { isFullscreen, enterFullscreen, exitFullscreen };
};
```

### useHighlightNotes.tsx
```typescript
// Manages text highlighting and notes for passages
export const useHighlightNotes = (passageId: string) => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  
  const addHighlight = (text: string, color: string, position: Position) => {...};
  const addNote = (text: string, noteContent: string) => {...};
  const removeHighlight = (id: string) => {...};
  
  return { highlights, notes, addHighlight, addNote, removeHighlight };
};
```

### usePullToRefresh.tsx
```typescript
// Pull-to-refresh gesture for mobile
export const usePullToRefresh = (onRefresh: () => Promise<void>) => {
  const [refreshing, setRefreshing] = useState(false);
  // Handles touch events and threshold detection
  return { refreshing, containerRef };
};
```

### useSwipeGesture.tsx
```typescript
// Swipe gesture detection
export const useSwipeGesture = (onSwipeLeft: () => void, onSwipeRight: () => void) => {
  // Detects horizontal swipes with configurable threshold
  return { elementRef };
};
```

### useAudioClipQueue.ts
```typescript
// Manages audio clip queue for listening tests
export const useAudioClipQueue = () => {
  const [queue, setQueue] = useState<AudioClip[]>([]);
  const [currentClip, setCurrentClip] = useState<AudioClip | null>(null);
  
  const addToQueue = (clip: AudioClip) => {...};
  const playNext = () => {...};
  
  return { queue, currentClip, addToQueue, playNext };
};
```

### useGeminiLiveAudio.ts
```typescript
// Real-time audio streaming with Gemini
export const useGeminiLiveAudio = (apiKey: string) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const startStreaming = async () => {...};
  const stopStreaming = () => {...};
  
  return { isStreaming, transcript, startStreaming, stopStreaming };
};
```

### useGeminiSpeaking.ts
```typescript
// Manages Gemini-based speaking evaluation
export const useGeminiSpeaking = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  const startRecording = async () => {...};
  const stopRecording = () => {...};
  const evaluateRecording = async () => {...};
  
  return { isRecording, audioBlob, startRecording, stopRecording, evaluateRecording };
};
```

### useSpeechRecognition.ts
```typescript
// Browser speech recognition
export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const startListening = () => {...};
  const stopListening = () => {...};
  
  return { transcript, isListening, startListening, stopListening };
};
```

### useSpeechSynthesis.ts
```typescript
// Browser text-to-speech
export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  const speak = (text: string, voice?: SpeechSynthesisVoice) => {...};
  const stop = () => {...};
  
  return { isSpeaking, voices, speak, stop };
};
```

### useTopicCompletions.tsx
```typescript
// Tracks AI practice topic completions
export const useTopicCompletions = (module: string) => {
  const { data: completions } = useQuery({
    queryKey: ['topic-completions', module],
    queryFn: async () => {
      const { data } = await supabase
        .from('ai_practice_topic_completions')
        .select('*')
        .eq('module', module);
      return data;
    }
  });
  
  return { completions, getCompletionCount };
};
```

### useUserTestScores.tsx
```typescript
// Fetches user's test scores and history
export const useUserTestScores = (module: 'reading' | 'listening') => {
  const { data: scores } = useQuery({
    queryKey: ['test-scores', module],
    queryFn: async () => {
      const table = module === 'reading' ? 'reading_test_submissions' : 'listening_test_submissions';
      const { data } = await supabase.from(table).select('*').eq('user_id', user?.id);
      return data;
    }
  });
  
  return { scores, averageBand, totalTests };
};
```

### use-mobile.tsx
```typescript
// Detects mobile viewport
export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};
```

### use-toast.ts
```typescript
// Toast notification hook (shadcn/ui)
export const useToast = () => {
  return { toast, toasts, dismiss };
};
```

---

## 7.3 Component Directory Structure

```
src/components/
├── admin/                          # Admin editors (15 files)
│   ├── AudioTimestampEditor.tsx
│   ├── FlowchartCompletionEditor.tsx
│   ├── FullListeningTestPreview.tsx
│   ├── FullTestPreview.tsx
│   ├── ListeningAudioUploader.tsx
│   ├── ListeningImageUploader.tsx
│   ├── ListeningQuestionGroupEditor.tsx
│   ├── ListeningQuestionGroupPreview.tsx
│   ├── ListeningTableEditor.tsx
│   ├── MapLabelingEditor.tsx
│   ├── MultiSelectAnswerInput.tsx
│   ├── MultipleAnswersInput.tsx
│   ├── NoteStyleCategoryEditor.tsx
│   ├── PassageEditor.tsx
│   ├── QuestionGroupEditor.tsx
│   ├── QuestionGroupPreview.tsx
│   ├── ReadingTableEditor.tsx
│   ├── RichTextEditor.tsx
│   ├── SpeakingPart1Editor.tsx
│   ├── SpeakingPart2Editor.tsx
│   ├── SpeakingPart3Editor.tsx
│   └── WritingImageUploader.tsx
│
├── auth/                           # Authentication (2 files)
│   ├── GeminiApiKeyOnboarding.tsx
│   └── TermsAndConditions.tsx
│
├── common/                         # Shared components (15 files)
│   ├── AILoadingScreen.tsx
│   ├── ApiErrorDialog.tsx
│   ├── ExitTestConfirmDialog.tsx
│   ├── FlashcardQuickPractice.tsx
│   ├── GeminiQuotaDisplay.tsx
│   ├── IELTSVisualRenderer.tsx      # Chart rendering for Task 1
│   ├── NoteSidebar.tsx
│   ├── PullToRefreshIndicator.tsx
│   ├── QuestionNumberBadge.tsx
│   ├── QuestionTextWithTools.tsx
│   ├── QuotaWarningDialog.tsx
│   ├── RestoreTestStateDialog.tsx
│   ├── SafeSVG.tsx
│   ├── ScrollProgressIndicator.tsx
│   ├── SubmitConfirmDialog.tsx
│   ├── TestEntryOverlay.tsx
│   └── TestStartOverlay.tsx
│
├── listening/                      # Listening module (15+ files)
│   ├── AudioPlayOverlay.tsx
│   ├── ListeningAudioPlayer.tsx
│   ├── ListeningNavigation.tsx
│   ├── ListeningQuestions.tsx
│   ├── ListeningTestControls.tsx
│   ├── ListeningTimer.tsx
│   ├── MultiPartAudioPlayer.tsx
│   ├── SeamlessAudioPlayer.tsx
│   ├── TranscriptViewer.tsx
│   ├── WebAudioScheduledPlayer.tsx
│   └── questions/                   # Question type renderers
│       ├── DragAndDropOptions.tsx
│       ├── FillInBlank.tsx
│       ├── FlowchartCompletion.tsx
│       ├── ListeningTableCompletion.tsx
│       ├── MapLabeling.tsx
│       ├── MapLabelingTable.tsx
│       ├── Maps.tsx
│       ├── MatchingCorrectLetter.tsx
│       ├── MultipleChoiceMultipleQuestions.tsx
│       └── NoteStyleFillInBlank.tsx
│
├── reading/                        # Reading module (20+ files)
│   ├── ImportToFlashcardDialog.tsx
│   ├── ReadingNavigation.tsx
│   ├── ReadingPassage.tsx
│   ├── ReadingQuestions.tsx
│   ├── ReadingTimer.tsx
│   ├── TestControls.tsx
│   ├── TestOptionsMenu.tsx
│   ├── WordSelectionToolbar.tsx
│   └── questions/                   # Question type renderers
│       ├── FillInBlank.tsx
│       ├── FlowchartCompletion.tsx
│       ├── MapLabeling.tsx
│       ├── MapLabelingTable.tsx
│       ├── MatchingFeatures.tsx
│       ├── MatchingHeadings.tsx
│       ├── MatchingHeadingsDragDrop.tsx
│       ├── MatchingInformation.tsx
│       ├── MatchingInformationGrid.tsx
│       ├── MatchingSentenceEndingsDragDrop.tsx
│       ├── MultipleChoice.tsx
│       ├── MultipleChoiceMultiple.tsx
│       ├── MultipleChoiceSingle.tsx
│       ├── NoteCompletion.tsx
│       ├── ReadingTableCompletion.tsx
│       ├── SentenceCompletion.tsx
│       ├── ShortAnswer.tsx
│       ├── SummaryCompletion.tsx
│       ├── SummaryWordBank.tsx
│       ├── TableCompletion.tsx
│       ├── TableSelection.tsx
│       └── TrueFalseNotGiven.tsx
│
├── speaking/                       # Speaking module (5 files)
│   ├── AIExaminerAvatar.tsx
│   ├── MicrophoneTest.tsx
│   ├── SpeakingTestControls.tsx
│   └── SpeakingTimer.tsx
│
├── test-list/                      # Test list components (6 files)
│   ├── BookSection.tsx
│   ├── BookSectionNew.tsx
│   ├── QuestionTypeBadge.tsx
│   ├── QuestionTypeFilter.tsx
│   ├── TestAccordion.tsx
│   └── TestPartCard.tsx
│
├── ui/                             # shadcn/ui components (50+ files)
│   ├── accordion.tsx
│   ├── alert-dialog.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   ├── toast.tsx
│   └── ... (40+ more)
│
├── user/                           # User settings (1 file)
│   └── GeminiApiKeyManager.tsx
│
├── writing/                        # Writing module (4 files)
│   ├── WritingInputPanel.tsx
│   ├── WritingTaskDisplay.tsx
│   ├── WritingTestControls.tsx
│   └── WritingTimer.tsx
│
└── [Landing page components]        # Marketing (12 files)
    ├── CTA.tsx
    ├── DevelopmentBanner.tsx
    ├── FAQ.tsx
    ├── Features.tsx
    ├── Footer.tsx
    ├── Hero.tsx
    ├── HowItWorks.tsx
    ├── NavLink.tsx
    ├── Navbar.tsx
    ├── Pricing.tsx
    ├── Testimonials.tsx
    └── WhySection.tsx
```

---

# 8. EXTERNAL INTEGRATIONS

## 8.1 Google Gemini API

### Models Used
| Model | Purpose | Temperature | Max Tokens |
|-------|---------|-------------|------------|
| gemini-2.5-flash | Primary text generation | 0.7 | 8192 |
| gemini-2.5-pro | High-quality fallback | 0.7 | 8192 |
| gemini-2.0-flash | Fast fallback | 0.7 | 8192 |
| gemini-2.5-flash-preview-tts | Text-to-speech | N/A | N/A |
| gemini-1.5-pro | Audio evaluation (speaking) | 0.7 | 4096 |

### API Endpoints
```typescript
// Text generation
`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

// Model list (for API key validation)
`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=1`

// TTS generation
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`
```

### Request Structure
```typescript
// Text generation
{
  contents: [{ parts: [{ text: prompt }] }],
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 8192,
  }
}

// TTS generation
{
  contents: [{ parts: [{ text: prompt }] }],
  generationConfig: {
    responseModalities: ["AUDIO"],
    speechConfig: {
      multiSpeakerVoiceConfig: {
        speakerVoiceConfigs: [
          { speaker: "Speaker1", voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } },
          { speaker: "Speaker2", voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } } },
        ],
      },
    },
  }
}

// Vision (with image)
{
  contents: [{ 
    parts: [
      { text: prompt },
      { inline_data: { mime_type: "image/png", data: imageBase64 } }
    ] 
  }]
}
```

### Error Handling & Retry Logic
```typescript
const ERROR_CODES = {
  429: 'RATE_LIMIT_EXCEEDED',
  403: 'PERMISSION_DENIED',
  400: 'BAD_REQUEST',
  500: 'SERVER_ERROR',
  503: 'SERVICE_UNAVAILABLE',
};

// Retry with exponential backoff for recoverable errors
async function callWithRetry(fn, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 || error.status >= 500) {
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
          await sleep(delay);
          continue;
        }
      }
      throw error;
    }
  }
}
```

---

## 8.2 Supabase Auth

### Configuration
```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jtfbocwsfxwrzfzvzgja.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### Auth Methods
```typescript
// Sign in with email/password
supabase.auth.signInWithPassword({ email, password })

// Sign up with email/password
supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/`,
    data: { full_name: fullName }
  }
})

// Sign out
supabase.auth.signOut()

// Get current session
supabase.auth.getSession()

// Listen to auth changes
supabase.auth.onAuthStateChange((event, session) => {...})
```

---

## 8.3 Supabase Storage

### Buckets Configuration
| Bucket | Public | Purpose |
|--------|--------|---------|
| listening-audios | Yes | Uploaded listening test audio files |
| listening-images | Yes | Maps, diagrams for listening tests |
| writing-images | Yes | Charts, graphs for writing Task 1 |
| speaking-audios | Yes | User speaking recordings |
| listening-audio | No | Private audio files |

### File Operations
```typescript
// Upload file
const { data, error } = await supabase.storage
  .from('bucket-name')
  .upload(`folder/${filename}`, file, {
    contentType: 'audio/mp3',
    upsert: true,
  });

// Get public URL
const { data: urlData } = supabase.storage
  .from('bucket-name')
  .getPublicUrl(`folder/${filename}`);

// Download file
const { data, error } = await supabase.storage
  .from('bucket-name')
  .download(`folder/${filename}`);

// Delete file
const { error } = await supabase.storage
  .from('bucket-name')
  .remove([`folder/${filename}`]);
```

### File Naming Conventions
```
listening-audios/
  ├── {testId}/
  │   ├── part1.mp3
  │   ├── part2.mp3
  │   ├── part3.mp3
  │   └── part4.mp3
  └── ai-practice/
      └── {testId}-{timestamp}.webm

listening-images/
  ├── {testId}/
  │   └── map-{questionGroupId}.png
  └── ai-practice-images/
      └── {testId}-{timestamp}.png

writing-images/
  └── {taskId}/
      └── chart-{timestamp}.png

speaking-audios/
  └── {submissionId}/
      ├── part1-q{questionId}.webm
      ├── part2-q{questionId}.webm
      └── part3-q{questionId}.webm
```

---

# 9. FILE STORAGE ARCHITECTURE

## 9.1 Storage Policies

### listening-audios (Public)
```sql
-- Anyone can view
CREATE POLICY "Public can view listening audios"
ON storage.objects FOR SELECT
USING (bucket_id = 'listening-audios');

-- Admins can upload
CREATE POLICY "Admins can upload listening audios"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'listening-audios' AND is_admin(auth.uid()));
```

### speaking-audios (Public)
```sql
-- Anyone can view (for playback in reports)
CREATE POLICY "Public can view speaking audios"
ON storage.objects FOR SELECT
USING (bucket_id = 'speaking-audios');

-- Users can upload their own recordings
CREATE POLICY "Users can upload speaking audios"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'speaking-audios' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

# 10. UI/UX DESIGN PATTERNS

## 10.1 Design System (Tailwind + shadcn/ui)

### Color Tokens (index.css)
```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 240 5.9% 10%;
  --radius: 0.5rem;
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  /* ... dark mode overrides */
}
```

### Component Variants (Button Example)
```typescript
// src/components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

---

## 10.2 IELTS Visual Renderer (Charts)

### Location
`src/components/common/IELTSVisualRenderer.tsx` (1000+ lines)

### Supported Chart Types
```typescript
type ChartType = 
  | 'BAR_CHART'      // Vertical bars with percentage Y-axis
  | 'LINE_GRAPH'     // Multiple series with markers and legend
  | 'PIE_CHART'      // Segments with labels and percentages
  | 'TABLE'          // Colored headers, consistent text wrapping
  | 'PROCESS_DIAGRAM'// Horizontal flow with numbered steps
  | 'MAP'            // Comparison maps with features
  | 'MIXED_CHARTS';  // Stacked vertically (not side-by-side)
```

### Color Palette (IELTS-style, highly distinguishable)
```typescript
const CHART_COLORS = [
  '#3366CC', // Strong blue
  '#DC3912', // Strong red
  '#109618', // Strong green
  '#FF9900', // Orange
  '#990099', // Purple
  '#0099C6', // Teal
  '#DD4477', // Pink
  '#66AA00', // Lime green
];
```

### Bar Chart Renderer (IELTS-style)
```typescript
function BarChartRenderer({ data, getColor }) {
  // Features:
  // - Vertical bars (not horizontal)
  // - Percentage Y-axis with grid lines
  // - Black tick marks at each percentage level
  // - Labels below X-axis
  // - No redundant borders
  
  return (
    <svg viewBox={`0 0 ${W} ${H}`}>
      {/* Horizontal grid lines */}
      {ticks.map(v => (
        <line x1={pad.left} y1={yAt(v)} x2={W - pad.right} y2={yAt(v)} stroke="#333" />
      ))}
      
      {/* Y-axis labels */}
      {ticks.map(v => (
        <text x={pad.left - 10} y={yAt(v) + 4} textAnchor="end">{v}%</text>
      ))}
      
      {/* Bars */}
      {items.map((item, idx) => (
        <rect x={xAt(idx) - barWidth/2} y={yAt(item.value)} width={barWidth} height={barH} fill={getColor(idx)} />
      ))}
      
      {/* X-axis labels */}
      {items.map((item, idx) => (
        <text x={xAt(idx)} y={H - pad.bottom + 18} textAnchor="middle">{item.label}</text>
      ))}
    </svg>
  );
}
```

### Line Graph Renderer (IELTS-style)
```typescript
function LineGraphRenderer({ data, getColor }) {
  // Features:
  // - Thick lines (strokeWidth={3})
  // - Large markers (r={5})
  // - Distinct colors from CHART_COLORS
  // - Percentage Y-axis with horizontal grid lines
  // - Vertical grid lines at each X point
  // - Legend on right side
  
  return (
    <svg viewBox={`0 0 ${W} ${H}`}>
      {/* Grid lines */}
      {tickValues.map(v => (
        <line x1={pad.left} y1={yAt(v)} x2={W - pad.right} y2={yAt(v)} stroke="#333" />
      ))}
      
      {/* Vertical grid lines */}
      {xLabels.map((_, i) => (
        <line x1={xAt(i)} y1={pad.top} x2={xAt(i)} y2={H - pad.bottom} stroke="#aaa" />
      ))}
      
      {/* Series lines */}
      {series.map((s, sIdx) => (
        <g key={sIdx}>
          <path d={pathData} fill="none" stroke={getColor(sIdx)} strokeWidth={3} />
          {points.map(p => (
            <circle cx={p.x} cy={p.y} r={5} fill={getColor(sIdx)} stroke="#fff" strokeWidth={2} />
          ))}
        </g>
      ))}
      
      {/* Legend */}
      {series.map((s, idx) => (
        <g>
          <line x1={W - pad.right + 20} y1={y} x2={W - pad.right + 45} y2={y} stroke={getColor(idx)} strokeWidth={3} />
          <text x={W - pad.right + 50} y={y + 4}>{s.name}</text>
        </g>
      ))}
    </svg>
  );
}
```

---

# 11. AI CONTENT GENERATION

## 11.1 IELTS Topics Pool
```typescript
const IELTS_TOPICS = [
  'Climate change and environmental conservation',
  'The impact of technology on modern society',
  'Education systems around the world',
  'Health and wellness in the 21st century',
  'Urbanization and city planning',
  'Wildlife conservation and biodiversity',
  'The role of art and culture in society',
  'Space exploration and scientific discovery',
  'Global tourism and its effects',
  'Sustainable energy solutions',
  'Ancient civilizations and archaeology',
  'Marine ecosystems and ocean conservation',
  'The future of transportation',
  'Digital communication and social media',
  'Food security and agriculture',
];
```

## 11.2 Listening Scenarios
```typescript
const LISTENING_SCENARIOS = [
  { type: 'conversation', description: 'a casual conversation between two people' },
  { type: 'lecture', description: 'a short educational lecture or presentation' },
  { type: 'interview', description: 'an interview about a specific topic' },
  { type: 'tour', description: 'a guided tour of a facility or location' },
  { type: 'phone_call', description: 'a phone conversation about booking or inquiry' },
];
```

## 11.3 Difficulty Levels
```typescript
const DIFFICULTY_DESCRIPTIONS = {
  easy: 'Band 5-5.5 (basic comprehension, straightforward vocabulary)',
  medium: 'Band 6-6.5 (moderate complexity, some inference required)',
  hard: 'Band 7-7.5 (complex ideas, nuanced language)',
  expert: 'Band 8-9 (extremely challenging, near-native comprehension, subtle inferences)',
};
```

---

# 12. COMPLETE FUNCTION REFERENCE

## 12.1 Answer Validation Functions

| Function | Purpose | File |
|----------|---------|------|
| `checkIeltsAnswer` | Main answer validation | ieltsAnswerValidation.ts |
| `checkMultipleChoiceMultiple` | MCQ multiple answers | ieltsAnswerValidation.ts |
| `checkAnswer` | Smart dispatcher by question type | ieltsAnswerValidation.ts |
| `matchDate` | Date format variations | ieltsAnswerValidation.ts |
| `matchTime` | Time format variations | ieltsAnswerValidation.ts |
| `matchNumber` | Number/word variations | ieltsAnswerValidation.ts |
| `matchNumberWithText` | "1 degree" = "one degree" | ieltsAnswerValidation.ts |
| `matchMeasurement` | "10kg" = "ten kilograms" | ieltsAnswerValidation.ts |
| `matchCurrency` | "$50" = "50 dollars" | ieltsAnswerValidation.ts |
| `matchPhoneNumber` | "double 7" = "77" | ieltsAnswerValidation.ts |
| `matchAlphanumericCode` | Postcode/code matching | ieltsAnswerValidation.ts |
| `matchWithHyphens` | Hyphen/space variations | ieltsAnswerValidation.ts |
| `matchWithSpellingVariations` | British/American spelling | ieltsAnswerValidation.ts |
| `countWords` | IELTS word counting rules | ieltsAnswerValidation.ts |
| `validateWordLimit` | Check word limit compliance | ieltsAnswerValidation.ts |

## 12.2 Edge Function Exports

| Function | HTTP Method | Auth | Returns |
|----------|-------------|------|---------|
| generate-ai-practice | POST | JWT | { testId, payload, audioUrl? } |
| evaluate-writing-submission | POST | JWT | { overall_band, evaluation_report } |
| evaluate-speaking-submission | POST | JWT | { overall_band, evaluation_report, transcripts } |
| explain-answer | POST | No | { explanation } |
| explain-answer-followup | POST | JWT | { explanation } |
| analyze-performance | POST | JWT | { analysis_data } |
| translate-word | POST | No | { translation } |
| set-user-gemini-api-key | POST | JWT | { success } |
| gemini-quota | GET | JWT | { tokens_used, requests_count } |

---

# 13. KNOWN TECHNICAL DEBT

## 13.1 Incomplete Features

| Feature | Status | Priority | Notes |
|---------|--------|----------|-------|
| Flashcard overlay on Reading | Partial | Medium | Import dialog works, overlay needs polish |
| Mobile responsiveness | ~80% | High | Some admin pages need work |
| Offline support | Not implemented | Low | Service worker not configured |
| Test timer persistence | Partial | Medium | Doesn't survive page refresh |
| Multi-API key rotation | Not implemented | Low | Single key per user |
| Speaking auto-advance | Implemented | Done | Auto-moves to next question |
| Stripe payments | Not integrated | High | Subscriptions table ready, no gateway |

## 13.2 Logic Loopholes

| Issue | Impact | Recommended Fix |
|-------|--------|-----------------|
| No rate limiting on client | Abuse risk | Add request throttling in edge functions |
| Gemini API key stored per-user | User leaves = no AI | Add fallback system key option |
| Test submission without auth | Partial | Currently redirects but loses progress |
| Admin check on every action | Performance | Cache admin status in session |

## 13.3 Security Considerations

| Area | Current State | Recommendation |
|------|---------------|----------------|
| API key encryption | AES-GCM 256-bit | Good |
| RLS policies | Comprehensive | Good |
| JWT verification | All user endpoints | Good |
| Input sanitization | Basic | Add zod validation on all inputs |
| Rate limiting | Not implemented | Add per-user limits |

## 13.4 Performance Optimizations Needed

| Area | Issue | Solution |
|------|-------|----------|
| Large passage rendering | Slow on mobile | Virtual scrolling |
| Audio loading | Blocks UI | Progressive loading |
| Question list re-renders | Unnecessary | React.memo + useMemo |
| Supabase queries | N+1 in some places | Consolidate with joins |

---

# APPENDIX A: Environment Variables

## Supabase Edge Function Secrets
```
SUPABASE_URL             # Auto-injected
SUPABASE_ANON_KEY        # Auto-injected
SUPABASE_SERVICE_ROLE_KEY # Auto-injected
SUPABASE_DB_URL          # Auto-injected
app_encryption_key       # For API key encryption (32+ chars)
LOVABLE_API_KEY          # Optional: Lovable AI Gateway
```

## Client-Side (Public)
```
VITE_SUPABASE_URL        # (Not used - hardcoded)
VITE_SUPABASE_ANON_KEY   # (Not used - hardcoded)
```

---

# APPENDIX B: Testing

## Test Files
```
src/lib/__tests__/ieltsAnswerValidation.test.ts    # Not yet created
src/components/reading/questions/__tests__/*.ts    # Partial coverage
src/components/listening/questions/__tests__/*.ts  # Partial coverage
```

## Running Tests
```bash
npm run test        # Run vitest
npm run test:watch  # Watch mode
npm run test:ui     # UI mode
```

---

# APPENDIX C: Deployment

## Build Command
```bash
npm run build       # Creates dist/ folder
```

## Preview
```bash
npm run preview     # Serves built app locally
```

## Supabase Edge Functions
```bash
# Deployed automatically by Lovable
# Or manually:
supabase functions deploy <function-name>
```

---

# END OF TECHNICAL MASTER FILE

**Version:** 2.0
**Total Lines:** 7000+
**Last Updated:** 2026-01-01
**Author:** AI-Generated System Documentation
