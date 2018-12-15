/**
 * @desc List-App
 * @date 2018-12-13
 * @author XDP
 */
/*
// 清除之前项目的本地存储数据
localStorage.removeItem("List_todo");
let model = Model(),
    render = Render();

// 入口
render.init();

// 默认显示todo列表页面
$("#todoList").show();
*/

(function () {
    let addBtn = $("#addBtn"),
        addContent = $("#addContent"),
        okAddBtn = $("#okAddBtn"),
        inputValue = $("#inputValue");
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
            inputValue.value = "";
            addContent.style.top = addContent.style.left = "100%";
            okAddBtn.style.bottom = "0px";
            okAddBtn.css("bottom", "5px");
            okAddBtn.css("background-color", "#757575");
            inputValue.css("border-bottom-color", "#BDBDBD");

            // TODO:切换到todo列表
            completedList.style.display = "none";
            todoList.style.display = "block";

        }
    });

    //对input绑定输入监听
    inputValue.bind("input propertychange", function () {
        let vInput = inputValue.val();
        // 如果有输入则控件变色
        if (vInput !== "") {
            okAddBtn.css("background-color", "#238cee");
            inputValue.css("border-bottom-color", "#212121");
        }
        // 如果输入为空则变为默认色
        if (vInput === "") {
            okAddBtn.css("background-color", "757575");
            inputValue.css("border-bottom-color", "#BDBDBD");
        }
    });
})();

/*

/!**
 * @desc 清除/完成操作
 * @date 2018-12-13
 * @author XDP
 *!/
// todoList.getElementsByClassName("clearTask")[0].onclick = function () {
//     model.clearTask('List_todo', this.parentNode.getElementsByTagName('i')[0].textContent);
// }
// todoList.getElementsByClassName("finishTask")[0].onclick = function () {
//     model.completeTask(this.parentNode.textContent);
//     model.clearTask('List_todo', this.parentNode.getElementsByTagName('i')[0].textContent);
// }
// completedList.getElementsByClassName("clearTask")[0].onclick = function () {
//     model.clearTask('List_completed', this.parentNode.getElementsByTagName('i')[0].textContent);
// }

$("#todoList").on("click", ".clear", function () {
    console.log($(this).parent().find('i').text());
    model.clearTask('List_todo', $(this).parent().find('i').text());
});
$("#todoList").on("click", ".finish", function () {
    //先添加到已完成列表，然后在当前删除
    model.completeTask($(this).parent().find('.task-title').text());
    model.clearTask('List_todo', $(this).parent('.task-item').find('i').text());
});
$("#completedList").on("click", ".clear", function () {
    model.clearTask('List_completed', $(this).parent().find('i').text());
});

/!**
 * @desc 数据存储---本地
 * @date 2018-12-13
 * @author XDP
 *!/
function Model() {
    let addTask = function (add) {      // 添加
        let taskItem = [localStorage["List_todo"]];
        taskItem.push(add);
        localStorage.setItem("List_todo", taskItem);
        render.init();
    };
    let completeTask = function (complete) {        //完成
        let taskItem = [localStorage["List_completed"]];
        taskItem.push(complete);
        localStorage.setItem("List_completed", taskItem);
        var newArr = localStorage['List_completed'].split(',');
        let ele = document.getElementById("completedList");
        ele.innerHTML = "";
        let taskDom = parseDom(
            "<li class='task-item'>"
            + "<span class='task-title'>" + complete + "</span>"
            + "<i>" + (newArr.length - 1) + "</i>"
            + "<div class='clearTask fa fa-trash-o'>" + "</div>"
            + "<div class='finishTask fa fa-check-circle-o'>" + "</div>"
            + "</li>");
        // 注意，insertBefore必须插入节点，不能是字符串
        ele.insertBefore(taskDom[0], ele.childNodes[0]);
    };
    var clearTask = function (list, i) {
        var arr, listName, el;
        if (list == "List_todo") {
            listName = "List_todo";
            el = "todoList";
        } else if (list == "List_completed") {
            listName = "List_completed";
            el = "completedList";
        }
        arr = localStorage[listName].split(',');
        arr.splice(i, 1);
        localStorage.setItem(listName, arr);
        render.init(el);
    }
    return {
        addTask: addTask,
        completeTask: completeTask,
        clearTask: clearTask
    };
    return {
        addTask: addTask,
        completeTask: completeTask,
        // clearTask: clearTask
    };
}

/!**
 * @desc 渲染器---任务列表
 * @date 2018-12-13
 * @author XDP
 *!/
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
                    + "<div class='clearTask fa fa-trash-o'>" + "</div>"
                    + "<div class='finishTask fa fa-check-circle-o'>" + "</div>"
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
