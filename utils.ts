const mangso = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

function doc_block_3_so(so: string) {
    let tram = parseInt(so[0]);
    let chuc = parseInt(so[1]);
    let donvi = parseInt(so[2]);
    let ketqua = "";

    if (tram == 0 && chuc == 0 && donvi == 0) return "";

    ketqua += mangso[tram] + " trăm";

    if (chuc == 0 && donvi != 0) {
        ketqua += " lẻ " + mangso[donvi];
    }
    
    if (chuc == 1) {
        ketqua += " mười";
        if (donvi == 1) ketqua += " một";
        else if (donvi == 5) ketqua += " lăm";
        else if (donvi != 0) ketqua += " " + mangso[donvi];
    }
    
    if (chuc > 1) {
        ketqua += " " + mangso[chuc] + " mươi";
        if (donvi == 1) ketqua += " mốt";
        else if (donvi == 5) ketqua += " lăm";
        else if (donvi == 4) ketqua += " tư";
        else if (donvi != 0) ketqua += " " + mangso[donvi];
    }
    return ketqua;
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};

export const toRoman = (num: number): string => {
  const map: Record<string, number> = {
    M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1
  };
  let result = '';
  let n = num;
  for (const key in map) {
    while (n >= map[key]) {
      result += key;
      n -= map[key];
    }
  }
  return result || '';
};

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const readNumberToWords = (number: number): string => {
    if (number === 0) return "Không đồng";
    let str = Math.round(number).toString();
    
    // Pad with zeros to make length divisible by 3
    while (str.length % 3 !== 0) {
        str = "0" + str;
    }

    const groups = [];
    for (let i = 0; i < str.length; i += 3) {
        groups.push(str.slice(i, i + 3));
    }

    let ketqua = "";
    const suffixes = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];
    
    for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        const suffixIndex = groups.length - 1 - i;
        const suffix = suffixes[suffixIndex];
        
        if (group === "000") continue;

        let read = doc_block_3_so(group);
        
        // Xử lý số 0 ở đầu dãy (ví dụ 054 -> năm mươi tư thay vì không trăm năm mươi tư)
        if (ketqua === "") {
             if (read.indexOf("không trăm") === 0) {
                 read = read.substr(10).trim();
                 if (read.startsWith("lẻ")) {
                     read = read.substr(2).trim();
                 }
             }
        }

        ketqua += " " + read + " " + suffix;
    }

    ketqua = ketqua.replace(/\s+/g, ' ').trim();
    
    if (ketqua.length === 0) return "Không đồng";

    ketqua = ketqua.charAt(0).toUpperCase() + ketqua.slice(1);
    
    return ketqua + " đồng chẵn";
};

// Simple English Number Reader
export const readNumberToWordsEn = (n: number): string => {
    if (n < 0) return "Minus " + readNumberToWordsEn(-n);
    if (n === 0) return "Zero VND";
    
    const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    const num = ('000000000' + n).slice(-9); // support up to 999 million for simplicity in this context
    
    // Recursive function for groups of 3
    const convertGroup = (n: number): string => {
        if(n === 0) return '';
        if(n < 20) return a[n];
        if(n < 100) return b[Math.floor(n / 10)] + (n % 10 ? '-' + a[n % 10] : ' ');
        return a[Math.floor(n / 100)] + 'hundred ' + (n % 100 === 0 ? '' : 'and ' + convertGroup(n % 100));
    }
    
    let str = "";
    
    // Billions (Support up to trillion if needed but basic implementation here)
    if(n >= 1000000000) return "Amount is too large for auto-read"; 

    const millions = Math.floor(n / 1000000);
    const thousands = Math.floor((n % 1000000) / 1000);
    const units = Math.floor(n % 1000);

    if (millions > 0) str += convertGroup(millions) + "million ";
    if (thousands > 0) str += convertGroup(thousands) + "thousand ";
    if (units > 0) str += convertGroup(units);

    return str.trim() + " VND only";
}
