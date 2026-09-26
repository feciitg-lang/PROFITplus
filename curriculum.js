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

  NOTE: the topics below are placeholders taken from the course outline.
  Replace them with the real topics and Drive links.
*/

window.PROFIT_ROLLOUT = {
start: "2026-09-27",
time: "00:00"
};

window.PROFIT_CURRICULUM = [
{
day: 1,
title: "Market Foundation",
summary: "Stock markets, exchanges, orders and trading basics.",
icon: "market",
topics: [
{ name: "How stock markets work", link: "" },
{ name: "Exchanges", link: "" },
{ name: "Order types", link: "" },
{ name: "Trading basics", link: "" }
]
},
{
day: 2,
title: "Technical Analysis",
summary: "Candlesticks, trends, indicators and chart reading.",
icon: "chart",
topics: [
{ name: "Candlesticks", link: "" },
{ name: "Trends", link: "" },
{ name: "Indicators", link: "" },
{ name: "Chart reading", link: "" }
]
},
{
day: 3,
title: "Trading Strategy",
summary: "Entry rules, exits and building a trading plan.",
icon: "strategy",
topics: [
{ name: "Entry rules", link: "" },
{ name: "Exits", link: "" },
{ name: "Building a trading plan", link: "" }
]
},
{
day: 4,
title: "Risk Management",
summary: "Capital protection and disciplined execution.",
icon: "risk",
topics: [
{ name: "Capital protection", link: "" },
{ name: "Disciplined execution", link: "" }
]
},
{
day: 5,
title: "Trading Psychology",
summary: "Emotions, patience and professional mindset.",
icon: "psychology",
topics: [
{ name: "Emotions", link: "" },
{ name: "Patience", link: "" },
{ name: "Professional mindset", link: "" }
]
},
{
day: 6,
title: "Final Challenge",
summary: "Create and present your own trading framework.",
icon: "trophy",
topics: [
{ name: "Create your trading framework", link: "" },
{ name: "Present your approach", link: "" }
]
}
];
