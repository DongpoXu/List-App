/**
 * @desc List-App
 * @date 2018-12-13
 * @author XDP
 */
// 清除之前项目的本地存储数据
// localStorage.removeItem("LIST_TODO");
// localStorage.removeItem("LIST_COMPLETED");

let model = Model(),
    render = Render();

// 入口
render.init();

// 获取DOM
let addBtn = $("#addBtn"),
    addContent = $("#addContent"),
    okAddBtn = $("#okAddBtn"),
    inputValue = $("#inputValue");

let todoList = $("#todoList"),
    completedList = $("#completedList");

let appMenuBtn = $("#appMenuBtn");

// 默认显示todo列表页面
todoList.show();

// 切换完成以及计划
appMenuBtn.on("click",function () {
    todoList.toggle();
    completedList.toggle();
});

/**
 * @desc 添加任务按钮模块
 * @date 2018-12-15
 * @author XDP
 */
(function () {
    // 添加新的任务
    addBtn.click(function () {
        if (addContent.css("display") === "none") {       // 判断添加任务页面是否存在
            // 移动任务页面
            addContent.show("100");
            inputValue.focus();
            //按钮旋转
            addBtn.css({
                'transform': 'rotate(-45deg)',
                '-webkit-transform': 'rotate(-45deg)'
            });
            //弹出子按钮
            okAddBtn.css("bottom", "85px");
        } else {
            addContent.hide("100");
            addBtn.css({
                'transform': 'rotate(0deg)',
                '-webkit-transform': 'rotate(0deg)'
            });
            okAddBtn.css("bottom", "0px");

        }
    });

    // 确认添加任务
    okAddBtn.click(function () {
        let text = inputValue.val();
        if (text) {
            model.addTask(text);
            inputValue.val("");
            addContent.fadeOut("100");
            addBtn.css({
                'transform': 'rotate(0deg)',
                '-webkit-transform': 'rotate(0deg)'
            });
            okAddBtn.css("bottom", "0px");
            okAddBtn.css("background-color", "#757575");
            inputValue.css("border-bottom-color", "#BDBDBD");
            // TODO:关闭侧边栏和遮罩层
            // 切换到todo列表
            $('#completedList').fadeOut();
            $('#todoList').fadeIn();
        }
    });

    //对input绑定输入监听
    inputValue.bind("input propertychange", function () {
        let vInput = inputValue.val();
        // 如果有输入则控件变色
        if (vInput !== "") {
            okAddBtn.css("background-color", appColor().mainColor);
            inputValue.css("border-bottom-color", "#212121");
        }
        // 如果输入为空则变为默认色
        if (vInput === "") {
            okAddBtn.css("background-color", "757575");
            inputValue.css("border-bottom-color", "#BDBDBD");
        }
    });
})();

/**
 * @desc 清除/完成操作
 * @date 2018-12-13
 * @author XDP
 */
todoList.on("click", ".clear-task", function () {
    model.clearTask('LIST_TODO', $(this).siblings("i").text());
});
todoList.on("click", ".finish-task", function () {
    model.completeTask($(this).siblings(".task-title").text());
    model.clearTask('LIST_TODO', $(this).siblings("i").text());
});
completedList.on("click", ".clear-task", function () {
    model.clearTask('LIST_COMPLETED', $(this).siblings("i").text());
});

/**
 * @desc 数据存储---本地
 * @date 2018-12-13
 * @author XDP
 */
function Model() {
    let addTask = function (addItem) {      // 添加
        let taskItem = [localStorage["LIST_TODO"]];
        taskItem.push(addItem);
        localStorage.setItem("LIST_TODO", taskItem);
        render.init();
    };
    let completeTask = function (completeItem) {        // 完成
        let taskItem = [localStorage["LIST_COMPLETED"]];
        taskItem.push(completeItem);
        localStorage.setItem("LIST_COMPLETED", taskItem);
        let newArr = localStorage['LIST_COMPLETED'].split(',');
        $("#completedList").prepend(
            "<li class='task-item'>"
            + "<span class='task-title'>" + completeItem + "</span>"
            + "<i>" + (newArr.length - 1) + "</i>"
            + "<div class='clear-task fa fa-trash-o'>" + "</div>"
            + "<div class='finish-task fa fa-check-circle-o'>" + "</div>"
            + "</li>");
        // 注意，如果使用原生JS，insertBefore必须插入节点，不能是字符串
    };
    let clearTask = function (listItem, i) {        // 删除
        let arr,        // 缓存数组
            listName,   // 本地缓存对象
            el;         // DOM对象
        if (listItem === "LIST_TODO") {
            listName = "LIST_TODO";
            el = "#todoList";
        } else if (listItem === "LIST_COMPLETED") {
            listName = "LIST_COMPLETED";
            el = "#completedList";
        }
        arr = localStorage[listName].split(',');
        console.log(i);
        arr.splice(i, 1);
        localStorage.setItem(listName, arr);
        render.init(el);
    };
    return {
        addTask: addTask,
        completeTask: completeTask,
        clearTask: clearTask
    };
}

/**
 * @desc 渲染器---任务列表
 * @date 2018-12-13
 * @author XDP
 */
function Render() {
    let tasks,
        taskTitle;

    let init = function (e) {
        let el = e || "#todoList",
            listName;
        if (el === "#todoList") {
            listName = "LIST_TODO";
        } else if (el === "#completedList") {
            listName = "LIST_COMPLETED";
        }

        appColor();
        $(el).html("");

        if (localStorage[listName]) {
            tasks = localStorage[listName].split(",");
            for (let i = 1; i < tasks.length; i++) {
                taskTitle = tasks[i];
                $(el).prepend(
                    "<li class='task-item'>"
                    + "<span class='task-title'>" + taskTitle + "</span>"
                    + "<i>" + i + "</i>"
                    + "<div class='clear-task fa fa-trash-o'>" + "</div>"
                    + "<div class='finish-task fa fa-check-circle-o'>" + "</div>"
                    + "</li>");
            }
        }
    };
    return {
        init: init
    };
}

/* 原生js使用，prepend()方法
/!**
 * @desc 字符串转换为DOM节点
 * @date 2018-12-13
 * @author XDP
 *!/
function parseDom(str) {
    let objE = document.createElement("div");
    objE.innerHTML = str;
    return objE.childNodes;
}
*/

/**
 * @desc 换肤功能
 * @date 2018-12-15
 * @author XDP
 */
function appColor() {
    let mainColor = localStorage.APP_COLOR || "#238cee",
        secColor = "#FFC107";
    $('#header').css('background-color', mainColor);
    $('#addBtn').css('background-color', secColor);
    return {
        mainColor: mainColor
    };
}
