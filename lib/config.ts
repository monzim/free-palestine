var deadCount = 20057;
var childrenCount = 5350;
var woundedCount = 50000;

var bannerMessage = `More than ${deadCount.toLocaleString()} Palestinians killed by the Israeli army in the besieged Gaza Strip since October 7 (Last updated: 23 Dec, 23)`;

export const config = {
  cndUrl: "https://gaza.azureedge.net/",
  deadCount: deadCount,
  childrenCount: childrenCount,
  bannerMessage:
    bannerMessage ??
    `More than ${deadCount.toLocaleString()} Palestinians, including ${childrenCount.toLocaleString()} children have
                been killed by the Israeli army in the besieged Gaza Strip since
                October 7`,
  bannerLink:
    "https://apnews.com/article/israel-hamas-war-news-12-22-2023-7453c6f92d74eb1e12e506489031b91b",
};
