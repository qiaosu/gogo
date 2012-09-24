var RMBConvert = (function() {

    // Predefine the radix characters and currency symbols for output: 
	var CN = {
		'digits' : [ "零","壹","贰","叁","肆","伍","陆","柒","捌","玖" ], 
		'radices' : [ "","拾","佰","仟" ],
	    'bigRadices' : [ "","万","亿" ],
		'decimals' : [ "角","分" ],
		'symbol' : "人民币",
	    'dollar' : "元",
	    'integer' : "整"
	}

	var _private = {
        currencyDigits : "",   
		currency : "",
		integral : "",
		decimal : "",
		parts : "",
        options : {
            max : 999999999999.99  //default
        },
		init : function (currencyDigits, op) {
            /**
             * Validate input string
             */
			this.currencyDigits = currencyDigits.toString();

            this.setOptions(op);

            this.processPrepare();

            /**
             * Separate integral and decimal parts before processing coversion
             */
            this.parts = this.currencyDigits.split(".");

            if (this.parts.length > 1) {
                this.integral = this.parts[0];
                this.decimal = this.parts[1];
                // Cut down redundant decimal digits that are after the second.
                this.decimal = this.decimal.substr(0, 2);
            }else {
                this.integral = this.parts[0];
                this.decimal = "";
            }
		},
        setOptions : function (op) {
            for (var i in op) {
                if (op.hasOwnProperty(i)) {
                    this.options[i] = op[i];
                }
            }
            return op;
        },
        processPrepare : function () {
            /**
             * validate currency format
             */
            if (this.currencyDigits == "") {
                this.showLog("不能为空");
                return "";
            }
            if (this.currencyDigits.match(/[^,.\d]/) != null) {
                this.showLog("输入错误!");
                return "";
            }
            if ((this.currencyDigits).match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
                this.showLog("Illegal format of digit number!");
                return "";
            }

            /**
             * Normalize the format of input digits
             */
            this.currencyDigits = this.currencyDigits.replace(/,/g, ""); // Remove comma delimiters.
            this.currencyDigits = this.currencyDigits.replace(/^0+/, ""); // Trim zeros at the beginning. 

            /**
             * Assert the number is not greater than the maximum number.
             */
            if (Number(this.currencyDigits) > this.options.max) {
                this.showLog("Too large a number to convert!");
                return "";
            }
        },
		processIntegral : function () {
		   	var zeroCount = 0, 
				i, p, d, 
				quotient, modulus,
				output = "";
	        for (i = 0; i < this.integral.length; i++) {
	            p = this.integral.length - i - 1;
	            d = this.integral.substr(i, 1);
	            quotient = p / 4;
	            modulus = p % 4;
	            if (d == "0") {
	                zeroCount++;
	            } else {
	                if (zeroCount > 0){
	                    output += CN.digits[0];
	                }
	                zeroCount = 0;
	                output += CN.digits[Number(d)] + CN.radices[modulus];
	            }

	            if (modulus == 0 && zeroCount < 4) { 
	                output += CN.bigRadices[quotient];
	            }
	        }
	        output += CN.dollar;  
			return output;
		},
        processDecimal : function () {
            var output = "",
                i, d;
            for (i = 0; i < this.decimal.length; i++) {
                d = this.decimal.substr(i, 1);
                if (d != "0") {
                    output += CN.digits[Number(d)] + CN.decimals[i];
                }
            }
            return output;
        },
        processConfirm : function (output) {
            if (output == "") {
                output = CN.digits[0] + CN.dollar;
            }

            if (this.decimal == "" || parseInt(this.decimal,10) === 0) {
                output += CN.integer;
            }

            if ((this.parts[1] || "").length < 3 && output.substr(output.length - 1, 1) === CN.decimals[0]) {
                output += CN.integer;
            }
            return output;
        },
        showLog : function (msg) {
            try {
                console.log(msg);
            } catch (e) {
                
            }
        }
	}
    
    return {
        convert : function (currencyDigits, op) {
            var output = "";

            _private.init(currencyDigits, op);

            /**
             * Process integral part if it is larger than 0
             */
            if (Number(_private.integral) > 0) {
                output += _private.processIntegral();
            }

            /**
             * Process decimal part if there is
             */
            if (_private.decimal != "") {
                output += _private.processDecimal(); 
            }

            output = _private.processConfirm(output);

            return output;
        }
    };
})();