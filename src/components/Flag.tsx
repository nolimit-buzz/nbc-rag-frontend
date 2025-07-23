// components/Flag.tsx

const AFRICAN_COUNTRY_CODES: Record<string, string> = {
    Algeria: "dz", Angola: "ao", Benin: "bj", Botswana: "bw", "Burkina Faso": "bf",
    Burundi: "bi", CaboVerde: "cv", Cameroon: "cm", "Central African Republic": "cf",
    Chad: "td", Comoros: "km", "Congo (Brazzaville)": "cg", "Congo (Kinshasa)": "cd",
    "Cote d'Ivoire": "ci", Djibouti: "dj", Egypt: "eg", "Equatorial Guinea": "gq",
    Eritrea: "er", Eswatini: "sz", Ethiopia: "et", Gabon: "ga", Gambia: "gm", Ghana: "gh",
    Guinea: "gn", "Guinea-Bissau": "gw", Kenya: "ke", Lesotho: "ls", Liberia: "lr",
    Libya: "ly", Madagascar: "mg", Malawi: "mw", Mali: "ml", Mauritania: "mr",
    Mauritius: "mu", Morocco: "ma", Mozambique: "mz", Namibia: "na", Niger: "ne",
    Nigeria: "ng", Rwanda: "rw", "Sao Tome and Principe": "st", Senegal: "sn",
    Seychelles: "sc", "Sierra Leone": "sl", Somalia: "so", "South Africa": "za",
    "South Sudan": "ss", Sudan: "sd", Tanzania: "tz", Togo: "tg", Tunisia: "tn",
    Uganda: "ug", Zambia: "zm", Zimbabwe: "zw",
  };
  
  function isoToEmoji(code: string) {
    return code
      .toUpperCase()
      .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
  }
  
  export const Flag = ({ countryName }: { countryName: string }) => {
    const code = AFRICAN_COUNTRY_CODES[countryName];
    if (!code) return <span>🌍</span>;
  
    return <span style={{ fontSize: '5rem' }}>{isoToEmoji(code)}</span>;
  };
  