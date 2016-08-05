// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509

(function () {
	"use strict";

	var app = WinJS.Application;
	var activation = Windows.ApplicationModel.Activation;
	var isFirstActivation = true;

	app.onactivated = function (args) {
		if (args.detail.kind === activation.ActivationKind.voiceCommand) {
			// TODO: Handle relevant ActivationKinds. For example, if your app can be started by voice commands,
			// this is a good place to decide whether to populate an input field or choose a different initial view.
		}
		else if (args.detail.kind === activation.ActivationKind.launch) {
			// A Launch activation happens when the user launches your app via the tile
			// or invokes a toast notification by clicking or tapping on the body.
			if (args.detail.arguments) {
				// TODO: If the app supports toasts, use this value from the toast payload to determine where in the app
				// to take the user in response to them invoking a toast notification.
			}
			else if (args.detail.previousExecutionState === activation.ApplicationExecutionState.terminated) {
				// TODO: This application had been suspended and was then terminated to reclaim memory.
				// To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
				// Note: You may want to record the time when the app was last suspended and only restore state if they've returned after a short period.
			}
		}

		if (!args.detail.prelaunchActivated) {
			// TODO: If prelaunchActivated were true, it would mean the app was prelaunched in the background as an optimization.
			// In that case it would be suspended shortly thereafter.
			// Any long-running operations (like expensive network or disk I/O) or changes to user state which occur at launch
			// should be done here (to avoid doing them in the prelaunch case).
			// Alternatively, this work can be done in a resume or visibilitychanged handler.
		}

		if (isFirstActivation) {
			// TODO: The app was activated and had not been running. Do general startup initialization here.
			document.addEventListener("visibilitychange", onVisibilityChanged);
			args.setPromise(WinJS.UI.processAll());
		}

		isFirstActivation = false;
	};

	function onVisibilityChanged(args) {
		if (!document.hidden) {
			// TODO: The app just became visible. This may be a good time to refresh the view.
		}
	}

	app.oncheckpoint = function (args) {
		// TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
		// You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
		// If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
	};


    //onloaded方法
	app.onloaded = function (args) {
	    //找到cavans，返回cavans的drawContext
	    context = document.querySelector(".bindingDescriptorsOutputCanvas").getContext("2d");
        //绑定输入事件
	    bindInputEvents();

	    //当objectPosition的属性发生改变的时候，会执行对应的方法
	    WinJS.Binding.bind(objectPosition, {
	        position: {
	            x: onPositionChange,
	            y: onPositionChange
	        },
	        color: {
	            r: onColorChange,
	            g: onColorChange,
	            b: onColorChange
	        }
	    });
	}

	app.start();


	var context;
    //定义一个类
	var NumericTextInput = WinJS.Class.define(
        function (element, selector, initialValue, changeCallback) {
            //类的element
            this.element = element.querySelector(selector);
            //类element的值
            this.element.value = initialValue;
            //调用_onchange()方法
            this._onchange();
            //当element的值发生改变的时候给element绑定事件
            element.addEventListener("change", this._onchange.bind(this));
            //指定this.onvaluechange
            this.onvaluechange = changeCallback;
        },
        { 
            onvaluechange: function (newValue) { },

            _onchange: function () {
                //将element的值转换为int类型
                var value = parseInt(this.element.value, 10);

                if (!isNaN(value)) {
                    this.onvaluechange(value);
                    this.element.color = "black";
                    WinJS.log && WinJS.log("", "sample", "status");
                } else {
                    this.element.color = "red";
                    WinJS.log && WinJS.log("Illegal value entered", "sample", "error");
                }
            }
        }
    );

    // This is the binding source - it's an object with two nested sub-objects
	var objectPosition = WinJS.Binding.as({
	    position: { x: 10, y: 10 },
	    color: { r: 128, g: 128, b: 128 }
	});

    // Track the current position so that we can erase and redraw
	var currentPosition = {
	    x: objectPosition.position.x,
	    y: objectPosition.position.y
	};

	var inputs = [];


    //绑定输入事件
	function bindInputEvents() {
        //数据源 ： 数组里套了5个数组
	    var inputFieldMap = [
            ["X", objectPosition.position.x, function (v) { objectPosition.position.x = v; }],
            ["Y", objectPosition.position.y, function (v) { objectPosition.position.y = v; }],
            ["Red", objectPosition.color.r, function (v) { objectPosition.color.r = v; }],
            ["Green", objectPosition.color.g, function (v) { objectPosition.color.g = v; }],
            ["Blue", objectPosition.color.b, function (v) { objectPosition.color.b = v; }]
	    ];

	    //inputs里面存放了5个NumericTextInput对象
	    //selector 为inputFieldMap中的每条数据
	    inputs = inputFieldMap.map(function (selector) {
	        //selector[0]、selector[1]、selector[2] 分别是selector中的每条数据
	        new NumericTextInput(document, ".bindingDescriptorsInput" + selector[0],
                selector[1], selector[2]);
	    });
	}

    // Location of rectangle has changed
	function onPositionChange(newValue, oldValue) {
	    erase();
	    currentPosition = { x: objectPosition.position.x, y: objectPosition.position.y };
	    draw();
	}

    // Redraw in new color
	function onColorChange(newValue, oldValue) {
	    draw();
	}

	function erase() {
	    context.fillStyle = "rgb(29,29,29)";
	    context.fillRect(currentPosition.x, currentPosition.y, 75, 75);
	}

	function draw() {
	    var colors = [objectPosition.color.r,
            objectPosition.color.g,
            objectPosition.color.b];

	    var fillColor = "rgb(" + colors.join(",") + ")";
	    context.fillStyle = fillColor;
	    context.fillRect(currentPosition.x, currentPosition.y, 75, 75);
	}
})();
