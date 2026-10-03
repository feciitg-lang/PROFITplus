/*
  PROFIT+ CURRICULUM
  ==================
  Edit this file to change what shows in the "6-Day Learning Journey" section.

  For each day:
    title   - card heading
    summary - one line under the heading
    icon    - file in /icons (market, chart, strategy, risk, psychology, trophy)
    topics  - list of topics. Each topic has:
                name - what the student sees
                link - Google Drive folder/file URL (https://drive.google.com/...)
                       Leave it as "" and the topic shows as "Coming soon".

  ROLLOUT: days unlock one at a time (India time, IST).
    PROFIT_ROLLOUT.start - date Day 1 unlocks (YYYY-MM-DD)
    PROFIT_ROLLOUT.time  - time of day each day unlocks (24h, HH:MM)
    Day N unlocks N-1 days after the start. To give a day its own date/time,
    add  unlock: "2026-10-01 18:00"  to that day.
    Until a day unlocks, its topics are hidden behind a countdown.

  Each day has one entry ("Day N"). Paste that day's Drive link into it
  when the material is ready.
*/

window.PROFIT_ROLLOUT = {
start: "2026-09-28",
time: "00:00"
};

window.PROFIT_CURRICULUM = [
{
day: 1,
title: "Market Foundation",
summary: "Stock markets, exchanges, orders and trading basics.",
icon: "market",
topics: [
{ name: "Day 1", link: "https://drive.google.com/file/d/15OYQFmslowov7n2PKnsj59l73oMVIovd/view?usp=sharing" }
]
},
{
day: 2,
title: "Technical Analysis",
summary: "Candlesticks, trends, indicators and chart reading.",
icon: "chart",
topics: [
{ name: "Day 2", link: "https://drive.google.com/file/d/14q1iu5vtMoDj-4FwLfSHLe7H85a0b4Tm/view?usp=sharing" }
]
},
{
day: 3,
title: "Trading Strategy",
summary: "Entry rules, exits and building a trading plan.",
icon: "strategy",
topics: [
{ name: "Day 3", link: "https://drive.google.com/file/d/1bq5S69Wf2utAxZRYU-qPVPriwQy_TKch/view?usp=sharing" }
]
},
{
day: 4,
title: "Risk Management",
summary: "Capital protection and disciplined execution.",
icon: "risk",
topics: [
{ name: "Day 4", link: "https://drive.google.com/file/d/1gchb3zk1pDQ6V-s5Sjqgidkaf0V7B8rW/view?usp=drivesdk" }
]
},
{
day: 5,
title: "Trading Psychology",
summary: "Emotions, patience and professional mindset.",
icon: "psychology",
topics: [
{ name: "Day 5", link: "https://drive.google.com/file/d/15PqhKHLPfMUcnPixLiYVdRGQIef1lw2f/view?usp=drivesdk" }
]
},
{
day: 6,
title: "Final Challenge",
summary: "Create and present your own trading framework.",
icon: "trophy",
topics: [
{ name: "Day 6", link: "https://drive.google.com/file/d/1L30Uq3GreZYAyFhU99phhHCMd6mX0O-z/view?usp=drive_link" }
]
}
];
