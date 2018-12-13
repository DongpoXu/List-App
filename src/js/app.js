/**
 * @desc List-App
 * @date 2018-12-13
 * @author XDP
 */

// 清除之前项目的本地存储数据
// localStorage.removeItem("List_todo");
let model = Model(),
    render = Render();

console.log("List-App test");

// 入口
render.init();
// 获取DOM
let addContent = document.getElementById("addContent");
let addBtn = document.getElementById("addBtn");     // 添加事项
let okAddBtn = document.getElementById("okAddBtn");     // 添加事项
let inputValue = document.getElementById("inputValue");     // 添加事项

let completedList = document.getElementById("completedList");
let todoList = document.getElementById("todoList");

// 清除/完成操作按钮
let clearTaskBtn = document.getElementById("clearTask");
let finishTaskBtn = document.getElementById("finishTask");

// 默认显示todo列表页面
todoList.style.display = "block";

window.onload = function () {

    // 添加新的任务
    addBtn.onclick = function () {
        if (addContent.style.top !== "0px") {       // 判断添加任务页面是否存在
            // 移动任务页面
            addContent.style.top = addContent.style.left = "0px";
            inputValue.focus();
            //弹出子按钮
            okAddBtn.style.bottom = "85px";
        } else {
            addContent.style.top = addContent.style.left = "100%";
            okAddBtn.style.bottom = "0px";
        }
    };

    // 确认添加任务
    okAddBtn.onclick = function () {
        let text = inputValue.value;
        if (text) {
            model.addTask(text);
            inputValue.value = "";
            addContent.style.top = addContent.style.left = "100%";
            okAddBtn.style.bottom = "0px";
            okAddBtn.style.backgroundColor = "#757575";
            inputValue.style.borderColor = "#BDBDBD";

            // TODO:切换到todo列表
            completedList.style.display = "none";
            todoList.style.display = "block";

        }
    };

    //对input绑定输入监听
    inputValue.oninput = function () {
        let vInput = inputValue.value;
        // 如果有输入则控件变色
        if (vInput !== "") {
            okAddBtn.style.backgroundColor = "#238cee";
            inputValue.style.borderColor = "#212121";
        }
        // 如果输入为空则变为默认色
        if (vInput === "") {
            okAddBtn.style.backgroundColor = "#757575";
            inputValue.style.borderColor = "#BDBDBD";
        }
    };
};

/**
 * @desc 清除/完成操作
 * @date 2018-12-13
 * @author XDP
 */
clearTaskBtn.onclick = function () {
    console.log("delete");
}
finishTaskBtn.onclick = function () {
    console.log("finish");
    // model.completeTask(this.parent().find(".task-title").text());
}

/**
 * @desc 数据存储---本地
 * @date 2018-12-13
 * @author XDP
 */
function Model() {
    let addTask = function (add) {      // 添加
        let taskItem = [localStorage["List_todo"]];
        taskItem.push(add);
        localStorage.setItem("List_todo", taskItem);
        render.init();
    };
    let completeTask = function (complete) {        //完成
        let taskItem = [localStorage["List_completed"]];
        taskItem.push(add);
        localStorage.setItem("List_completed", taskItem);
        render.init();
    }
    return {
        addTask: addTask,
        completeTask: completeTask,
        // clearTask: clearTask
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
        var el = e || "todoList",
            listName;

        if (el === "todoList") {
            listName = "List_todo";
        } else if (el === "completedList") {
            listName = "List_completed";
        }

        let ele = document.getElementById(el);
        ele.innerHTML = "";

        if (localStorage[listName]) {
            tasks = localStorage[listName].split(",");
            for (let i = 1; i < tasks.length; i++) {
                taskTitle = tasks[i];
                let taskDom = parseDom(
                    "<li class='task-item'>"
                    + "<span class='task-title'>" + taskTitle + "</span>"
                    + "<i>" + i + "</i>"
                    + "<div class='clearTask fa fa-trash-o' id='clearTask'>" + "</div>"
                    + "<div class='finishTask fa fa-check-circle-o' id='finishTask'>" + "</div>"
                    + "</li>");
                // 注意，insertBefore必须插入节点，不能是字符串
                ele.insertBefore(taskDom[0], ele.childNodes[0]);
            }
        }
    };
    return {
        init: init
    };
}

/**
 * @desc 字符串转换为DOM节点
 * @date 2018-12-13
 * @author XDP
 */
function parseDom(str) {
    let objE = document.createElement("div");
    objE.innerHTML = str;
    return objE.childNodes;
}

