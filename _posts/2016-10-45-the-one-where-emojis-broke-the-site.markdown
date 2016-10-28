---
title:  "The One Where Emojis Broke the Site"
date:   2016-10-25 15:04:23
categories: [Warstory]
tags: [emojis, bugs]
---
I was working in a team where we helped a customer developing their new website. The assignment also included maintaining the customer's existing website, an old legacy webforms application with the classic monolithic architecture.

One day we received the dreaded phone call:

*"The website is down."*

The team instantly began checking the logs and found a really strange error: ``EncoderFallbackException: Unable to translate Unicode character \uDBFF at index 114 to specified code page.`` followed by a statement that a query couldn't be executed. The error was constantly being logged and quickly it had over 1000 entries.

We refreshed the app pool and the site started working again, so the we didn't put much more thought to the error.

The next day, we discovered that the site was down once again, and we quickly refreshed the app pool before any customers would be affected. After some digging in the event log on the server, we realized that the site crashed at almost the exact same time both days. Merely three minutes differed between the days, and it seemed too unlikely to be a coincidence. Was there a scheduled task running at that exact time that caused the error? Or was someone trying to hack the website during their coffee break?

Thrilled by the mystery we searched google for possible clues. The strange ``\uDBFF`` character mentioned in the stack trace seemed to be a Unicode character resembling a sun ◌. After analyzing the event log even more to get as much information as possible, we found another suspicious thing; the fact that the error occurred from the exact same endpoint both days. The team was intrigued. What could possibly go so wrong when inputting an alphanumeric code to the website?

Naturally we had to try sending the strange and mysterious sun character in the input field that seemed to cause the error. The whole team member held our collective breath – was the site going to crash?

It didn't.

At this point, the we were starting to become desperate. The search terms input to google was becoming more and more obscure, one thing led to another and we started reading about [surrogates](https://en.wikipedia.org/wiki/Universal_Character_Set_characters#Surrogates). Surrogate pairs, in the context of Universal Character Set, is a way to map characters outside the basic UCS plane by combining a high/leading surrogate with a low/trailing surrogate. It is then possible to display all characters in the other planes without having to use more than 16 bit to represent them. A surrogate on its on, on the other hand, doesn't have any meaning.

A seed started to grow in my mind. After all, there was some business logic handling the code that was input to to field, splitting the string among other things. I quickly entered the staging website and pasted a couple of those emojis that are crying from laughter. I pressed enter and bam. The bright yellow from the YSOD was almost dazzling.

*"What the...""*, I burst out. Unfortunately the rest of the team was fetching coffee so no one was able to hear my successful outcry.

As soon as the rest of the team arrived I told them about my findings, and we realized that we needed to test it in production too, with the possible outcome that the site would once again crash.

Sweat started to break from the palms of my hands when I wrote the emojis crying from laughter – what emoji could possibly be more suitable than those – and pressed the button to submit. The site crashed, and another team member swiftly entered the server and refreshed the app pool. We had finally conquered the bug!

**TL;DR:**

When submitting emojis into a text field a ``string.Split()`` caused the Unicode for that emoji to be split in just the wrong place. Since the emoji was consisting of two surrogates, it couldn't be written because a surrogate can't be parsed on its own. This gave an internal server error and redirected to a "friendly error page". The error page also tried to log the error to the database, but since the error itself contained a character that couldn't be parsed, it threw an error and redirected to the error page. Then it tried to log the error, but… Infinite loop of doom.
