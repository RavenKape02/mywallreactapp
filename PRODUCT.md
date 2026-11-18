# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) with React 19, TypeScript and Tailwind CSS v4, plus Supabase (Postgres, Realtime and Storage) through supabase-js. Deployed on Vercel. The stack is set by the coding test ("React + Next.js + Supabase").

## Users

Reviewers at Semprove (the CAPM coding test, Test 2) who open the public Vercel URL, post a message or two, refresh, and check the feed, on desktop or phone. Secondary: anyone who reads the GitHub repo.

## Product Purpose

A Facebook-style profile wall for Raven Caduyac. Visitors write a message, press Share, and see it saved in Supabase and listed newest first. It survives a refresh and updates live.

The test passes when all three hold:
1. A visitor can type a message and press Share.
2. The message is saved in Supabase.
3. The feed shows all messages newest first, and they persist after a refresh.

## Positioning

A wall that feels like a real social profile from the first glance, with live updates and photo posts, rather than a bare form and list.

## Operating Context

The site is opened from the test submission on desktop and mobile browsers. No login: each visitor types a display name, which is remembered in their browser.

## Capabilities and Constraints

- Posts carry a display name (40 characters max), a message (280 max), an optional photo and a server timestamp.
- The feed shows the latest 50 posts, newest first, and new posts arrive live through Supabase Realtime.
- Photo upload goes to Supabase Storage: images only, 5 MB max.
- The database enforces the limits. Anonymous visitors can only read and add posts, never edit or delete.

## Brand Commitments

Owner of the wall: Raven Caduyac, AI Engineer and full-stack developer.
- Studies Computer Science at the University of the Philippines Los Baños.
- Lives in Los Baños, Laguna, Philippines.
- Links: https://ravencaduyac.engineer and https://github.com/RavenKape02.
- The profile photo is the portfolio photo (pfp.jpg).

## Evidence on Hand

The profile photo, and a screenshot of the applicant's Tic-Tac-Toe app (Test 1) for the cover. Do not invent posts, friend counts or engagement numbers. The feed holds only real posts.

## Product Principles

- The three pass checks are obvious within seconds.
- It looks and behaves like a social profile people already know.
- Posts appear instantly and never silently fail. Errors say what to do.
- Fast and fair on a phone.

## Accessibility & Inclusion

Labelled form controls, a live character count, keyboard-usable controls, announced errors, and reduced motion respected.
