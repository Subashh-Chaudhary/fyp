--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Ubuntu 14.18-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.18 (Ubuntu 14.18-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: expert_user_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.expert_user_type_enum AS ENUM (
    'farmer',
    'expert',
    'admin'
);


ALTER TYPE public.expert_user_type_enum OWNER TO postgres;

--
-- Name: experts_user_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.experts_user_type_enum AS ENUM (
    'farmer',
    'expert',
    'admin'
);


ALTER TYPE public.experts_user_type_enum OWNER TO postgres;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'farmer',
    'expert',
    'admin'
);


ALTER TYPE public.user_role OWNER TO postgres;

--
-- Name: users_user_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.users_user_type_enum AS ENUM (
    'farmer',
    'expert',
    'admin'
);


ALTER TYPE public.users_user_type_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: crops; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crops (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    image_url character varying,
    disease_id uuid,
    scanned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.crops OWNER TO postgres;

--
-- Name: diseases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diseases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.diseases OWNER TO postgres;

--
-- Name: experts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.experts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    reset_token_expires timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    user_type public.experts_user_type_enum DEFAULT 'expert'::public.experts_user_type_enum NOT NULL,
    social_provider character varying(50),
    social_id character varying(255),
    password_reset_token character varying(255),
    specialization character varying(255),
    experience_years integer,
    qualification text,
    license_number character varying(100),
    is_available boolean DEFAULT true NOT NULL,
    rating numeric(3,2) DEFAULT '0'::numeric NOT NULL,
    total_cases integer DEFAULT 0 NOT NULL,
    name character varying(255) NOT NULL,
    phone character varying(20),
    email character varying(255) NOT NULL,
    password character varying(255),
    address text,
    profile_image character varying(512),
    verification_token character varying(255),
    qualification_docs character varying(512)
);


ALTER TABLE public.experts OWNER TO postgres;

--
-- Name: feedbacks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.feedbacks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    crop_id uuid,
    expert_id uuid,
    feedback_text text,
    verified_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.feedbacks OWNER TO postgres;

--
-- Name: histories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.histories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    report_id uuid,
    viewed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.histories OWNER TO postgres;

--
-- Name: news; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    source character varying(255) NOT NULL,
    publish_date timestamp with time zone NOT NULL,
    category character varying(100) NOT NULL,
    url character varying(255) NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.news OWNER TO postgres;

--
-- Name: reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    crop_id uuid,
    disease_id uuid,
    solution_id uuid,
    feedback_id uuid,
    report_url character varying,
    generated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.reports OWNER TO postgres;

--
-- Name: solutions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.solutions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    disease_id uuid,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.solutions OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255),
    phone character varying(20),
    address text,
    profile_image character varying(512),
    is_verified boolean DEFAULT false,
    verification_token character varying(255),
    password_reset_token character varying(255),
    reset_token_expires timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: TABLE users; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.users IS 'User accounts for the application';


--
-- Name: COLUMN users.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.id IS 'Unique identifier for the user';


--
-- Name: COLUMN users.name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.name IS 'Full name of the user';


--
-- Name: COLUMN users.email; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.email IS 'Unique email address for the user';


--
-- Name: COLUMN users.password; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.password IS 'Hashed password (nullable for OAuth users)';


--
-- Name: COLUMN users.phone; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.phone IS 'Phone number of the user';


--
-- Name: COLUMN users.address; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.address IS 'Address of the user';


--
-- Name: COLUMN users.profile_image; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.profile_image IS 'URL to user avatar image';


--
-- Name: COLUMN users.is_verified; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.is_verified IS 'Whether the user email is verified';


--
-- Name: COLUMN users.verification_token; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.verification_token IS 'Token for email verification';


--
-- Name: COLUMN users.password_reset_token; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.password_reset_token IS 'Token for password reset';


--
-- Name: COLUMN users.reset_token_expires; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.reset_token_expires IS 'When the reset token expires';


--
-- Name: COLUMN users."createdAt"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users."createdAt" IS 'When the user was created';


--
-- Name: COLUMN users."updatedAt"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users."updatedAt" IS 'When the user was last updated';


--
-- Data for Name: crops; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crops (id, user_id, image_url, disease_id, scanned_at) FROM stdin;
\.


--
-- Data for Name: diseases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diseases (id, name, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: experts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.experts (id, is_verified, reset_token_expires, created_at, updated_at, user_type, social_provider, social_id, password_reset_token, specialization, experience_years, qualification, license_number, is_available, rating, total_cases, name, phone, email, password, address, profile_image, verification_token, qualification_docs) FROM stdin;
e97f0fed-7257-42ae-9357-29549f918e74	f	\N	2025-08-04 06:23:22.938986	2025-08-04 06:23:22.938986	expert	\N	\N	\N	\N	\N	\N	\N	t	0.00	0	Binod Shrestha	\N	ggg@gmail.com	$2b$10$rl0iOYQ2zJjBfZ3KpfkRxeOaCKhGJx/QZ34WcPCestNOOnUY/Qgl6	\N	\N	\N	\N
99d1d6bd-5089-4d86-987c-56d8cf7110f9	f	\N	2025-08-04 06:28:50.235711	2025-08-04 06:28:50.235711	expert	\N	\N	\N	\N	\N	\N	\N	t	0.00	0	Subash Tharu	\N	chysubash15963@gmail.com	$2b$10$zjhi16GJe0IuBQPSsnOl7exwiZe0S7m8m08ZV.NdBR1kmIuRAF1hS	\N	\N	\N	\N
bba7ec3d-26b1-4849-93db-d29170149c34	f	\N	2025-08-04 06:29:58.428032	2025-08-04 06:29:58.428032	expert	\N	\N	\N	\N	\N	\N	\N	t	0.00	0	Namresh Tharu	\N	nareshtharu.info@gmail.com	$2b$10$HAgS1FYsEvQmi25xFRALDOl2XHC6.l4B6IB8C8KRkVKCaR/I.SlPG	\N	\N	\N	\N
\.


--
-- Data for Name: feedbacks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.feedbacks (id, crop_id, expert_id, feedback_text, verified_at) FROM stdin;
\.


--
-- Data for Name: histories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.histories (id, user_id, report_id, viewed_at) FROM stdin;
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.news (id, title, content, source, publish_date, category, url, is_active, created_at, last_updated) FROM stdin;
\.


--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reports (id, user_id, crop_id, disease_id, solution_id, feedback_id, report_url, generated_at) FROM stdin;
\.


--
-- Data for Name: solutions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.solutions (id, disease_id, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, phone, address, profile_image, is_verified, verification_token, password_reset_token, reset_token_expires, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: experts UQ_714c375ea5ea46e2d0c7c23ccda; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.experts
    ADD CONSTRAINT "UQ_714c375ea5ea46e2d0c7c23ccda" UNIQUE (email);


--
-- Name: crops crops_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crops
    ADD CONSTRAINT crops_pkey PRIMARY KEY (id);


--
-- Name: diseases diseases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diseases
    ADD CONSTRAINT diseases_pkey PRIMARY KEY (id);


--
-- Name: experts experts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.experts
    ADD CONSTRAINT experts_pkey PRIMARY KEY (id);


--
-- Name: feedbacks feedbacks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_pkey PRIMARY KEY (id);


--
-- Name: histories histories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.histories
    ADD CONSTRAINT histories_pkey PRIMARY KEY (id);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: news news_url_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_url_key UNIQUE (url);


--
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- Name: solutions solutions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solutions
    ADD CONSTRAINT solutions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: crops crops_disease_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crops
    ADD CONSTRAINT crops_disease_id_fkey FOREIGN KEY (disease_id) REFERENCES public.diseases(id) ON DELETE SET NULL;


--
-- Name: feedbacks feedbacks_crop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_crop_id_fkey FOREIGN KEY (crop_id) REFERENCES public.crops(id) ON DELETE CASCADE;


--
-- Name: feedbacks feedbacks_expert_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_expert_id_fkey FOREIGN KEY (expert_id) REFERENCES public.experts(id) ON DELETE CASCADE;


--
-- Name: histories histories_report_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.histories
    ADD CONSTRAINT histories_report_id_fkey FOREIGN KEY (report_id) REFERENCES public.reports(id) ON DELETE CASCADE;


--
-- Name: reports reports_crop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_crop_id_fkey FOREIGN KEY (crop_id) REFERENCES public.crops(id) ON DELETE CASCADE;


--
-- Name: reports reports_disease_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_disease_id_fkey FOREIGN KEY (disease_id) REFERENCES public.diseases(id) ON DELETE SET NULL;


--
-- Name: reports reports_feedback_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_feedback_id_fkey FOREIGN KEY (feedback_id) REFERENCES public.feedbacks(id) ON DELETE SET NULL;


--
-- Name: reports reports_solution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_solution_id_fkey FOREIGN KEY (solution_id) REFERENCES public.solutions(id) ON DELETE SET NULL;


--
-- Name: solutions solutions_disease_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solutions
    ADD CONSTRAINT solutions_disease_id_fkey FOREIGN KEY (disease_id) REFERENCES public.diseases(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

