var deadCount = 30035;
var childrenCount = 13000;
var woundedCount = 50000;

var bannerMessage = `More than ${deadCount.toLocaleString()} Palestinians killed by the Israeli army in the besieged Gaza Strip since October 7 (Last updated: 29 Feb, 24)`;

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
    "https://www.aljazeera.com/news/2024/2/29/gaza-death-toll-surpasses-30000-with-no-let-up-in-israeli-bombardment",
};
