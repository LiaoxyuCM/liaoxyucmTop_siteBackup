class Trawpaw {
	constructor(memories = 128, maxvaluepermem = 127) {
		const validMemories = [128, 1024, 65536];
		const validMaxValues = [127, 1023, 65535];
		
		if (!validMemories.includes(memories)) {
			throw new Error(`Invalid memories value. Must be one of: ${validMemories.join(', ')}`);
		}
		if (!validMaxValues.includes(maxvaluepermem)) {
			throw new Error(`Invalid maxvaluepermem value. Must be one of: ${validMaxValues.join(', ')}`);
		}
		this.memories = Array(memories).fill(0);
		this.nullmem = [...this.memories];
		this.maxvaluepermem = maxvaluepermem + 1;
		this.datalist = {};
		this.cursor = 0;
	}
	clearHistory() {
		this.memories = [...this.nullmem];
		this.datalist = {};
		this.cursor = 0;
	}
	execute(code, getinput = "", clearHistory = false) {
		let inputcur = 0;
		const bracketlist = [];
		let result = "";
		let col = 0;
		let data_definition = false;
		let special = 0;
		const sleep = (seconds) => {
			const start = Date.now();
			while (Date.now() - start < seconds * 1000) {
			}
		};
		const randint01 = () => Math.floor(Math.random() * 2);
		while (col < code.length) {
			if (special === 1) {
				special = 2;
			} else if (special === 2) {
				special = 0;
			}
			if (!data_definition) {
				switch (code[col]) {
					case "+":
						this.memories[this.cursor] = (this.memories[this.cursor] + 1) % this.maxvaluepermem;
						special = 0;
						break;
					case "-":
						this.memories[this.cursor] = (this.memories[this.cursor] - 1) % this.maxvaluepermem;
						special = 0;
						break;
					case "*":
						this.memories[this.cursor] = (this.memories[this.cursor] * 2) % this.maxvaluepermem;
						special = 0;
						break;
					case "/":
						this.memories[this.cursor] = Math.floor(this.memories[this.cursor] / 2) % this.maxvaluepermem;
						special = 0;
						break;
					case "#":
						if (special) {
							this.cursor = 0;
						} else {
							this.memories[this.cursor] = 0;
						}
						special = 0;
						break;
					case "<":
						this.cursor = (this.cursor - 1 + this.memories.length) % this.memories.length;
						special = 0;
						break;
					case ">":
						this.cursor = (this.cursor + 1) % this.memories.length;
						special = 0;
						break;
					case ",":
						try {
							let charCode;
							if (getinput && getinput[inputcur] && !isNaN(getinput.charCodeAt(inputcur))) {
								charCode = getinput.charCodeAt(inputcur);
								inputcur++;
							} else {
								const userInput = prompt("Input a character: ") || "";
								charCode = userInput ? userInput.charCodeAt(0) : 0;
							}
							this.memories[this.cursor] = charCode % this.maxvaluepermem;
						} catch (e) {
							this.memories[this.cursor] = 0;
						}
						special = 0;
						break;
					case ".":
						if (special) {
							result += this.memories[this.cursor].toString();
						} else {
							result += String.fromCharCode(this.memories[this.cursor]);
						}
						special = 0;
						break;
					case "$":
						data_definition = true;
						special = 0;
						break;
					case "_":
						if (special) {
							sleep(0.1);
						} else {
							sleep(1);
						}
						special = 0;
						break;
					case "&":
						if (special) {
							return {
								status: 2,
								result: result,
								cursor: this.cursor,
								datalistlength: Object.keys(this.datalist).length
							};
						} else {
							alert("Breakpoint reached. Press Enter to continue...");
						}
						special = 0;
						break;
					case "!":
						special = 1;
						break;
					case "[":
						bracketlist.push({
							bracket: "[",
							col: col,
							special: Boolean(special),
							ranges: 0
						});
						if (Boolean(special)) {
							if (randint01() === 0) {
								let token = 1;
								while (token) {
									col++;
									if (col >= code.length) {
										return {
											status: 1,
											message: `ERR: Unclosed bracket at col ${col}`,
											cursor: this.cursor,
											datalistlength: Object.keys(this.datalist).length
										};
									}
									if (["[", "{", "("].includes(code[col])) {
										token++;
									}
									if (["]", "}", ")"].includes(code[col])) {
										if (token === 1) {
											if (code[col] !== "]") {
												return {
													status: 1,
													message: `ERR: This bracket is not properly closed at col ${col}.`,
													cursor: this.cursor,
													datalistlength: Object.keys(this.datalist).length
												};
											} else {
												token--;
											}
										} else {
											token--;
										}
									}
								}
								bracketlist.pop();
							}
						}
						special = 0;
						break;
					case "(":
						bracketlist.push({
							bracket: "(",
							col: col,
							special: Boolean(special)
						});
						if (Boolean(special)) {
							if (this.memories[this.cursor] !== 0) {
								let token = 1;
								while (token) {
									col++;
									if (col >= code.length) {
										return {
											status: 1,
											message: `ERR: Unclosed bracket at col ${col}`,
											cursor: this.cursor,
											datalistlength: Object.keys(this.datalist).length
										};
									}
									if (["[", "{", "("].includes(code[col])) {
										token++;
									}
									if (["]", "}", ")"].includes(code[col])) {
										if (token === 1) {
											if (code[col] !== ")") {
												return {
													status: 1,
													message: `ERR: This bracket is not properly closed at col ${col}.`,
													cursor: this.cursor,
													datalistlength: Object.keys(this.datalist).length
												};
											} else {
												token--;
											}
										} else {
											token--;
										}
									}
								}
								bracketlist.pop();
							}
						} else {
							if (this.memories[this.cursor] === 0) {
								let token = 1;
								while (token) {
									col++;
									if (col >= code.length) {
										return {
											status: 1,
											message: `ERR: Unclosed bracket at col ${col}`,
											cursor: this.cursor,
											datalistlength: Object.keys(this.datalist).length
										};
									}
									if (["[", "{", "("].includes(code[col])) {
										token++;
									}
									if (["]", "}", ")"].includes(code[col])) {
										if (token === 1) {
											if (code[col] !== ")") {
												return {
													status: 1,
													message: `ERR: This bracket is not properly closed at col ${col}.`,
													cursor: this.cursor,
													datalistlength: Object.keys(this.datalist).length
												};
											} else {
												token--;
											}
										} else {
											token--;
										}
									}
								}
								bracketlist.pop();
							}
						}
						special = 0;
						break;
					case "{":
						bracketlist.push({
							bracket: "{",
							col: col,
							special: Boolean(special)
						});
						let token = 1;
						while (token) {
							col++;
							if (col >= code.length) {
								return {
									status: 1,
									message: `ERR: Unclosed bracket at col ${col}`,
									cursor: this.cursor,
									datalistlength: Object.keys(this.datalist).length
								};
							}
							if (["[", "{", "("].includes(code[col])) {
								token++;
							}
							if (["]", "}", ")"].includes(code[col])) {
								if (token === 1) {
									if (code[col] !== "}") {
										return {
											status: 1,
											message: `ERR: This bracket is not properly closed at col ${col}.`,
											cursor: this.cursor,
											datalistlength: Object.keys(this.datalist).length
										};
									} else {
										token--;
									}
								} else {
									token--;
								}
							}
						}
						bracketlist.pop();
						special = 0;
						break;
					case "]":
						if (bracketlist.length === 0 || bracketlist[bracketlist.length - 1].bracket !== "[") {
							return {
								status: 1,
								message: `ERR: This bracket is not properly closed at col ${col}.`,
								cursor: this.cursor,
								datalistlength: Object.keys(this.datalist).length
							};
						} else if (bracketlist[bracketlist.length - 1].special) {
						} else if (bracketlist[bracketlist.length - 1].ranges === 0) {
							col = bracketlist[bracketlist.length - 1].col;
							bracketlist[bracketlist.length - 1].ranges += 1;
						} else {
							bracketlist.pop();
						}
						special = 0;
						break;
					default:
						break;
				}
			} else {
				const name = code[col];
				col++;
				if (col >= code.length) {
					return {
						status: 1,
						message: `ERR: Missing data controller at col ${col}`,
						cursor: this.cursor,
						datalistlength: Object.keys(this.datalist).length
					};
				}
				const controller = code[col].toUpperCase();
				if (!["I", "W", "R", "L", "D"].includes(controller)) {
					return {
						status: 1,
						message: `ERR: Invalid data controller at col ${col}.`,
						cursor: this.cursor,
						datalistlength: Object.keys(this.datalist).length
					};
				}
				try {
					switch (controller) {
						case "I":
							this.datalist[name] = {
								type: "number",
								value: 0
							};
							break;
						case "W":
							if (!this.datalist.hasOwnProperty(name)) {
								throw new Error(`Data '${name}' not initialized`);
							}
							this.datalist[name].type = "number";
							this.datalist[name].value = this.memories[this.cursor];
							break;
						case "R":
							if (!this.datalist.hasOwnProperty(name)) {
								throw new Error(`Data '${name}' not initialized`);
							}
							if (this.datalist[name].type === "number") {
								this.memories[this.cursor] = this.datalist[name].value;
							} else if (this.datalist[name].type === "linkmemory") {
								this.memories[this.cursor] = this.memories[this.datalist[name].value];
							}
							break;
						case "L":
							if (!this.datalist.hasOwnProperty(name)) {
								throw new Error(`Data '${name}' not initialized`);
							}
							this.datalist[name].type = "linkmemory";
							this.datalist[name].value = this.cursor;
							break;
						case "D":
							if (!this.datalist.hasOwnProperty(name)) {
								throw new Error(`Data '${name}' not initialized`);
							}
							delete this.datalist[name];
							break;
					}
				} catch (e) {
					return {
						status: 1,
						message: `ERR: ${e.message} at col ${col}`,
						cursor: this.cursor,
						datalistlength: Object.keys(this.datalist).length
					};
				}
				data_definition = false;
			}
			col++;
		}
		if (clearHistory) {
			this.clearHistory();
		}
		return {
			status: 0,
			result: result,
			cursor: this.cursor,
			datalistlength: Object.keys(this.datalist).length
		};
	}
};

class Waste {
    constructor(){
        this.ptr=0;
        this.saved=0;
    }
    clearHistory() {
        this.ptr=0;
        this.saved=0;
    }
    async waste(code) {
        let ptr = this.ptr, saved = this.saved, out = '';

        async function walk(start, end) {
            for (let i = start; i < end; ) {
            const ch = code[i];
            switch (ch) {
                case '<': case '＜': saved = ptr; break;
                case '>': case '＞': ptr = saved; break;
                case '^': case '＾': ptr = Math.random() < 0.5 ? 0 : 1; break;
                case '@': case '＠': out = ''; break;
                case ',': case '，': out += code.slice(i + 1); return -1;
                case '#': case '＃': ptr = 0; break;
                case '+': case '＋': if (!isNaN(ptr)) ptr++; break;
                case '-': case '－': if (!isNaN(ptr)) ptr--; break;
                case '*': case '＊': if (!isNaN(ptr)) ptr *= 2; break;
                case '/': case '／': if (!isNaN(ptr)) ptr = Math.floor(ptr / 2); break;
                case '%': case '％': out += ptr; break;
                case '&': case '＆': alert('Breakpoint'); break;
                case '.': case '．': out += String.fromCharCode(ptr); break;
                case ':': case '：': out += '\n'; break;
                case '?': case '？': await new Promise(r => setTimeout(r, 1)); break;
                case '!': case '！': return -1;
                case '[': case '［': {
                let d = 1, j = i + 1;
                while (j < code.length && d) { const c = code[j]; if (c === '[' || c === '［') d++; if (c === ']' || c === '］') d--; j++; }
                for (let rep = 0; rep < 2; rep++) if ((await walk(i + 1, j - 1)) === -1) return -1;
                i = j - 1; break;
                }
                case '(' : case '（': {
                let d = 1, j = i + 1;
                while (j < code.length && d) { const c = code[j]; if (c === '(' || c === '（') d++; if (c === ')' || c === '）') d--; j++; }
                if (Math.random() < 0.5) { i++; break; }
                if ((await walk(i + 1, j - 1)) === -1) return -1;
                i = j - 1; break;
                }
                case '{': case '｛': {
                let d = 1, j = i + 1;
                while (j < code.length && d) { const c = code[j]; if (c === '{' || c === '｛') d++; if (c === '}' || c === '｝') d--; j++; }
                i = j - 1; break;
                }
            }
            i++;
            }
            return 0;
        }
        await walk(0, code.length);
        this.ptr=ptr;
        this.saved=saved;
        return out;
    }
}

////////////MAIN/////////////
document.addEventListener("DOMContentLoaded", () => {
	var executors = [];
	var id = 0;
	function wasteexec(iden) {
		var elem = document.querySelector(`div.section_1 div[data-id='${iden}']`);
		var code = prompt("Enter waste code");
		var result = executors[iden].waste(code);
		elem.innerHTML = `
			<p>Waste<button onclick="wasteexec(${id})">Execute</button><button onclick="wasteclhis(${id})">Clear History</button></p>
			<p>数据:</p>
			<ul>
				<li>
					<p>output = ${result}</p>
					<p>ptr = ${executors[iden].ptr}</p>
					<p>saved = ${executors[iden].saved}</p>
				</li>
			</ul>
		`;
	};
	document.querySelector("[create='waste']").addEventListener("click", () => {
		executors.push(new Waste());
		var elem = document.createElement("div");
		elem.setAttribute("bordered", "");
		elem.setAttribute("data-id", id);
		elem.innerHTML = `
			<p>Waste<button onclick="wasteexec(${id})">Execute</button><button onclick="wasteclhis(${id})">Clear History</button></p>
			<p>数据:</p>
			<ul>
				<li>
					<p>ptr = 0</p>
					<p>saved = 0</p>
				</li>
			</ul>
		`;
		document.querySelector(".section_1").appendChild(elem);
		id++;
	})
});
