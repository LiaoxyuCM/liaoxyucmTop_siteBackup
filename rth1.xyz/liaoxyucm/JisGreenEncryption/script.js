const jisgreen_encryption_type = {
	"encryption": {
		"JisGreen": ["JisGren", "JisGreen", "JisGreeen"],
		"JiShi": ["JiSi", "JiShi", "JiShhi"],
		"JisKotlin": ["JisKotin", "JisKotlin", "JisKootlin"],
		"JisMua": ["JisMa", "JisMua", "JisMuua"],
		"ExcuseBox": ["ExcuseBx", "ExcuseBox", "ExcuseBoox"],
		"Xxx": ["Xx", "Xxx", "Xxxx"],
		"YYBH": ["YBH", "YYBH", "YYYBH"],
		"LTFH": ["LTF", "LTFH", "LTFHH"],
		"BJWX": ["BJW", "BJWX", "BJWXX"],
		"JisRmb": ["JisRb", "JisRmb", "JisRmmb"],
		"JisBo": ["JisB", "JisBo", "JisBoo"],
		"JisW": ["Jis", "JisW", "JisWw"],
		"JisSkyline": ["JisSkylne", "JisSkyline", "JisSkyliine"],
		"Reallove": ["Realove", "Reallove", "Realllove"],
		"N1010": ["0", "1", "."]
	},
	"decryption": {
		"JisGreen": [/JisGren/g, /JisGreen/g, /JisGreeen/g],
		"JiShi": [/JiSi/g, /JiShi/g, /JiShhi/g],
		"JisKotlin": [/JisKotin/g, /JisKotlin/g, /JisKootlin/g],
		"JisMua": [/JisMa/g, /JisMua/g, /JisMuua/g],
		"ExcuseBox": [/ExcuseBx/g, /ExcuseBox/g, /ExcuseBoox/g],
		"Xxx": [/Xx/g, /Xxx/g, /Xxxx/g],
		"YYBH": [/YBH/g, /YYBH/g, /YYYBH/g],
		"LTFH": [/LTF/g, /LTFH/g, /LTFHH/g],
		"BJWX": [/BJW/g, /BJWX/g, /BJWXX/g],
		"JisRmb": [/JisRb/g, /JisRmb/g, /JisRmmb/g],
		"JisBo": [/JisB/g, /JisBo/g, /JisBoo/g],
		"JisW": [/Jis/g, /JisW/g, /JisWw/g],
		"JisSkyline": [/JisSkylne/g, /JisSkyline/g, /JisSkyliine/g],
		"Reallove": [/Realove/g, /Reallove/g, /Realllove/g],
		"N1010": [/0/g, /1/g, /\./g]
	}
}


const jisgreen_encrypt = (original_text, type) => {
	let l = ""
	for (let i of original_text){
		l += i.charCodeAt(0).toString(2) + " "
	}
	l =  l.replace(/ /g, jisgreen_encryption_type["encryption"][type][2]).replace(/1/g, jisgreen_encryption_type["encryption"][type][1]).replace(/0/g, jisgreen_encryption_type["encryption"][type][0])
	return l
}

const jisgreen_decrypt = (original_text, type) => {
	let l = original_text.replace(jisgreen_encryption_type["decryption"][type][2], " ").replace(jisgreen_encryption_type["decryption"][type][1], "1").replace(jisgreen_encryption_type["decryption"][type][0], "0").slice(0, -1)

	j = l.split(" ")

	let res = ""
	for (let element of j){
		res += String.fromCharCode(parseInt(element, 2))
	}
	return res
}

const utf8ToBase64 = (str) => {
  const bytes = new TextEncoder().encode(str);
  const binString = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
  return btoa(binString);
}

const base64ToUtf8 = (base64) => {
  const binString = atob(base64);
  const bytes = Uint8Array.from(binString, char => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

const jis2_encrypt = (original_text, zero_width_required = false) => {
	const zero_width = '\u200B';
	function insertBetween(str){
		return str.split('').map(ch=>zero_width+ch).join('')+zero_width;
	}
	const raw = original_text;
	const b64 = utf8ToBase64(raw);
	const rev = b64.split('').reverse().join('');
	const part1 = zero_width_required ? insertBetween('[JIS2]' ) : "[JIS2]";
	const part2 = zero_width_required ? insertBetween('abcdefghijklmnopqrstuvwxyz') : 'abcdefghijklmnopqrstuvwxyz';
	const part3 = zero_width_required ? insertBetween('@jisgreen#kotlinbox') : '@jisgreen#kotlinbox';
	let out = part1+(zero_width_required ? insertBetween(rev) : rev)+part2+part3;
	if(out.length>1000){
		out = out.slice(0,1000)+(zero_width_required ?  out.slice(1000).replaceAll(zero_width,'') : out.slice(1000));
	}
	return out
}

const jis2_decrypt = (encrypted_text) => {
	try {
		const zero_width = '\u200B';

		const withoutZ = encrypted_text.replaceAll(zero_width, '');
		const part1 = '[JIS2]';
		const part2 = 'abcdefghijklmnopqrstuvwxyz';
		const part3 = '@jisgreen#kotlinbox';
		let base64Part = withoutZ;
		if (base64Part.startsWith(part1)) {
			base64Part = base64Part.slice(part1.length);
		}
		if (base64Part.endsWith(part3)) {
			base64Part = base64Part.slice(0, -part3.length);
		}
		if (base64Part.endsWith(part2)) {
			base64Part = base64Part.slice(0, -part2.length);
		}
		const reversedBase64 = base64Part.split('').reverse().join('');
		let validBase64 = reversedBase64;
		while (validBase64.length % 4 !== 0) {
			validBase64 += '=';
		}

		const decoded = base64ToUtf8(validBase64);
		return decoded;
	} catch (e) {
		show_notification_inside("JIS2 Syntax Error", "#FF000060")
	}
};

const show_notification_inside = (text, color_ = "#00FFFF60") => {
	n = document.createElement("div");
	n.className = "notification"
	content = document.createElement("p");
	content.textContent = text;
	content.style.padding = "5px";
	n.appendChild(content);
	n.style.backgroundColor = color_;
	document.body.appendChild(n);
	n.style.animation = "fadeIn ease-in-out 2s";
	setTimeout(() => document.body.removeChild(n), 2000);
}

document.addEventListener("DOMContentLoaded", () => {
	const encrypt = document.querySelector(".encrypt")
	const decrypt = document.querySelector(".decrypt")
	const encryption_type = document.querySelector(".encryption_type")
	const ext = document.querySelector(".extensions")
	const copy_result = document.querySelector(".copy_rs")

	encrypt.addEventListener("click", () => {
		const input = document.querySelector(".input").value
		const output = document.querySelector(".output")
		output.style.color = "white"
		let l = ext.value === "JIS2" ? jisgreen_encrypt(jis2_encrypt(input, false), encryption_type.value) : jisgreen_encrypt(input, encryption_type.value)
		output.value = l
	})


	decrypt.addEventListener("click", () => {
		const input = document.querySelector(".input").value
		const output = document.querySelector(".output")
		let res = ext.value === "JIS2" ? jis2_decrypt(jisgreen_decrypt(input, encryption_type.value)) : jisgreen_decrypt(input, encryption_type.value)
		output.value = res
	})
	
	copy_result.addEventListener("click", async () => {
		const output = document.querySelector(".output");
		await navigator.clipboard.writeText(output.value);
		show_notification_inside("Copied!");
	})
});