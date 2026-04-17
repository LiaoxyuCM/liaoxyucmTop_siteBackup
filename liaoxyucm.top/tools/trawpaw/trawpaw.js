export class Trawpaw {
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
}