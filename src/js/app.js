/**
 * @desc List-App
 * @date 2018-12-13
 * @author XDP
 */
// 清除之前项目的本地存储数据
// localStorage.removeItem("LIST_TODO");
// localStorage.removeItem("LIST_COMPLETED");

let model = Model(),
    render = Render(),
    menuItemFunc = MenuItemFunc();

// 入口
render.init();

// 获取DOM
let addBtn = $("#addBtn"),
    addContent = $("#addContent"),
    okAddBtn = $("#okAddBtn"),
    inputValue = $("#inputValue");

let todoList = $("#todoList"),
    completedList = $("#completedList");

let appMenuBtn = $("#appMenuBtn"),
    appChangeBtn = $("#appChangeBtn"),
    menuContent = $("#menuContent");

let cover = $("#cover");

// 默认显示todo列表页面
todoList.show(100);

/**
 * @desc 切换完成/计划项目
 *       对列表进行渲染
 * @date 2018-12-16
 * @author XDP
 */
appChangeBtn.on("click", function () {
    (todoList.css("display") === "none") ? render.init("#todoList") : render.init("#completedList");
    // 切换显示
    todoList.fadeToggle(100);
    completedList.fadeToggle(100);
});

/**
 * @desc 添加任务按钮模块
 * @date 2018-12-15
 * @author XDP
 */
(function () {
    // 添加新的任务
    addBtn.on("click", function () {
        if (addContent.css("display") === "none") {       // 判断添加任务页面是否存在
            // 移动任务页面
            addContent.show(100);
            inputValue.on({
                "focus": function () {
                    $(this).css("color", "#000");
                },
                "blur": function () {
                    $(this).css("color", "#567");
                },
            }).focus();
            //按钮旋转
            addBtn.css({
                "transform": "rotate(-45deg)",
                "-webkit-transform": "rotate(-45deg)"
            });
            //弹出子按钮
            okAddBtn.css("bottom", "85px");
        } else {
            addContent.hide(100);
            addBtn.css({
                "transform": "rotate(0deg)",
                "-webkit-transform": "rotate(0deg)"
            });
            okAddBtn.css("bottom", "0px");
        }
    });

    // 确认添加任务
    okAddBtn.on("click", function () {
        let text = inputValue.val();
        if (text) {
            model.addTask(text);
            inputValue.val("");
            addContent.fadeOut(100);
            addBtn.css({
                "transform": "rotate(0deg)",
                "-webkit-transform": "rotate(0deg)"
            });
            okAddBtn.css("bottom", "0px");
            okAddBtn.css("background-color", "#757575");
            inputValue.css("border-bottom-color", "#BDBDBD");
            // TODO:关闭侧边栏和遮罩层
            // 切换到todo列表
            $("#completedList").fadeOut(100);
            $("#todoList").fadeIn(100);
        }
    });

    // 对input绑定输入监听
    inputValue.on("input propertychange", function () {
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

    // 监听切换颜色
    setInterval(function () {
        (completedList.css("display") === "block") ? appMenuBtn.css("color", "#ff9775") : appMenuBtn.css("color", "#FFFFFF");
    }, 100);
})();

/**
 * @desc 清除/完成操作
 * @date 2018-12-13
 * @author XDP
 */
todoList.on("click", ".clear-task", function () {
    model.clearTask("LIST_TODO", $(this).siblings("i").text());
});
todoList.on("click", ".finish-task", function () {
    model.completeTask($(this).siblings(".task-title").text());
    model.clearTask("LIST_TODO", $(this).siblings("i").text());
});
completedList.on("click", ".clear-task", function () {
    model.clearTask("LIST_COMPLETED", $(this).siblings("i").text());
});
completedList.on("click", ".finish-task", function () {
    model.redoTask($(this).siblings(".task-title").text());
    model.clearTask("LIST_COMPLETED", $(this).siblings("i").text());
});

/**
 * @desc 数据存储---本地
 *       JSON.stringify()可以将JSON对象转换为字符串
 *       JSON.parse()方法可以将字符串转换为JSON对象
 * @date 2018-12-13
 * @author XDP
 */
function Model() {
    let addTask = function (addItem) {      // 添加
        let taskItem = localStorage.getItem("LIST_TODO");
        taskItem += "," + addItem;
        localStorage.setItem("LIST_TODO", taskItem);
        render.init();
    };
    let completeTask = function (completeItem) {        // 完成
        let taskItem = localStorage["LIST_COMPLETED"];
        taskItem += "," + completeItem;
        localStorage.setItem("LIST_COMPLETED", taskItem);
        let newArr = localStorage["LIST_COMPLETED"].split(",");
        $("#completedList").prepend(
            "<li class='task-item'>"
            + "<span class='task-title'>" + completeItem + "</span>"
            + "<i>" + (newArr.length - 1) + "</i>"
            + "<div class='clear-task fa fa-trash-o'></div>"
            + "</li>");
        // 注意，如果使用原生JS，insertBefore必须插入节点，不能是字符串
    };
    let redoTask = function (redoItem) {        // 重做
        let taskItem = localStorage["LIST_TODO"];
        taskItem += "," + redoItem;
        localStorage.setItem("LIST_TODO", taskItem);
        let newArr = localStorage["LIST_TODO"].split(",");
        $("#todoList").prepend(
            "<li class='task-item'>"
            + "<span class='task-title'>" + redoItem + "</span>"
            + "<i>" + (newArr.length - 1) + "</i>"
            + "<div class='clear-task fa fa-trash-o'></div>"
            + "</li>");
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
        arr = localStorage[listName].split(",");
        arr.splice(i, 1);
        localStorage.setItem(listName, arr);
        render.init(el);
    };
    return {
        addTask: addTask,
        completeTask: completeTask,
        redoTask: redoTask,
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
            listName,
            diffClass;
        if (el === "#todoList") {
            listName = "LIST_TODO";
            diffClass = "<div class='finish-task fa fa-check-circle-o'></div>";
        } else if (el === "#completedList") {
            listName = "LIST_COMPLETED";
            diffClass = "<div class='finish-task fa fa-refresh'></div>";
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
                    + "<div class='clear-task fa fa-trash-o'></div>"
                    + diffClass
                    + "</li>");
            }
        }
    };
    return {
        init: init
    };
}

/* 原生js使用，替代prepend()方法
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

// 呼出呼入菜单栏
appMenuBtn.on("click", function () {
    if (menuContent.css("left") === "-260px") {
        menuContent.css("left", "0");
        cover.fadeIn(100);
    } else {
        hideSidebar();
        cover.fadeOut(100);
    }
});

// 关闭侧边栏
function hideSidebar() {
    menuContent.css("left", "-260px");
}

//点击遮罩层隐藏关闭侧边栏
cover.on("click", function () {
    hideSidebar();
    cover.fadeOut(100);
});

/**
 * @desc 菜单栏调用页面
 * @date 2018-12-18
 * @author XDP
 */
$(".menu-item").on("click", function () {
    hideSidebar();
    let data = $(this).attr("data");
    switch (data) {
        case "todo" :
            menuItemFunc.listPage("todo");
            break;
        case "completed":
            menuItemFunc.listPage("completed");
            break;
        case "changeColor":
            menuItemFunc.changeColor();
            break;
        case "about":
            menuItemFunc.aboutApp();
            break;
        default:
            console.log('no data');
    }
});

function MenuItemFunc() {
    let listPage = function (type) {
        cover.fadeOut(100);
        if (type === "todo") {
            completedList.fadeOut(100);
            todoList.fadeIn(100);
        } else if (type === "completed") {
            if (completedList.html() === '') {
                render.init("#completedList");
            }
            render.init("#completedList");
            todoList.fadeOut(100);
            completedList.fadeIn(100);
        }
    };
    let changeColor = function () {
        subMenuPanel();
        colorPanel();
        // showHeaderBtn();
    };
    let aboutApp = function () {
        subMenuPanel();
        aboutPanel();
    };
    return {
        listPage: listPage,
        changeColor: changeColor,
        aboutApp: aboutApp,
    };
}

// 菜单卡片
let subMenuPanel = function () {
    $('#appMenuBtn').fadeOut(100);
    $('#menuSubCard').fadeIn(100);
    $('#appBackBtn').fadeIn(100);
    //关闭当前菜单选项
    $('#cover, #appBackBtn').on("click", function () {
        cover.fadeOut(100);
        $('#menuSubCard').fadeOut(100);
        $('#appBackBtn').fadeOut(100);
        $('#appMenuBtn').fadeIn(100);
    });
};

// 换肤功能
function appColor() {
    let mainColor = localStorage.getItem("APP_COLOR") || "#2196F3",
        secColor = "#FFC107";
    $("#header").css("background-color", mainColor);
    $("#addBtn").css("background-color", secColor);
    return {
        mainColor: mainColor
    };
}

//组装"换肤"面板
function colorPanel() {
    let html = "<ul class=setColorPanel>" +
        "<li class=colorItem data=#25b99a>" +
        "<span>Green</span>" +
        "<div class='colorBlock cGreen'></div></li>" +
        "<li class=colorItem data=#F44336>" +
        "<span>Red</span>" +
        "<div class='colorBlock cRed'></div></li>" +
        "<li class=colorItem data=#2196F3>" +
        "<span>Blue</span>" +
        "<div class='colorBlock cBlue'></div></li>" +
        "</ul>";
    $('#menuSubCard').html(html);
    $('.colorItem').on("click", function () {
        //颜色 本地存储
        localStorage["APP_COLOR"] = $(this).attr('data');
        appColor();
        showHeaderBtn();
    });
}

//组装"关于"面板
function aboutPanel() {
    let html = "<div class='aboutApp'><p><b>待办事项应用</b><br>当前为测试版本，持续更新中<br></p></div>";
    $("#menuSubCard").html(html);
}

//滑动智能隐藏 header和btn
(function () {
    // let sctA = $(document).scrollTop(),
    //     headerHeight = $('#header').height();
    //
    // $(window).scroll(function(event) {
    //     let sctB = $(document).scrollTop();
    //
    //     if(sctB>headerHeight){
    //         $('#header').addClass('headerUp');
    //         $('.btnBox').addClass('btnDown');
    //     }else{
    //         $('#header').removeClass('headerUp');
    //         $('.btnBox').removeClass('btnDown');
    //     }
    //     if(sctB>sctA){
    //         $('#header').removeClass('headerDown');
    //         $('.btnBox').removeClass('btnUp');
    //     }else{
    //         $('#header').addClass('headerDown');
    //         $('.btnBox').addClass('btnUp');
    //     }
    //     sctA = $(document).scrollTop();
    // });
})();

function showHeaderBtn() {
    // $('#header').addClass('headerDown');
    // $("#btnBox").addClass('btnUp');
}