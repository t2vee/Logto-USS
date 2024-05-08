const timezonesData = [
    ['North America',
        ['(EST) Eastern Standard Time', 'est'],
        ['(CST) Central Standard Time', 'cst'],
        ['(MST) Mountain Standard Time', 'mst'],
        ['(PST) Pacific Standard Time', 'pst'],
        ['(AKST) Alaska Standard Time', 'hst'],
        ['(HST) Hawaii Standard Time', 'hst']
    ],
    ['Europe & Africa',
        ['(GMT) Greenwich Mean Time', 'gmt'],
        ['(CET) Central European Time', 'cet'],
        ['(EET) Eastern European Time', 'eet'],
        ['(WEST) Western European Summer Time', 'west'],
        ['(CAT) Central Africa Time', 'cat'],
        ['(EAT) East Africa Time (EAT)', 'eat']
    ],
    ['Asia',
        ['(MSK) Moscow Time', 'msk'],
        ['(IST) India Standard Time', 'ist'],
        ['(CST) China Standard Time', 'cst_china'],
        ['(JST) Japan Standard Time', 'jst'],
        ['(KST) Korea Standard Time', 'kst'],
        ['(WITA) Indonesia Central Standard Time', 'wita'],
    ],
    ['Australia & Pacific',
        ['(AWST) Australian Western Standard Time', 'awst'],
        ['(ACST) Australian Central Standard Time', 'acst'],
        ['(AEST) Australian Eastern Standard Time', 'aest'],
        ['(NZST) New Zealand Standard Time', 'nzst'],
        ['(FJT) Fiji Time', 'fjt'],
    ],
    ['South America',
        ['(ART) Argentina Time', 'art'],
        ['(BOT) Bolivia Time', 'bot'],
        ['(BRT) Brasilia Time', 'brt'],
        ['(CLT) Chile Standard Time', 'clt'],
    ]
];

const timezones = timezonesData.map(([groupName, ...timezones]) => ({
    name: groupName,
    timezones: timezones.map(([label, code]) => ({ label, code }))
}));

export default timezones;