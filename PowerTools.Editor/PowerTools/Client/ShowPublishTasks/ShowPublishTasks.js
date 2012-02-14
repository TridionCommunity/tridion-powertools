
$evt.addEventHandler($display, "start", onDisplayStarted);

function onDisplayStarted() {

    $evt.removeEventHandler($display, "start", onDisplayStarted);

    if ($display.getView().getId() == "PublishQueueView") {
        var btnShowTask = $controls.getControl($("#BtnShowTasks"), "Tridion.Controls.Button");
        if (btnShowTask) {
            btnShowTask.fireEvent("click");
        }
    }
}
