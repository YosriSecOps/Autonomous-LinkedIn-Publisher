-- ============================================================================
-- Autonomous LinkedIn Publisher — Seed Data
-- ============================================================================
-- Inserts a default profile for quick-start development and testing.
-- ============================================================================

INSERT INTO Profiles (
    name,
    theme,
    tone,
    character_description,
    background_setting,
    posting_schedule,
    is_active
) VALUES (
    'CyberSec Expert',
    'Cybersecurity',
    'Professional yet approachable',
    'A confident male professional in his 30s with short dark hair, wearing a sleek dark navy suit with a subtle tech-pattern tie, clean-shaven face with sharp features',
    'A modern Security Operations Center (SOC) with multiple glowing monitors showing network traffic dashboards, dark ambient lighting with blue and green accent lights',
    '0 9 * * 1-5',
    1
);
