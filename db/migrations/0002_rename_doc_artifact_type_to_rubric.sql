-- 0002_rename_doc_artifact_type_to_rubric.sql
-- Rename the legacy artifact_type enum value so rubric sheets are typed explicitly.

ALTER TYPE artifact_type RENAME VALUE 'doc' TO 'rubric';
