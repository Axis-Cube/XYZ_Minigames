import { world } from "@minecraft/server"

export const SYM = '\ue131'
export const SCOLOR = '§u'
export const COPYRIGHT = '§bwww.mcxyz.ru'
export const MAP_NAME = '§l§cA§qxi§9s §4M§ci§6n§gi §eG§aa§bm§9e§us§r'

export const MINECRAFT_PICKAXES = ['wooden_pickaxe','stone_pickaxe','iron_pickaxe','diamond_pickaxe','netherite_pickaxe']
export const MINECRAFT_DIFFICULTIES = ['peaceful', 'easy', 'normal', 'hard']
export const MINECRAFT_DIFFICULTIES_NAME = ['%options.difficulty.peaceful', '%options.difficulty.easy', '%options.difficulty.normal', '%options.difficulty.hard']
export const DIM = world.getDimension('overworld')

export const CHAT_CODES = {
    cat: '\ue1e0',
    pepe: '\ue1e1',
    peped: '\ue1e2',
    sym: SYM,
    s: '§',
    nerd: '\ue1e3'
}

export const DATABASE_IDS = {
    settings_perm: 2001,
    bw_settings: 1005,
}

export const CHAT_CODES_AV = {
    pepe: true,
    peped: true,
}

export const REGION_CODES = [
    "UN", "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AN", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CS", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS", "XK", "YE", "YT", "ZA", "ZM", "ZW"
]

export const REGION_NAMES = {
    UN: "the Earth", AF: "Afghanistan", AX: "Aland Islands", AL: "Albania", DZ: "Algeria", AS: "American Samoa", AD: "Andorra", AO: "Angola", AI: "Anguilla", AQ: "Antarctica", AG: "Antigua and Barbuda", AR: "Argentina", AM: "Armenia", AW: "Aruba", AU: "Australia", AT: "Austria", AZ: "Azerbaijan", BS: "Bahamas", BH: "Bahrain", BD: "Bangladesh", BB: "Barbados", BY: "Belarus", BE: "Belgium", BZ: "Belize", BJ: "Benin", BM: "Bermuda", BT: "Bhutan", BO: "Bolivia", BQ: "Bonaire, Sint Eustatius and Saba", BA: "Bosnia and Herzegovina", BW: "Botswana", BV: "Bouvet Island", BR: "Brazil", IO: "British Indian Ocean Territory", BN: "Brunei Darussalam", BG: "Bulgaria", BF: "Burkina Faso", BI: "Burundi", KH: "Cambodia", CM: "Cameroon", CA: "Canada", CV: "Cape Verde", KY: "Cayman Islands", CF: "Central African Republic", TD: "Chad", CL: "Chile", CN: "China", CX: "Christmas Island", CC: "Cocos (Keeling) Islands", CO: "Colombia", KM: "Comoros", CG: "Congo", CD: "Congo, Democratic Republic of the Congo", CK: "Cook Islands", CR: "Costa Rica", CI: "Cote D'Ivoire", HR: "Croatia", CU: "Cuba", CW: "Curacao", CY: "Cyprus", CZ: "Czech Republic", DK: "Denmark", DJ: "Djibouti", DM: "Dominica", DO: "Dominican Republic", EC: "Ecuador", EG: "Egypt", SV: "El Salvador", GQ: "Equatorial Guinea", ER: "Eritrea", EE: "Estonia", ET: "Ethiopia", FK: "Falkland Islands (Malvinas)", FO: "Faroe Islands", FJ: "Fiji", FI: "Finland", FR: "France", GF: "French Guiana", PF: "French Polynesia", TF: "French Southern Territories", GA: "Gabon", GM: "Gambia", GE: "Georgia", DE: "Germany", GH: "Ghana", GI: "Gibraltar", GR: "Greece", GL: "Greenland", GD: "Grenada", GP: "Guadeloupe", GU: "Guam", GT: "Guatemala", GG: "Guernsey", GN: "Guinea", GW: "Guinea-Bissau", GY: "Guyana", HT: "Haiti", HM: "Heard Island and Mcdonald Islands", VA: "Holy See (Vatican City State)", HN: "Honduras", HK: "Hong Kong", HU: "Hungary", IS: "Iceland", IN: "India", ID: "Indonesia", IR: "Iran, Islamic Republic of", IQ: "Iraq", IE: "Ireland", IM: "Isle of Man", IL: "Israel", IT: "Italy", JM: "Jamaica", JP: "Japan", JE: "Jersey", JO: "Jordan", KZ: "Kazakhstan", KE: "Kenya", KI: "Kiribati", KP: "Korea, Democratic People's Republic of", KR: "Korea, Republic of", XK: "Kosovo", KW: "Kuwait", KG: "Kyrgyzstan", LA: "Lao People's Democratic Republic", LV: "Latvia", LB: "Lebanon", LS: "Lesotho", LR: "Liberia", LY: "Libyan Arab Jamahiriya", LI: "Liechtenstein", LT: "Lithuania", LU: "Luxembourg", MO: "Macao", MK: "Macedonia, the Former Yugoslav Republic of", MG: "Madagascar", MW: "Malawi", MY: "Malaysia", MV: "Maldives", ML: "Mali", MT: "Malta", MH: "Marshall Islands", MQ: "Martinique", MR: "Mauritania", MU: "Mauritius", YT: "Mayotte", MX: "Mexico", FM: "Micronesia, Federated States of", MD: "Moldova, Republic of", MC: "Monaco", MN: "Mongolia", ME: "Montenegro", MS: "Montserrat", MA: "Morocco", MZ: "Mozambique", MM: "Myanmar", NA: "Namibia", NR: "Nauru", NP: "Nepal", NL: "Netherlands", AN: "Netherlands Antilles", NC: "New Caledonia", NZ: "New Zealand", NI: "Nicaragua", NE: "Niger", NG: "Nigeria", NU: "Niue", NF: "Norfolk Island", MP: "Northern Mariana Islands", NO: "Norway", OM: "Oman", PK: "Pakistan", PW: "Palau", PS: "Palestinian Territory, Occupied", PA: "Panama", PG: "Papua New Guinea", PY: "Paraguay", PE: "Peru", PH: "Philippines", PN: "Pitcairn", PL: "Poland", PT: "Portugal", PR: "Puerto Rico", QA: "Qatar", RE: "Reunion", RO: "Romania", RU: "Russian Federation", RW: "Rwanda", BL: "Saint Barthelemy", SH: "Saint Helena", KN: "Saint Kitts and Nevis", LC: "Saint Lucia", MF: "Saint Martin", PM: "Saint Pierre and Miquelon", VC: "Saint Vincent and the Grenadines", WS: "Samoa", SM: "San Marino", ST: "Sao Tome and Principe", SA: "Saudi Arabia", SN: "Senegal", RS: "Serbia", CS: "Serbia and Montenegro", SC: "Seychelles", SL: "Sierra Leone", SG: "Singapore", SX: "Sint Maarten", SK: "Slovakia", SI: "Slovenia", SB: "Solomon Islands", SO: "Somalia", ZA: "South Africa", GS: "South Georgia and the South Sandwich Islands", SS: "South Sudan", ES: "Spain", LK: "Sri Lanka", SD: "Sudan", SR: "Suriname", SJ: "Svalbard and Jan Mayen", SZ: "Swaziland", SE: "Sweden", CH: "Switzerland", SY: "Syrian Arab Republic", TW: "Taiwan, Province of China", TJ: "Tajikistan", TZ: "Tanzania, United Republic of", TH: "Thailand", TL: "Timor-Leste", TG: "Togo", TK: "Tokelau", TO: "Tonga", TT: "Trinidad and Tobago", TN: "Tunisia", TR: "Turkey", TM: "Turkmenistan", TC: "Turks and Caicos Islands", TV: "Tuvalu", UG: "Uganda", UA: "Ukraine", AE: "United Arab Emirates", GB: "United Kingdom", US: "United States", UM: "United States Minor Outlying Islands", UY: "Uruguay", UZ: "Uzbekistan", VU: "Vanuatu", VE: "Venezuela", VN: "Viet Nam", VG: "Virgin Islands, British", VI: "Virgin Islands, U.s.", WF: "Wallis and Futuna", EH: "Western Sahara", YE: "Yemen", ZM: "Zambia", ZW: "Zimbabwe"
};

export const ICONS = {
    back: 'textures/ui/icons/action/back',
    del: 'textures/ui/icons/action/del',
    edit: 'textures/ui/icons/action/edit',
    add: 'textures/ui/icons/action/add',
    act: 'textures/ui/icons/action/act',
    den: 'textures/ui/icons/action/den',
    import: 'textures/ui/icons/action/import',
    export: 'textures/ui/icons/action/export',
    settings: 'textures/ui/icons/action/settings',
    customize: 'textures/ui/icons/action/customize',
    crown: 'textures/ui/icons/action/crown',
    decrown: 'textures/ui/icons/action/decrown',
    dice: 'textures/ui/icons/action/dice',
    pl3: 'textures/ui/icons/plr3',
    pl2: 'textures/ui/icons/plr2',
    pl1: 'textures/ui/icons/plr1',
    plsel: 'textures/ui/icons/plrsel',
    store: 'textures/ui/icons/store/logo'
}