SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict Pz1pKDsxbB1CR3f1SYfkjKaYhp7imdv1ulVVlpNhvVDZ03u1khWlXVHHTdjRMiA

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', 'e7107928-294a-4582-ac15-ac97c5af1030', '{"action":"user_signedup","actor_id":"1808851b-0cb8-4ba4-b287-f09615893b32","actor_username":"davinpreble5@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-10-25 23:52:02.326107+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bae0cd46-0cde-491f-b3ed-50d7627c5b8e', '{"action":"login","actor_id":"1808851b-0cb8-4ba4-b287-f09615893b32","actor_username":"davinpreble5@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-25 23:52:02.342512+00', ''),
	('00000000-0000-0000-0000-000000000000', '7583cb24-7a86-46c1-972c-17fa1865a26c', '{"action":"login","actor_id":"1808851b-0cb8-4ba4-b287-f09615893b32","actor_username":"davinpreble5@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-25 23:54:35.288508+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '1808851b-0cb8-4ba4-b287-f09615893b32', 'authenticated', 'authenticated', 'davinpreble5@gmail.com', '$2a$10$2dDulXqSRGwX.RXNwnZbsOk/ZRdpNjbCb7vlm8XGJscUcRAdySRXC', '2025-10-25 23:52:02.33281+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-10-25 23:54:35.326472+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "1808851b-0cb8-4ba4-b287-f09615893b32", "email": "davinpreble5@gmail.com", "email_verified": true, "phone_verified": false}', NULL, '2025-10-25 23:52:02.276384+00', '2025-10-25 23:54:35.347673+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('1808851b-0cb8-4ba4-b287-f09615893b32', '1808851b-0cb8-4ba4-b287-f09615893b32', '{"sub": "1808851b-0cb8-4ba4-b287-f09615893b32", "email": "davinpreble5@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2025-10-25 23:52:02.318412+00', '2025-10-25 23:52:02.318429+00', '2025-10-25 23:52:02.318429+00', 'fc944c30-0128-4167-8bf2-3537e2882683');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('87c1c875-6939-49f1-9eff-02a0f06cc9c2', '1808851b-0cb8-4ba4-b287-f09615893b32', '2025-10-25 23:52:02.345047+00', '2025-10-25 23:52:02.345047+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0', '172.18.0.1', NULL),
	('75fe68bb-ceca-41a0-812f-dd58f3984b49', '1808851b-0cb8-4ba4-b287-f09615893b32', '2025-10-25 23:54:35.329191+00', '2025-10-25 23:54:35.329191+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0', '172.18.0.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('87c1c875-6939-49f1-9eff-02a0f06cc9c2', '2025-10-25 23:52:02.367098+00', '2025-10-25 23:52:02.367098+00', 'password', '51cb4b7b-cc31-41d7-bf70-ca4df047b85c'),
	('75fe68bb-ceca-41a0-812f-dd58f3984b49', '2025-10-25 23:54:35.35162+00', '2025-10-25 23:54:35.35162+00', 'password', 'f8936465-daee-45a1-a9e5-09ba1b64db3a');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 1, 'qfytp7bgkgjg', '1808851b-0cb8-4ba4-b287-f09615893b32', false, '2025-10-25 23:52:02.357304+00', '2025-10-25 23:52:02.357304+00', NULL, '87c1c875-6939-49f1-9eff-02a0f06cc9c2'),
	('00000000-0000-0000-0000-000000000000', 2, 'eaziozutr4bn', '1808851b-0cb8-4ba4-b287-f09615893b32', false, '2025-10-25 23:54:35.336898+00', '2025-10-25 23:54:35.336898+00', NULL, '75fe68bb-ceca-41a0-812f-dd58f3984b49');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: shops_tables; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: leads; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: shop_appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: shop_leads; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: shop_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: shop_users; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: shop_workers; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: waitlist; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_namespaces; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_tables; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 2, true);


--
-- Name: shop_appointments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."shop_appointments_id_seq"', 1, false);


--
-- Name: shop_leads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."shop_leads_id_seq"', 1, false);


--
-- Name: shop_tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."shop_tasks_id_seq"', 1, false);


--
-- Name: waitlist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."waitlist_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict Pz1pKDsxbB1CR3f1SYfkjKaYhp7imdv1ulVVlpNhvVDZ03u1khWlXVHHTdjRMiA

RESET ALL;
