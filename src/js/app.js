window.onload = function () {
    console.log("List-App test");

    // 获取DOM
    let addContent = document.getElementById("addContent");
    let addBtn = document.getElementById("addBtn");     // 添加事项
    let okAddBtn = document.getElementById("okAddBtn");     // 添加事项

    addBtn.onclick = function () {
        if (addContent.style.top !== "0px") {       // 判断添加任务页面是否存在
            // 移动添加任务页面和确认按钮
            addContent.style.top = addContent.style.left = "0px";
            okAddBtn.style.bottom = "85px";
        } else {
            addContent.style.top = addContent.style.left = "100%";
            okAddBtn.style.bottom = "0px";
        }
    }
};
